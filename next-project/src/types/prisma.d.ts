import { PrismaClient } from "@prisma/client";

declare global {
  var prisma: PrismaClient | undefined;
}

export interface PrismaUser {
  id: string;
  name: string;
  email: string;
  password: string;
  image?: string;
  createdAt: Date;
  updatedAt: Date;
}

export interface PrismaDocument {
  id: string;
  name: string;
  fileKey: string;
  status: "PENDING" | "SIGNED";
  signatureUrl?: string;
  signaturePosition?: string;
  userId: string;
  createdAt: Date;
  updatedAt: Date;
}

export interface PrismaSession {
  id: string;
  sessionToken: string;
  userId: string;
  expires: Date;
  user: PrismaUser;
}

export interface PrismaAccount {
  id: string;
  userId: string;
  type: string;
  provider: string;
  providerAccountId: string;
  refresh_token?: string;
  access_token?: string;
  expires_at?: number;
  token_type?: string;
  scope?: string;
  id_token?: string;
  session_state?: string;
  user: PrismaUser;
}

export interface PrismaVerificationToken {
  identifier: string;
  token: string;
  expires: Date;
} 