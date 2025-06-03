import { GithubRepoLoader } from "@langchain/community/document_loaders/web/github";
import { summariseCode, generateEmbedding } from "./gemini";
import { Document } from '@langchain/core/documents';
import { prisma } from "@/server/db";
import path from 'path';


const MAX_FILE_SIZE_KB = 100; 
const CHUNK_SIZE = 75000;
const GITHUB_API_DELAY_MS = 1000;
const MAX_RETRIES = 3;

export class GitHubRateLimiter {
    private lastRequestTime = 0;
    private queue: Array<() => Promise<any>> = [];
    private isProcessing = false;

    async execute<T>(task: () => Promise<T>): Promise<T> {
        return new Promise((resolve, reject) => {
            this.queue.push(async () => {
                try {
                    const now = Date.now();
                    const timeSinceLastCall = now - this.lastRequestTime;
                    if (timeSinceLastCall < GITHUB_API_DELAY_MS) {
                        await new Promise(resolve => 
                            setTimeout(resolve, GITHUB_API_DELAY_MS - timeSinceLastCall)
                        );
                    }

                    const result = await task();
                    this.lastRequestTime = Date.now();
                    resolve(result);
                } catch (error) {
                    reject(error);
                }
            });

            if (!this.isProcessing) {
                this.processQueue();
            }
        });
    }

    private async processQueue() {
        if (this.queue.length === 0) {
            this.isProcessing = false;
            return;
        }

        this.isProcessing = true;
        const task = this.queue.shift();
        if (task) {
            await task();
            setTimeout(() => this.processQueue(), 100);
        }
    }
}

export const globalGitHubRateLimiter = new GitHubRateLimiter();

