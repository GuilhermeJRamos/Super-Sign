import { create } from "zustand";
import { Document, Signature } from "@prisma/client";

interface DocumentStore {
  documents: Document[];
  signatures: Signature[];
  setDocuments: (documents: Document[]) => void;
  setSignatures: (signatures: Signature[]) => void;
  addDocument: (document: Document) => void;
  removeDocument: (id: string) => void;
  updateDocument: (id: string, document: Partial<Document>) => void;
  addSignature: (signature: Signature) => void;
}

export const useDocumentStore = create<DocumentStore>((set) => ({
  documents: [],
  signatures: [],
  setDocuments: (documents) => set({ documents }),
  setSignatures: (signatures) => set({ signatures }),
  addDocument: (document) =>
    set((state) => ({ documents: [...state.documents, document] })),
  removeDocument: (id) =>
    set((state) => ({
      documents: state.documents.filter((doc) => doc.id !== id),
    })),
  updateDocument: (id, document) =>
    set((state) => ({
      documents: state.documents.map((doc) =>
        doc.id === id ? { ...doc, ...document } : doc
      ),
    })),
  addSignature: (signature) =>
    set((state) => ({ signatures: [...state.signatures, signature] })),
})); 