import { prisma } from "@/server/db";
import { Octokit } from "octokit";
import { aiSummerizeCommit } from "./gemini";
import axios from "axios";
import PQueue from 'p-queue';

const githubQueue = new PQueue({ concurrency: 5, interval: 1000 });

interface CommitResponse {
    commitHash: string;
    commitMessage: string;
    commitAuthorName: string;
    commitAuthorAvatar: string;
    commitDate: string;
}

export const getCommitHashes = async (githubUrl: string, githubToken: string): Promise<CommitResponse[]> => {
    try {
        const octokit = new Octokit({
            auth: githubToken,
        });

        const [owner, repo] = githubUrl.split("/").slice(-2);
        if (!owner || !repo) {
            throw new Error("Invalid github url");
        }
        const { data } = await githubQueue.add(() => octokit.rest.repos.listCommits({ owner, repo }));
        const sortedCommits = data.sort((a, b) => {
            const dateA = a.commit.author?.date ? new Date(a.commit.author.date).getTime() : 0;
            const dateB = b.commit.author?.date ? new Date(b.commit.author.date).getTime() : 0;
            return dateB - dateA;
        });
        
        return sortedCommits.slice(0, 10).map((commit) => ({
            commitHash: commit.sha,
            commitMessage: commit.commit.message,
            commitAuthorName: commit.commit.author?.name ?? "",
            commitAuthorAvatar: commit.author?.avatar_url ?? "",
            commitDate: commit.commit.author?.date ?? "",
        }));
    } catch (error) {
        console.error("Error fetching commit hashes:", error);
        return [];
    }
};

export const pollCommits = async (projectId: string, githubToken: string) => {
    try {
        const { project, githubUrl } = await fetchProjectGithubUrl(projectId);
        const commitHashes = await getCommitHashes(githubUrl, githubToken);
        const unprocessedCommits = await filterUnprocessedCommits(projectId, commitHashes);
        const summaryResponses = await Promise.allSettled(unprocessedCommits.map(commit => {
            return summarizeCommit(githubUrl, commit.commitHash, githubToken);
        }));
        console.log("summaryResponses", summaryResponses);
        const summaries = summaryResponses.map((response) => {
            if (response.status === "fulfilled") {
                return response.value as string;
            }
            return "";
        });
        const commit = await prisma.commit.createMany({
            data: summaries.map((summary, index) => {
                return {
                    projectId: projectId,
                    commitHash: unprocessedCommits[index]!.commitHash,
                    commitMessage: unprocessedCommits[index]!.commitMessage,
                    commitAuthorName: unprocessedCommits[index]!.commitAuthorName,
                    commitAuthorAvatar: unprocessedCommits[index]!.commitAuthorAvatar,
                    commitDate: unprocessedCommits[index]!.commitDate,
                    summary,
                };
            })
        });
        return commit;
    } catch (error) {
        console.error("Error polling commits:", error);
        return null;
    }
};

async function summarizeCommit(githubUrl: string, commitHash: string, githubToken: string) {
    try {
        const { data } = await axios.get(`${githubUrl}/commit/${commitHash}.diff`, {
            headers: {
                Accept: "application/vnd.github.v3.diff",
                Authorization: `Bearer ${githubToken}`,
            }
        });
        return await aiSummerizeCommit(data) || "";
    } catch (error) {
        console.error(`Error summarizing commit ${commitHash}:`, error);
        return "";
    }
}

async function fetchProjectGithubUrl(projectId: string) {
    try {
        const project = await prisma.project.findUnique({
            where: {
                id: projectId,
            },
            select: {
                githubUrl: true,
            }
        });
        if (!project?.githubUrl) {
            throw new Error("Project not found");
        }
        return {
            project,
            githubUrl: project.githubUrl,
        };
    } catch (error) {
        console.error("Error fetching project GitHub URL:", error);
        throw error;
    }
}

async function filterUnprocessedCommits(projectId: string, commitHashes: CommitResponse[]) {
    try {
        const processedCommits = await prisma.commit.findMany({
            where: {
                projectId,
            },
        });
        const unprocessedCommits = commitHashes.filter((commit) =>
            !processedCommits.some((processedCommit) => processedCommit.commitHash === commit.commitHash)
        );
        return unprocessedCommits;
    } catch (error) {
        console.error("Error filtering unprocessed commits:", error);
        return [];
    }
}














