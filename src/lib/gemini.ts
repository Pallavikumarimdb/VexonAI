import {GoogleGenerativeAI} from "@google/generative-ai";
import "dotenv/config"

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY || '');
const model = genAI.getGenerativeModel({
    model: 'gemini-1.5-flash'
})

export const aiSummerizeCommit = async (diff: string) => {
    const response = await model.generateContent([
        `You are an expert programmer, and you are trying to summarize a git diff.
Reminders about the git diff format:
for every file, there are a few metadata lines, like (for example):
\`\`\`
diff --git a/lib/index.js b/lib/index.js
index 8d6f2a1..e4f0a5b 100644
--- a/lib/index.js
+++ b/lib/index.js
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
    ])

    return response.response.text();
}

