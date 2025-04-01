"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { useSession } from "next-auth/react";
import { Button } from "@/components/ui/button";
import { Header } from "@/components/header";
import { SignaturePad } from "@/components/signature-pad";
import type { Document } from "@/types/document";

export default function ViewDocumentPage({
  params,
}: {
  params: { id: string };
}) {
  const router = useRouter();
  const { data: session, status } = useSession();
  const [document, setDocument] = useState<Document | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [showSignaturePad, setShowSignaturePad] = useState(false);
  const [signaturePosition, setSignaturePosition] = useState<{ x: number; y: number } | null>(null);
  const [pdfUrl, setPdfUrl] = useState<string | null>(null);
  const [isDeleting, setIsDeleting] = useState(false);

  useEffect(() => {
    if (status === "unauthenticated") {
      router.push("/login");
    }
  }, [status, router]);

  useEffect(() => {
    async function loadDocument() {
      try {
        setIsLoading(true);
        const response = await fetch(`/api/documents/${params.id}`);
        const data = await response.json();
        
        if (!data.document) {
          setError("Documento não encontrado");
          return;
        }

        setDocument(data.document);
        setPdfUrl(`/uploads/${data.document.fileKey}`);
      } catch (error) {
        setError("Erro ao carregar o documento");
        console.error(error);
      } finally {
        setIsLoading(false);
      }
    }

    if (status === "authenticated") {
      loadDocument();
    }
  }, [params.id, status]);

  async function handleDeleteDocument() {
    if (!document) return;

    if (!confirm("Tem certeza que deseja excluir este documento?")) {
      return;
    }

    try {
      setIsDeleting(true);
      const response = await fetch(`/api/documents/${document.id}`, {
        method: "DELETE",
      });

      if (!response.ok) {
        throw new Error("Erro ao excluir documento");
      }

      router.push("/dashboard");
    } catch (error) {
      console.error("Erro:", error);
      alert("Erro ao excluir documento");
    } finally {
      setIsDeleting(false);
    }
  }

  function handlePdfClick(e: React.MouseEvent<HTMLDivElement>) {
    if (!document || document.status !== "PENDING") return;

    const rect = e.currentTarget.getBoundingClientRect();
    const x = ((e.clientX - rect.left) / rect.width) * 100;
    const y = ((e.clientY - rect.top) / rect.height) * 100;

    setSignaturePosition({ x, y });
    setShowSignaturePad(true);
  }

  async function handleSaveSignature(signatureImg: string) {
    if (!document || !signaturePosition) return;

    try {
      const response = await fetch(`/api/documents/${document.id}/sign`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          signatureImg,
          position: signaturePosition,
        }),
      });

      if (!response.ok) {
        throw new Error("Erro ao salvar assinatura");
      }

      const updatedDocument = await response.json();
      setDocument(updatedDocument);
      setShowSignaturePad(false);
      setSignaturePosition(null);
    } catch (error) {
      console.error("Erro:", error);
      alert("Erro ao salvar assinatura");
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

  if (error || !document) {
    return (
      <div className="min-h-screen bg-gray-50">
        <Header />
        <main className="container mx-auto px-4 py-8">
          <div className="text-center text-red-600 bg-red-50 p-4 rounded-lg">
            {error || "Documento não encontrado"}
          </div>
        </main>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <Header />
      
      <main className="container mx-auto px-4 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          <div className="bg-white rounded-lg shadow-sm p-6">
            <div className="relative aspect-[3/4] w-full">
              <div 
                className="absolute inset-0 cursor-pointer"
                onClick={handlePdfClick}
                style={{ pointerEvents: document.status === "PENDING" ? "auto" : "none" }}
              >
                <iframe
                  src={pdfUrl || ""}
                  className="w-full h-full rounded-lg"
                  style={{ pointerEvents: "none" }}
                />
              </div>
              {document.status === "SIGNED" && document.signaturePosition && (
                <div
                  className="absolute"
                  style={{
                    left: `${JSON.parse(document.signaturePosition).x}%`,
                    top: `${JSON.parse(document.signaturePosition).y}%`,
                  }}
                >
                  <img
                    src={document.signatureUrl}
                    alt="Assinatura"
                    className="w-32 h-16 object-contain"
                  />
                </div>
              )}
              <a
                href={pdfUrl || ""}
                target="_blank"
                rel="noopener noreferrer"
                className="absolute bottom-4 right-4 bg-white rounded-full p-2 shadow hover:shadow-md transition-shadow"
              >
                <span className="sr-only">Abrir em nova aba</span>
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                  strokeWidth={1.5}
                  stroke="currentColor"
                  className="w-6 h-6"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M13.5 6H5.25A2.25 2.25 0 003 8.25v10.5A2.25 2.25 0 005.25 21h10.5A2.25 2.25 0 0018 18.75V10.5m-10.5 6L21 3m0 0h-5.25M21 3v5.25"
                  />
                </svg>
              </a>
            </div>
          </div>

          <div className="bg-white rounded-lg shadow-sm p-6">
            <div className="flex flex-col gap-4">
              <div className="flex items-center justify-between">
                <h2 className="text-2xl font-bold">{document.name}</h2>
                <span
                  className={`px-3 py-1 rounded-full text-sm font-medium ${
                    document.status === "SIGNED"
                      ? "bg-green-100 text-green-800"
                      : "bg-yellow-100 text-yellow-800"
                  }`}
                >
                  {document.status === "SIGNED" ? "Assinado" : "Pendente"}
                </span>
              </div>

              <div className="grid grid-cols-2 gap-4">
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

              {document.status === "PENDING" && (
                <div className="bg-blue-50 text-blue-700 p-3 rounded-md text-sm">
                  <p className="font-medium mb-1">Como assinar:</p>
                  <p>Clique em qualquer lugar do documento onde deseja colocar sua assinatura. Em seguida, desenhe sua assinatura no campo que aparecerá.</p>
                </div>
              )}

              <div className="flex gap-2 mt-2">
                <Button
                  onClick={() => router.push("/dashboard")}
                  variant="outline"
                  className="flex-1 h-9 text-sm"
                >
                  Voltar
                </Button>
                <Button
                  onClick={handleDeleteDocument}
                  disabled={isDeleting}
                  variant="destructive"
                  className="flex-1 h-9 text-sm"
                >
                  {isDeleting ? "Excluindo..." : "Excluir"}
                </Button>
              </div>
            </div>
          </div>
        </div>
      </main>

      {showSignaturePad && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4">
          <div className="bg-white rounded-lg p-6 max-w-lg w-full">
            <h3 className="text-lg font-semibold mb-4">Assinar Documento</h3>
            <SignaturePad 
              onSave={handleSaveSignature}
              onCancel={() => {
                setShowSignaturePad(false);
                setSignaturePosition(null);
              }}
            />
          </div>
        </div>
      )}
    </div>
  );
} 