// import { prisma } from "@/server/db";
// import { Octokit } from "octokit";
// import { aiSummerizeCommit } from "./gemini";
// import axios from "axios";

// export const octokit = new Octokit({
//   auth: process.env.GITHUB_TOKEN,
// });

// // const githubUrl = "https://github.com/Pallavikumarimdb/invocraft";

// type Response = {
//     commitHash: string;
//     commitMessage: string;
//     commitAuthorName: string;
//     commitAuthorAvatar: string;
//     commitDate: string;
// }

// //@ts-ignore
// export const getCommitHashes = async (githubUrl: string): Promise<Response[]> => {
//     const [owner, repo] = githubUrl.split("/").slice(-2);
//     if(!owner || !repo) {
//         throw new Error("Invalid github url");
//     }
//     const {data} = await octokit.rest.repos.listCommits({
//       owner,
//       repo,
//   });
//   const sortedCommits = data.sort((a: any, b: any) => new Date(b.commit.author.date).getTime() - new Date(a.commit.author.date).getTime()) as any[];
//   return sortedCommits.slice(0, 10).map((commit: any) => ({
//           commitHash: commit.sha as string,
//           commitMessage: commit.commit.message ?? "",
//           commitAuthorName: commit.commit?.author?.name ?? "",
//           commitAuthorAvatar: commit?.author?.avatar_url ?? "",
//           commitDate: commit.commit?.author?.date ?? "",
//   }));
// };


// export const pollCommits = async (projectId: string) => {
//     const {project, githubUrl} = await fetchProjectGithubUrl(projectId);
//     const commitHashes = await getCommitHashes(githubUrl);
//     const unprocessedCommits = await filterUnprocessedCommits(projectId, commitHashes);
//     const summaryResponses = await Promise.allSettled(unprocessedCommits.map(commit =>{
//         return summarizeCommit(githubUrl, commit.commitHash);
//     }));

//     console.log("summaryResponses", summaryResponses)

//     const summaries = summaryResponses.map((response) => {
//         if(response.status === "fulfilled") {
//             console.log("summaries", response.value)
//             return response.value as string;
//         }
//         return ""
//     })

//     const commit = await prisma.commit.createMany({
//         data: summaries.map((summary, index) => {
//             return {
//                 projectId: projectId,
//                 commitHash: unprocessedCommits[index]!.commitHash,
//                 commitMessage: unprocessedCommits[index]!.commitMessage,
//                 commitAuthorName: unprocessedCommits[index]!.commitAuthorName,
//                 commitAuthorAvatar: unprocessedCommits[index]!.commitAuthorAvatar,
//                 commitDate: unprocessedCommits[index]!.commitDate,
//                 summary
//             }

//         })
//     })
//     return commit;
// }


// async function summarizeCommit(githubUrl: string, commitHash: string) {
//     //get the diff. then pass the diff into at
//     const {data} = await axios.get(`${githubUrl}/commit/${commitHash}.diff`, {
//         headers: {
//             Accept: "application/vnd.github.v3.diff",
//         }
//     });
//     return await aiSummerizeCommit(data) || "";
// }



// async function fetchProjectGithubUrl(projectId: string) {
//     const project = await prisma.project.findUnique({
//         where: {
//             id: projectId,
//         },
//         select: {
//             githubUrl: true,
//         }
//     });
//     if(!project?.githubUrl) {
//         throw new Error("Project not found");
//     }
//     return {
//         project,
//         githubUrl: project.githubUrl,
//     };
// }

// async function filterUnprocessedCommits(projectId: string, commitHashes: Response[]) {
//     const processedCommits = await prisma.commit.findMany({
//         where: {
//             projectId,
//         },
//     });

//     //@ts-ignore
//     const unprocessedCommits = commitHashes.filter((commit) => !processedCommits.some((processedCommit) => processedCommit.commitHash === commit.commitHash));
//     return unprocessedCommits;
// }


