import { Document, Signature } from "@prisma/client";

export interface DocumentStore {
  documents: Document[];
  signatures: Signature[];
  setDocuments: (documents: Document[]) => void;
  setSignatures: (signatures: Signature[]) => void;
  addDocument: (document: Document) => void;
  removeDocument: (id: string) => void;
  updateDocument: (id: string, document: Partial<Document>) => void;
  addSignature: (signature: Signature) => void;
}

declare module "zustand" {
  interface StoreApi<T> {
    getState: () => T;
    setState: (partial: T | Partial<T> | ((state: T) => T | Partial<T>), replace?: boolean) => void;
    subscribe: (listener: (state: T, prevState: T) => void) => () => void;
    destroy: () => void;
  }
} 