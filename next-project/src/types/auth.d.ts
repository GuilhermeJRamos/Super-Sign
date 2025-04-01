import { NextAuthOptions } from "next-auth";
import { PrismaAdapter } from "@auth/prisma-adapter";
import { prisma } from "@/lib/prisma";
import GoogleProvider from "next-auth/providers/google";
import CredentialsProvider from "next-auth/providers/credentials";
import bcrypt from "bcryptjs";
import { DefaultSession } from "next-auth";

declare module "next-auth" {
  interface Session {
    user: {
      id: string;
      name: string;
      email: string;
      image?: string;
    } & DefaultSession["user"];
  }

  interface User {
    id: string;
    name: string;
    email: string;
    image?: string;
  }
}

export interface AuthOptions {
  providers: Array<{
    id: string;
    name: string;
    type: "oauth" | "credentials";
    credentials?: {
      email: { label: string; type: string };
      password: { label: string; type: string };
    };
    authorize?: (credentials: any) => Promise<User | null>;
    clientId?: string;
    clientSecret?: string;
    authorization?: {
      url: string;
      params: { [key: string]: string };
    };
    token?: string;
    userinfo?: {
      url: string;
      async request({ client, provider, tokens, profile }: any): Promise<User>;
    };
    profile?: (profile: any) => User;
  }>;
  session: {
    strategy: "jwt" | "database";
    maxAge?: number;
    updateAge?: number;
  };
  callbacks: {
    async signIn({ user, account, profile, email, credentials }: any): Promise<boolean>;
    async redirect({ url, baseUrl }: any): Promise<string>;
    async session({ session, token, user }: any): Promise<Session>;
    async jwt({ token, user, account, profile }: any): Promise<any>;
  };
  pages: {
    signIn?: string;
    signOut?: string;
    error?: string;
    verifyRequest?: string;
    newUser?: string;
  };
  events: {
    async signIn(message: any): Promise<void>;
    async signOut(message: any): Promise<void>;
    async createUser(message: any): Promise<void>;
    async linkAccount(message: any): Promise<void>;
    async session(message: any): Promise<void>;
  };
  debug?: boolean;
  secret?: string;
}

export const authOptions: NextAuthOptions = {
  adapter: PrismaAdapter(prisma),
  session: {
    strategy: "jwt",
  },
  pages: {
    signIn: "/login",
  },
  providers: [
    GoogleProvider({
      clientId: process.env.GOOGLE_CLIENT_ID!,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET!,
    }),
    CredentialsProvider({
      name: "credentials",
      credentials: {
        email: { label: "Email", type: "email" },
        password: { label: "Senha", type: "password" },
      },
      async authorize(credentials) {
        if (!credentials?.email || !credentials?.password) {
          throw new Error("Credenciais inválidas");
        }

        const user = await prisma.user.findUnique({
          where: {
            email: credentials.email,
          },
        });

        if (!user || !user.password) {
          throw new Error("Credenciais inválidas");
        }

        const isCorrectPassword = await bcrypt.compare(
          credentials.password,
          user.password
        );

        if (!isCorrectPassword) {
          throw new Error("Credenciais inválidas");
        }

        return {
          id: user.id,
          email: user.email,
          name: user.name,
        };
      },
    }),
  ],
  callbacks: {
    async session({ token, session }) {
      if (token) {
        session.user.id = token.id;
        session.user.name = token.name;
      }
      return session;
    },
    async jwt({ token, user }) {
      const dbUser = await prisma.user.findFirst({
        where: {
          email: token.email,
        },
      });

      if (!dbUser) {
        if (user) {
          token.id = user?.id;
        }
        return token;
      }

      return {
        id: dbUser.id,
        name: dbUser.name,
        email: dbUser.email,
      };
    },
  },
}; 