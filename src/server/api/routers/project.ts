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
        // Check if user is authorized to view this project
        const userProject = await ctx.prisma.userToProject.findFirst({
            where: {
                projectId: input.projectId,
                userId: ctx.user.id,
            },
        });
        
        if (!userProject) {
            throw new TRPCError({
                code: "FORBIDDEN",
                message: "You don't have access to this project.",
            });
        }
        
        // Check if user is the project creator
        const isCreator = await ctx.prisma.userToProject.findFirst({
            where: {
                projectId: input.projectId,
            },
            orderBy: {
                createdAt: 'asc',
            },
            take: 1,
        }).then(firstUser => firstUser?.userId === ctx.user.id);
        
        if (!isCreator) {
            throw new TRPCError({
                code: "FORBIDDEN",
                message: "Only the project creator can view commits.",
            });
        }
        
        pollCommits(input.projectId).then().catch(console.error);
        return await ctx.prisma.commit.findMany({
            where: {
                projectId: input.projectId,
            },
            orderBy: {
                commitDate: 'desc',
            },
        });
    }),
    // New function to check if user is project creator
    isProjectCreator: protectedProcedure.input(z.object({
        projectId: z.string()
    })).query(async ({ ctx, input }) => {
        // Get the first user added to the project (creator)
        const firstUser = await ctx.prisma.userToProject.findFirst({
            where: {
                projectId: input.projectId,
            },
            orderBy: {
                createdAt: 'asc',
            },
            take: 1,
        });
        
        // Return boolean indicating if current user is the creator
        return firstUser?.userId === ctx.user.id;
    }),
    // New function to get project users
    getProjectUsers: protectedProcedure.input(z.object({
        projectId: z.string()
    })).query(async ({ ctx, input }) => {
        const userProjects = await ctx.prisma.userToProject.findMany({
            where: {
                projectId: input.projectId,
            },
            include: {
                user: {
                    select: {
                        id: true,
                        firstName: true,
                        lastName: true,
                        imageUrl: true,
                    },
                },
            },
            orderBy: {
                createdAt: 'asc',
            },
        });
        
        // First user is considered the creator
        return userProjects.map((up, index) => ({
            userId: up.userId,
            projectId: up.projectId,
            user: up.user,
            isCreator: index === 0,
        }));
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
    }),
    getQuestions: protectedProcedure.input(z.object({projectId: z.string()}))
    .query(async ({ctx, input}) => {
        return await ctx.prisma.question.findMany({
            where: {
                projectId: input.projectId
            },
            include: {
                user: true
            },
            orderBy: {
                createdAt: 'desc'
            }
        })
    })
});