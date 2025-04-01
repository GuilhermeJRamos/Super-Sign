import { Button } from "@/components/ui/button";
import Link from "next/link";

export default function Home() {
  return (
    <main className="flex min-h-screen flex-col items-center justify-center p-24">
      <div className="z-10 max-w-5xl w-full items-center justify-between font-mono text-sm">
        <h1 className="text-4xl font-bold text-center mb-8">
          SuperSign - Assinatura Digital
        </h1>
        <p className="text-center mb-8">
          Plataforma simplificada para gerenciamento e assinatura de documentos
        </p>
        <div className="flex justify-center gap-4">
          <Link href="/login">
            <Button>Entrar</Button>
          </Link>
          <Link href="/register">
            <Button variant="outline">Registrar</Button>
          </Link>
        </div>
      </div>
    </main>
  );
} 