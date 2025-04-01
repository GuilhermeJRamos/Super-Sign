"use client";

import { useEffect, useState } from "react";
import { useSession, signOut } from "next-auth/react";
import Link from "next/link";
import type { Document } from "@/types/document";

export function Header() {
  const { data: session, status } = useSession();
  const [documents, setDocuments] = useState<Document[]>([]);

  useEffect(() => {
    async function loadDocuments() {
      if (status !== "authenticated") return;

      try {
        const response = await fetch("/api/documents");
        const data = await response.json();
        setDocuments(data);
      } catch (error) {
        console.error("Erro ao carregar documentos:", error);
      }
    }

    loadDocuments();
  }, [status]);

  const pendingDocuments = documents.filter(doc => doc.status === "PENDING").length;
  const signedDocuments = documents.filter(doc => doc.status === "SIGNED").length;

  return (
    <header className="bg-white shadow-sm">
      <div className="container mx-auto px-4 py-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-8">
            <Link href="/dashboard" className="text-xl font-bold text-primary">
              DocSign
            </Link>
            {status === "authenticated" && (
              <nav className="flex items-center gap-6">
                <Link
                  href="/dashboard"
                  className="text-sm text-gray-600 hover:text-gray-900"
                >
                  Dashboard
                </Link>
                <Link
                  href="/dashboard/upload"
                  className="text-sm text-gray-600 hover:text-gray-900"
                >
                  Novo Documento
                </Link>
              </nav>
            )}
          </div>

          {status === "authenticated" && (
            <div className="flex items-center gap-6">
              <div className="flex items-center gap-4">
                <div className="text-sm">
                  <span className="text-gray-500">Pendentes:</span>{" "}
                  <span className="font-medium">{pendingDocuments}</span>
                </div>
                <div className="text-sm">
                  <span className="text-gray-500">Assinados:</span>{" "}
                  <span className="font-medium">{signedDocuments}</span>
                </div>
              </div>
              <div className="flex items-center gap-4 border-l pl-4">
                <div className="text-right">
                  <p className="text-sm font-medium text-gray-900">{session?.user?.name}</p>
                  <p className="text-xs text-gray-500">{session?.user?.email}</p>
                </div>
                <button
                  onClick={() => signOut()}
                  className="text-sm text-gray-600 hover:text-gray-900"
                >
                  Sair
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </header>
  );
} 