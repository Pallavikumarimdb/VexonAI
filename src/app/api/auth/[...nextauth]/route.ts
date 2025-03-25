import NextAuth from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";
import { PrismaAdapter } from "@next-auth/prisma-adapter";
import { PrismaClient } from "@prisma/client";
import bcrypt from "bcrypt";

const prisma = new PrismaClient();

const authOptions = {
  adapter: PrismaAdapter(prisma),
  session: {
    strategy: "jwt" as "jwt",
  },
  providers: [
    CredentialsProvider({
      name: "Credentials",
      credentials: {
        email: { label: "Email", type: "text" },
        password: { label: "Password", type: "password" },
      },
      async authorize(credentials) {
        if (!credentials?.email || !credentials?.password) {
          throw new Error("Missing credentials");
        }

        const user = await prisma.user.findUnique({
          where: { emailAddress: credentials.email },
        });

        if (!user) {
          throw new Error("User not found");
        }

        const isValid = await bcrypt.compare(credentials.password, user.password);
        if (!isValid) {
          throw new Error("Invalid password");
        }

        return { ...user, id: user.id.toString() };
      },
    }),
  ],
  callbacks: {
    //@ts-ignore
    async jwt({ token, user }) {
      if (user) {
        token.id = user.id;
        token.email = user.emailAddress; // ✅ Ensure email is included
      }
      return token;
    },
    //@ts-ignore
    async session({ session, token }) {
      if (session.user) {
        session.user.id = token.id as string;
        session.user.email = token.email as string; // ✅ Ensure session contains email
      }
      return session;
    },
  },
  
  secret: process.env.NEXTAUTH_SECRET,
  pages: {
    signIn: "/signin",
  },
};

// ✅ Fix: Export named HTTP handlers instead of `export default`
export const GET = NextAuth(authOptions);
export const POST = NextAuth(authOptions);
