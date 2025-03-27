import { GoogleGenerativeAI } from "@google/generative-ai";
import { Document } from '@langchain/core/documents';
import "dotenv/config";
import { globalRateLimiter } from './rateLimitUtility';

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY || '');
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
        console.log("getting summary for", doc.metadata.source);
        try {
            const code = doc.pageContent.slice(0, 10000);
            const response = await model.generateContent([
                `You are an intelligent senior software engineer who specialises in onboarding junior software engineer onto projects.`,
                `You are onboarding a junior software engineer and explaining to them the purpose of the ${doc.metadata.source} file.
                Here is the code:
                ---
                ${code}
                ---
                Give a summary no more than 100 words of the code above.
                `,
            ]);
            return response.response.text();
        } catch (error) {
            console.error("Error summarizing code:", error);
            return '';
        }
    });
}

export async function generateEmbedding(summary: string) {
    return globalRateLimiter.executeWithRateLimit(async () => {
        const embeddingModel = genAI.getGenerativeModel({
            model: "text-embedding-004",
        });
        try {
            const result = await embeddingModel.embedContent(summary);
            const embedding = result.embedding;
            return embedding.values;
        } catch (error) {
            console.error("Error generating embedding:", error);
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

