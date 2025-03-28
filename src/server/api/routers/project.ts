import { console } from "inspector";
import { createTRPCRouter, protectedProcedure, publicProcedure } from "../trpc";
import { z } from "zod";
import { TRPCError } from "@trpc/server";
import { pollCommits } from "@/lib/github";
import { indexGithubRepo } from "@/lib/github-loader";

export const projectRouter = createTRPCRouter({
    createProject: protectedProcedure.input(
        z.object({
            name: z.string().min(1),
            githubUrl: z.string().url(),
            githubToken: z.string().optional(),
        })
    ).mutation(async ({ ctx, input }) => {
        // Fetch user by session email
        const user = await ctx.prisma.user.findUnique({
            where: {
                emailAddress: ctx.session?.user?.email ?? "",
            },
            select: {
                id: true,
            },
        });
    
        if (!user) {
            throw new TRPCError({
                code: "UNAUTHORIZED",
                message: "User not found.",
            });
        }
    
        // Create project with correct userId
        const project = await ctx.prisma.project.create({
            data: {
                name: input.name,
                githubUrl: input.githubUrl,
                githubToken: input.githubToken,
                userToProject: {
                    create: {
                        userId: user.id,
                    }
                }
            }
        });
        await indexGithubRepo(project.id, input.githubUrl, input.githubToken);
        await pollCommits(project.id);
        return project;
    }),

    getProjects: protectedProcedure.query(async ({ ctx }) => {
        return await ctx.prisma.project.findMany({
            where: {
                userToProject: {
                    some: {
                        userId: ctx.user.id,
                    },
                },
                deletedAt: null,
            }
        });
    }),
    getCommits: protectedProcedure.input(z.object({
        projectId: z.string()
    })).query(async ({ ctx, input }) => {
        pollCommits(input.projectId).then().catch(console.error);
        return await ctx.prisma.commit.findMany({
            where: {
                projectId: input.projectId,
            },
        });
    }),
    saveAnswer: protectedProcedure.input(z.object({
        projectId: z.string(),
        question: z.string(),
        answer: z.string(),
        filesReferences: z.any(),
    })).mutation(async ({ ctx, input }) => {
        return await ctx.prisma.question.create({
            data: {
                projectId: input.projectId,
                filesReferences: input.filesReferences,
                question: input.question,
                answer: input.answer,
                userId: ctx.user.id,
            }
        });
    })
});