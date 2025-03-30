import { GithubRepoLoader } from "@langchain/community/document_loaders/web/github";
import { summariseCode, generateEmbedding } from "./gemini";
import { Document } from '@langchain/core/documents';
import { prisma } from "@/server/db";
import PQueue from 'p-queue';

const githubQueue = new PQueue({ concurrency: 5, interval: 1000 });

export const loadGithubRepo = async (githubUrl: string, githubToken?: string) => {
    const loader = new GithubRepoLoader(githubUrl, {
        accessToken: githubToken ?? '',
        branch: 'main',
        ignoreFiles: ['package-lock.json', 'yarn.lock', 'pnpm-lock.yaml', 'bun.lockb', '.svg' ],
        recursive: true,
        unknown: "warn",
        maxConcurrency: 2,
    });
    try {
        const docs = await loader.load();
        return docs;
    } catch (error) {
        console.error("Error loading GitHub repository:", error);
        return [];
    }
};

export const indexGithubRepo = async (projectId: string, githubUrl: string, githubToken?: string) => {
    const docs = await loadGithubRepo(githubUrl, githubToken);
    if (!docs || docs.length === 0) {
        console.warn("No documents loaded from GitHub repository.");
        return;
    }

    const allEmbeddings = await generateEmbeddings(docs);

    await Promise.allSettled(allEmbeddings.map(async (embedding, index) => {
        console.log(`processing ${index} of ${allEmbeddings.length}`);

        if (!embedding) return;

        try {
            const sourceCodeEmbedding = await prisma.sourceCodeEmbedding.create({
                data: {
                    summary: embedding.summary,
                    sourceCode: embedding.sourceCode,
                    fileName: embedding.fileName,
                    projectId,
                }
            });

            await prisma.$executeRawUnsafe(
                `UPDATE "SourceCodeEmbedding"
                 SET "summaryEmbedding" = $1
                 WHERE "id" = $2`,
                embedding.embedding,
                sourceCodeEmbedding.id
            );

        } catch (error) {
            console.error(`Error processing embedding ${index}:`, error);
        }
    }));
};


const generateEmbeddings = async (docs: Document[]) => {
    return await Promise.all(docs.map(async (doc): Promise<{
        summary: string;
        embedding: number[];
        sourceCode: string;
        fileName: string;
    } | null> => {
        try {
            const summary: string = await summariseCode(doc);
            const embedding: number[] = await generateEmbedding(summary);
            
            return {
                summary,
                embedding,
                sourceCode: JSON.stringify(doc.pageContent), 
                fileName: doc.metadata.source as string, 
            };
        } catch (error) {
            console.error("Error generating embeddings for document:", error);
            return null;
        }
    }));
};





















// import { GithubRepoLoader } from "@langchain/community/document_loaders/web/github";
// import { summariseCode } from "./gemini";
// import {Document} from '@langchain/core/documents'
// import { generateEmbedding } from "./gemini";
// import { console } from "inspector";
// import { prisma } from "@/server/db";

// export const loadGithubRepo = async (githubUrl: string, githubToken?: string) => {
//     const loader = new GithubRepoLoader(githubUrl, {
//         accessToken: githubToken || '',
//         branch: 'main',
//         ignoreFiles: ['package-lock.json', 'yarn.lock', 'pnpm-lock.yaml', 'bun.lockb'],
//         recursive: true,
//         unknown: "warn",
//         maxConcurrency: 5,
//     })

//     const docs = await loader.load();
//     return docs;
// }

// // console.log(await loadGithubRepo("https://github.com/Pallavikumarimdb/MindMap"))

// // console.log(await loadGithubRepo(
// //     "https://github.com/Pallavikumarimdb/invocraft",
// //     process.env.GITHUB_TOKEN
// //   ));


// export const indexGithubRepo = async (projectId: string, githubUrl: string, githubToken?: string) => {
//     const docs = await loadGithubRepo(githubUrl, githubToken);
//     const allEmbeddings = await generateEmbeddings(docs);

//     await Promise.allSettled(allEmbeddings.map(async (embedding, index) => {
//         console.log(`processing ${index} of ${allEmbeddings.length}`)
//         if(!embedding) return;

//         const sourceCodeEmbedding = await prisma.sourceCodeEmbedding.create({
//             data: {
//                 summary: embedding.summary,
//                 sourceCode: embedding.sourceCode,
//                 fileName: embedding.fileName,
//                 projectId,
//             }
//         })

//         await prisma.$executeRaw`
//         UPDATE "SourceCodeEmbedding"
//         SET "SummaryEmbedding" = ${embedding.embedding}::vector
//         WHERE "id" = ${sourceCodeEmbedding.id}
//         `
//     }))
// }

// const generateEmbeddings = async (docs: Document[]) => {
//     return await Promise.all(docs.map(async doc => {
//         const summary = await summariseCode(doc);
//         const embedding = await generateEmbedding(summary)
//         return {
//             summary,
//             embedding,
//             sourceCode: JSON.parse(JSON.stringify(doc.pageContent)),
//             fileName: doc.metadata.source,
//         }
//     }))
// }