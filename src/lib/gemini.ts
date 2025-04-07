import { GoogleGenerativeAI } from "@google/generative-ai";
import { Document } from '@langchain/core/documents';
import "dotenv/config";
import { globalRateLimiter } from './rateLimitUtility';

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY ?? '');
const model = genAI.getGenerativeModel({
    model: 'gemini-1.5-flash'
});
const embeddingModel = genAI.getGenerativeModel({
    model: "text-embedding-004",
});

export const aiSummerizeCommit = async (diff: string) => {
    return globalRateLimiter.executeWithRateLimit(async () => {
        try {
            const response = await model.generateContent([
                `You are an expert programmer, and you are trying to summarize a git diff.
Reminders about the git diff format:
for every file, there are a few metadata lines, like (for example):
\`\`\`
diff --git a/lib/index.js b/lib/index.js
index 8d6f2a1..e4f0a5b 100644
\`\`\`
This means that \`lib/index.js\` was modified in the commit, Note that this is only an example.
Then there is a specifier of the lines that were modified.
A line starting with \`+\` means that the line was added,
A line starting with \`-\` means that the line was removed.
A line that starts with neither \`+\` nor \`-\` is code given for context and better understanding.
It is not part of the diff.
[...]
EXAMPLE SUMMERY COMMENTS:
\`\`\`
* Raised the amount of returned recording from \`10\` to \`100\` [packages/server/recordings_api.ts], [packages/server/constants.ts]
* Fixed a typo in the github action name [.github/workflows/gpt-summarizer.yml]
* Moved the \`octokit\` initialization to a seperate file [src/octokit.ts], [src/index.ts]
* Added an OpenAI API for completions [packages/utils/apis/openai.ts]
* Lowered Numeric tolerance for test files
\`\`\`
Most commits will have less comments than this examples list.
The last comment does not include the file names,
because there were more that two relavant files in the hypothetical commit.
Do not include parts of the example in your summary.
It is given only as an example of appropriate comments.`,
                `Please summarise the following diff file: \n\n${diff}`,
            ]);
            return response.response.text();
        } catch (error) {
            console.error("Error summarizing commit diff:", error);
            return "";
        }
    });
};

export async function summariseCode(doc: Document) {
    return globalRateLimiter.executeWithRateLimit(async () => {
        console.log("Getting summary for:", doc.metadata.source);

        try {
            const codeSnippet = doc.pageContent.slice(0, 10000);
            const filePath = doc.metadata.source?.toLowerCase() || '';

            let prompt = "";

            if (filePath.endsWith(".md") || filePath.includes("readme")) {
                prompt = `Summarize this documentation file for a new developer joining the project in 100 words or less:\n\n${codeSnippet}`;
            } else if (
                filePath.includes("config") ||
                filePath.endsWith(".json") ||
                filePath.endsWith(".env")
            ) {
                prompt = `Explain the purpose of this configuration file in 100 words or less for someone new to the project:\n\n${codeSnippet}`;
            } else {
                prompt = `
You are a senior software engineer onboarding a junior developer.

Explain in 100 words or less what the following file (${filePath}) does, and its role in the project.

Here is the file content:
---
${codeSnippet}
---`;
            }

            const response = await model.generateContent([prompt]);
            return response.response.text();
        } catch (error) {
            console.error("Gemini summarization failed:", error);
            return "This file is part of the project but could not be summarized due to limitations.";
        }
    });
}

export async function generateEmbedding(summary: string) {
    return globalRateLimiter.executeWithRateLimit(async () => {
        try {
            if (!summary || summary.length === 0) {
                console.warn("Empty summary passed to generateEmbedding.");
                return [];
            }

            const embeddingModel = genAI.getGenerativeModel({
                model: "text-embedding-004",
            });

            const result = await embeddingModel.embedContent(summary);
            return result.embedding.values;
        } catch (error) {
            console.error("Embedding generation failed:", error);
            return [];
        }
    });
}



// import {GoogleGenerativeAI} from "@google/generative-ai";
// import {Document} from '@langchain/core/documents'
// import "dotenv/config"

// const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY || '');
// const model = genAI.getGenerativeModel({
//     model: 'Gemini-2.0-Flash-Lite'
// })

// export const aiSummerizeCommit = async (diff: string) => {
//     const response = await model.generateContent([
//         `You are an expert programmer, and you are trying to summarize a git diff.
// Reminders about the git diff format:
// for every file, there are a few metadata lines, like (for example):
// \`\`\`
// diff --git a/lib/index.js b/lib/index.js
// index 8d6f2a1..e4f0a5b 100644
// --- a/lib/index.js
// +++ b/lib/index.js
// \`\`\`
// This means that \`lib/index.js\` was modified in the commit, Note that this is only an example.
// Then there is a specifier of the lines that were modified.
// A line starting with \`+\` means that the line was added,
// A line starting with \`-\` means that the line was removed.
// A line that starts with neither \`+\` nor \`-\` is code given for context and better understanding.
// It is not part of the diff.
// [...]
// EXAMPLE SUMMERY COMMENTS:
// \`\`\`
// * Raised the amount of returned recording from \`10\` to \`100\` [packages/server/recordings_api.ts], [packages/server/constants.ts]
// * Fixed a typo in the github action name [.github/workflows/gpt-summarizer.yml]
// * Moved the \`octokit\` initialization to a seperate file [src/octokit.ts], [src/index.ts]
// * Added an OpenAI API for completions [packages/utils/apis/openai.ts]
// * Lowered Numeric tolerance for test files
// \`\`\`
// Most commits will have less comments than this examples list.
// The last comment does not include the file names,
// because there were more that two relavant files in the hypothetical commit.
// Do not include parts of the example in your summary.
// It is given only as an example of appropriate comments.`,
//     `Please summarise the following diff file: \n\n${diff}`,
//     ])

//     return response.response.text();
// }


// export async function summariseCode(doc: Document){
//     console.log("getting summary for", doc.metadata.source);
//     try {
//         const code = doc.pageContent.slice(0, 10000);
//     const response=await model.generateContent([
//         `You are an intelligent senior software engineer who specialises in onboarding junior software engineer onto projects.`,
//         `You are onboarding a junior software engineer and explaining to them the purpose of the ${doc.metadata.source} file.
//         Here is the code:
//         ---
//         ${code}
//         ---
//         Give a summary no more than 100 words of the code above.
//         `
//     ])

//     return response.response.text();
//     } catch (error) {
//         return '';
//     }
// }

// // console.log(await summariseCode(new Document({
// //     pageContent: "Hello world",
// //     metadata: {
// //         source: "test.js"
// //     }
// // })))


// export async function generateEmbedding(summary: string) {
//     const model = genAI.getGenerativeModel({
//         model: "text-embedding-004",
//     })
//     const result = await model.embedContent(summary);
//     const embedding = result.embedding
//     return embedding.values;
// }


// // console.log(await generateEmbedding("Hello world"))

