import { ReactNode } from "react";

export interface AuthContextType {
  user: {
    id: string;
    name: string;
    email: string;
    image?: string;
  } | null;
  loading: boolean;
  signIn: (email: string, password: string) => Promise<void>;
  signOut: () => Promise<void>;
  signInWithGoogle: () => Promise<void>;
}

export interface ThemeContextType {
  theme: "light" | "dark" | "system";
  setTheme: (theme: "light" | "dark" | "system") => void;
}

export interface DocumentContextType {
  documents: Array<{
    id: string;
    name: string;
    status: "PENDING" | "SIGNED";
    createdAt: Date;
    updatedAt: Date;
  }>;
  loading: boolean;
  error: string | null;
  uploadDocument: (file: File, name: string) => Promise<void>;
  signDocument: (id: string, signature: string) => Promise<void>;
}

export interface ContextProviderProps {
  children: ReactNode;
} 