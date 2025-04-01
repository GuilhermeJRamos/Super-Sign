import { Dispatch, SetStateAction } from "react";

export interface UseStateResult<T> {
  state: T;
  setState: Dispatch<SetStateAction<T>>;
}

export interface UseEffectResult {
  cleanup: () => void;
}

export interface UseCallbackResult<T extends (...args: any[]) => any> {
  callback: T;
}

export interface UseMemoResult<T> {
  value: T;
}

export interface UseRefResult<T> {
  current: T;
}

export interface UseReducerResult<S, A> {
  state: S;
  dispatch: Dispatch<A>;
}

export interface UseContextResult<T> {
  value: T;
}

export interface UseLayoutEffectResult {
  cleanup: () => void;
}

export interface UseDocumentResult {
  document: {
    id: string;
    name: string;
    status: "PENDING" | "SIGNED";
    createdAt: Date;
    updatedAt: Date;
  } | null;
  loading: boolean;
  error: string | null;
  uploadDocument: (file: File, name: string) => Promise<void>;
  signDocument: (id: string, signature: string) => Promise<void>;
}

export interface UseAuthResult {
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

export interface UseThemeResult {
  theme: "light" | "dark" | "system";
  setTheme: (theme: "light" | "dark" | "system") => void;
} 