import { z } from "zod";

import { createTRPCRouter, publicProcedure } from "@/server/api/trpc";

export const userRouter = createTRPCRouter({
  hello: publicProcedure
    .input(z.object({ text: z.string() }))
    .query(({ input }) => {
      return {
        greeting: `Hello ${input.text}`,
      };
    }),

  createUser: publicProcedure
    .input(
      z.object({
        firstName: z.string().min(1),
        lastName: z.string().min(1),
        emailAddress: z.string().email(),
        password: z.string().min(6),
        imageUrl: z.string().optional(),
      })
    )
    .mutation(async ({ ctx, input }) => {
      return ctx.prisma.user.create({
        data: {
          firstName: input.firstName,
          lastName: input.lastName,
          emailAddress: input.emailAddress,
          password: input.password, // ⚠️ Consider hashing the password before storing
          imageUrl: input.imageUrl,
        },
      });
    }),

  getUserByEmail: publicProcedure
    .input(z.object({ emailAddress: z.string().email() }))
    .query(async ({ ctx, input }) => {
      return ctx.prisma.user.findUnique({
        where: { emailAddress: input.emailAddress },
      });
    }),

  getLatestUser: publicProcedure.query(async ({ ctx }) => {
    return ctx.prisma.user.findFirst({
      orderBy: { createdAt: "desc" },
    });
  }),
});

