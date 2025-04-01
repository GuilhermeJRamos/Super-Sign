"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { useSession } from "next-auth/react";
import { Button } from "@/components/ui/button";
import { Header } from "@/components/header";
import Link from "next/link";
import type { Document } from "@/types/document";

export default function DashboardPage() {
  const router = useRouter();
  const { data: session, status } = useSession();
  const [documents, setDocuments] = useState<Document[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [isDeleting, setIsDeleting] = useState<string | null>(null);

  useEffect(() => {
    if (status === "unauthenticated") {
      router.push("/login");
    }
  }, [status, router]);

  useEffect(() => {
    async function loadDocuments() {
      try {
        setIsLoading(true);
        const response = await fetch("/api/documents");
        const data = await response.json();
        setDocuments(data);
      } catch (error) {
        setError("Erro ao carregar documentos");
        console.error(error);
      } finally {
        setIsLoading(false);
      }
    }

    if (status === "authenticated") {
      loadDocuments();
    }
  }, [status]);

  async function handleDeleteDocument(id: string) {
    if (!confirm("Tem certeza que deseja excluir este documento?")) {
      return;
    }

    try {
      setIsDeleting(id);
      const response = await fetch(`/api/documents/${id}`, {
        method: "DELETE",
      });

      if (!response.ok) {
        throw new Error("Erro ao excluir documento");
      }

      setDocuments(documents.filter(doc => doc.id !== id));
    } catch (error) {
      console.error("Erro:", error);
      alert("Erro ao excluir documento");
    } finally {
      setIsDeleting(null);
    }
  }

  if (status === "loading" || isLoading) {
    return (
      <div className="min-h-screen bg-gray-50">
        <Header />
        <main className="container mx-auto px-4 py-8">
          <div className="flex justify-center items-center h-64">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
          </div>
        </main>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gray-50">
        <Header />
        <main className="container mx-auto px-4 py-8">
          <div className="text-center text-red-600 bg-red-50 p-4 rounded-lg">
            {error}
          </div>
        </main>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <Header />
      
      <main className="container mx-auto px-4 py-8">
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-2xl font-bold">Meus Documentos</h1>
          <Link href="/dashboard/upload">
            <Button className="h-9 text-sm">
              Novo Documento
            </Button>
          </Link>
        </div>

        {documents.length === 0 ? (
          <div className="text-center py-12">
            <p className="text-gray-500 mb-4">Você ainda não tem documentos</p>
            <Link href="/dashboard/upload">
              <Button className="h-9 text-sm">
                Criar Primeiro Documento
              </Button>
            </Link>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {documents.map((document) => (
              <div
                key={document.id}
                className="bg-white rounded-lg shadow-sm p-6 hover:shadow-md transition-shadow"
              >
                <div className="flex justify-between items-start mb-4">
                  <h2 className="text-lg font-semibold">{document.name}</h2>
                  <span
                    className={`px-2 py-1 rounded-full text-xs font-medium ${
                      document.status === "SIGNED"
                        ? "bg-green-100 text-green-800"
                        : "bg-yellow-100 text-yellow-800"
                    }`}
                  >
                    {document.status === "SIGNED" ? "Assinado" : "Pendente"}
                  </span>
                </div>

                <div className="grid grid-cols-2 gap-4 mb-4">
                  <div>
                    <p className="text-sm text-gray-500">Data de criação</p>
                    <p className="text-sm">
                      {new Date(document.createdAt).toLocaleDateString("pt-BR")}
                    </p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-500">Última atualização</p>
                    <p className="text-sm">
                      {new Date(document.updatedAt).toLocaleDateString("pt-BR")}
                    </p>
                  </div>
                </div>

                <div className="flex gap-2">
                  <Link href={`/dashboard/documents/${document.id}`} className="flex-1">
                    <Button className="w-full h-9 text-sm">
                      Visualizar
                    </Button>
                  </Link>
                  <Button
                    onClick={() => handleDeleteDocument(document.id)}
                    disabled={isDeleting === document.id}
                    variant="destructive"
                    className="h-9 text-sm"
                  >
                    {isDeleting === document.id ? "Excluindo..." : "Excluir"}
                  </Button>
                </div>
              </div>
            ))}
          </div>
        )}
      </main>
    </div>
  );
} 