export const loadGithubRepo = async (githubUrl: string, githubToken?: string) => {
    if (!githubToken) {
        throw new Error("GitHub token is required");
    }

    const loader = new GithubRepoLoader(githubUrl, {
        accessToken: githubToken,
        branch: 'main',
        ignoreFiles: getIgnoredFiles(),
        recursive: true,
        unknown: "warn",
        maxConcurrency: 1, 
    });

    try {
        const docs = await globalGitHubRateLimiter.execute(() => loader.load());

        return docs.filter(doc => {
            const filePath = doc.metadata.source.toLowerCase();
            return !isBinaryFile(filePath) && 
                   doc.pageContent.length <= MAX_FILE_SIZE_KB * 1024;
        });
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

    for (let i = 0; i < docs.length; i++) {
        
        const doc = docs[i];
        if (!doc) continue;
        
        console.log(`Processing file ${i + 1} of ${docs.length}: ${doc.metadata.source}`);
        
        try {
            const result = await processDocumentWithRetry(doc, projectId);
            if (!result) continue;

            const { summary, embedding, sourceCode } = result;
            
            const sourceCodeEmbedding = await prisma.sourceCodeEmbedding.create({
                data: {
                    summary,
                    sourceCode,
                    fileName: doc.metadata.source,
                    projectId,
                }
            });

            await prisma.$executeRaw`
            UPDATE "SourceCodeEmbedding"
            SET "summaryEmbedding" = ${embedding}::vector
            WHERE "id" = ${sourceCodeEmbedding.id}
            `;

            if (i < docs.length - 1) {
                await new Promise(resolve => setTimeout(resolve, GITHUB_API_DELAY_MS));
            }
        } catch (error) {
            console.error(`Error processing file ${doc.metadata.source}:`, error);
        }
    }
};

async function processDocumentWithRetry(doc: Document, projectId: string, retries = 0): Promise<{
    summary: string;
    embedding: number[];
    sourceCode: string;
} | null> {
    try {
        const chunkedContent = doc.pageContent.length > CHUNK_SIZE
            ? doc.pageContent.substring(0, CHUNK_SIZE) + "\n\n[Content truncated]"
            : doc.pageContent;
        
        const modifiedDoc = new Document({
            pageContent: chunkedContent,
            metadata: doc.metadata
        });

        const summary = await summariseCode(modifiedDoc);
        const embedding = await generateEmbedding(summary);
        
        return {
            summary,
            embedding,
            sourceCode: chunkedContent,
        };
    } catch (error) {
        if (retries < MAX_RETRIES) {
            console.log(`Retrying ${doc.metadata.source} (attempt ${retries + 1})`);
            await new Promise(resolve => setTimeout(resolve, 2000 * (retries + 1)));
            return processDocumentWithRetry(doc, projectId, retries + 1);
        }
        console.error(`Failed to process ${doc.metadata.source} after ${MAX_RETRIES} attempts`);
        return null;
    }
}

function getIgnoredFiles() {
    return [
        'package-lock.json', 'yarn.lock', 'pnpm-lock.yaml', 'bun.lockb',
        '**/*.svg', '**/*.png', '**/*.jpg', '**/*.jpeg', '**/*.gif',
        '**/*.bmp', '**/*.webp', '**/*.mp4', '**/*.mp3', '**/*.avi',
        '**/*.mov', '**/*.wav', '**/*.flac', '**/*.ogg', '**/*.zip',
        '**/*.tar', '**/*.rar', '**/*.7z', '**/node_modules/**',
        '**/*.exe', '**/*.dll', '**/*.so', '**/*.bin'
    ];
}

function isBinaryFile(filePath: string) {
    const binaryExtensions = [
        'png', 'jpg', 'jpeg', 'gif', 'bmp', 'webp', 'svg',
        'mp4', 'mp3', 'avi', 'mov', 'wav', 'flac', 'ogg',
        'zip', 'tar', 'rar', '7z', 'exe', 'dll', 'so', 'bin'
    ];
    
    const ext = path.extname(filePath).toLowerCase().slice(1);
    return binaryExtensions.includes(ext);
}


// LOGIC FOR INDEXING GITHUB REPO WITHOUT RATE LIMITING




// import { GithubRepoLoader } from "@langchain/community/document_loaders/web/github";
// import { summariseCode, generateEmbedding } from "./gemini";
// import { Document } from '@langchain/core/documents';
// import { prisma } from "@/server/db";
 
// export const loadGithubRepo = async (githubUrl: string, githubToken?: string) => {
//     const loader = new GithubRepoLoader(githubUrl, {
//         accessToken: githubToken ?? '',
//         branch: 'main',
//         ignoreFiles: [
//             'package-lock.json', 
//             'yarn.lock', 
//             'pnpm-lock.yaml', 
//             'bun.lockb', 
//             '**/*.svg',
//             '**/*/migration.sql',   
//             '**/*.png',   
//             '**/*.jpg',   
//             '**/*.jpeg',  
//             '**/*.gif',   
//             '**/*.bmp',   
//             '**/*.webp',  
//             '**/*.mp4',   
//             '**/*.mp3',   
//             '**/*.avi',   
//             '**/*.mov',   
//             '**/*.wav',   
//             '**/*.flac',  
//             '**/*.ogg',   
//             '**/*.zip',   
//             '**/*.tar',   
//             '**/*.rar',   
//             '**/*.7z',    
//             '**/node_modules/**',
//         ],
//         recursive: true,
//         unknown: "warn",
//         maxConcurrency: 2,
//     });
//     try {
//         const docs = await loader.load();
//         return docs;
//     } catch (error) {
//         console.error("Error loading GitHub repository:", error);
//         return [];
//     }
// };

// export const indexGithubRepo = async (projectId: string, githubUrl: string, githubToken?: string) => {
//     const docs = await loadGithubRepo(githubUrl, githubToken);
//     if (!docs || docs.length === 0) {
//         console.warn("No documents loaded from GitHub repository.");
//         return;
//     }

//     const allEmbeddings = await generateEmbeddings(docs);

//     await Promise.allSettled(allEmbeddings.map(async (embedding, index) => {
//         console.log(`processing ${index} of ${allEmbeddings.length}`);

//         if (!embedding) return;

//         try {
//             const sourceCodeEmbedding = await prisma.sourceCodeEmbedding.create({
//                 data: {
//                     summary: embedding.summary,
//                     sourceCode: embedding.sourceCode,
//                     fileName: embedding.fileName,
//                     projectId,
//                 }
//             });

//             await prisma.$executeRaw`
//             UPDATE "SourceCodeEmbedding"
//             SET "summaryEmbedding" = ${embedding.embedding}::vector
//             WHERE "id" = ${sourceCodeEmbedding.id}
//             `;

//         } catch (error) {
//             console.error(`Error processing embedding ${index}:`, error);
//         }
//     }));
// };


// const generateEmbeddings = async (docs: Document[]) => {
//     return await Promise.all(docs.map(async (doc): Promise<{
//         summary: string;
//         embedding: number[];
//         sourceCode: string;
//         fileName: string;
//     } | null> => {
//         try {
//             const summary: string = await summariseCode(doc);
//             const embedding: number[] = await generateEmbedding(summary);
            
//             return {
//                 summary,
//                 embedding,
//                 sourceCode: JSON.parse(JSON.stringify(doc.pageContent)),
//                 fileName: doc.metadata.source as string, 
//             };
//         } catch (error) {
//             console.error("Error generating embeddings for document:", error);
//             return null;
//         }
//     }));
// };
