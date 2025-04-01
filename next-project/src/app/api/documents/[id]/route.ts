import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { unlink } from "fs/promises";
import { join } from "path";

export async function DELETE(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    const session = await getServerSession(authOptions);

    if (!session?.user) {
      return NextResponse.json(
        { message: "Não autorizado" },
        { status: 401 }
      );
    }

    const document = await prisma.document.findUnique({
      where: { id: params.id },
    });

    if (!document) {
      return NextResponse.json(
        { message: "Documento não encontrado" },
        { status: 404 }
      );
    }

    // Verifica se o documento pertence ao usuário
    if (document.userId !== session.user.id) {
      return NextResponse.json(
        { message: "Não autorizado" },
        { status: 401 }
      );
    }

    // Remove o arquivo do servidor
    const filePath = join(process.cwd(), "public", "uploads", document.fileKey);
    try {
      await unlink(filePath);
    } catch (error) {
      console.error("Erro ao remover arquivo:", error);
    }

    // Remove a assinatura se existir
    if (document.signatureUrl) {
      const signaturePath = join(process.cwd(), "public", "uploads", document.signatureUrl);
      try {
        await unlink(signaturePath);
      } catch (error) {
        console.error("Erro ao remover assinatura:", error);
      }
    }

    // Remove o documento do banco de dados
    await prisma.document.delete({
      where: { id: params.id },
    });

    return NextResponse.json({ message: "Documento excluído com sucesso" });
  } catch (error) {
    console.error("Erro ao excluir documento:", error);
    return NextResponse.json(
      { message: "Erro ao excluir documento" },
      { status: 500 }
    );
  }
}

export async function GET(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    const session = await getServerSession(authOptions);

    if (!session?.user) {
      return NextResponse.json(
        { message: "Não autorizado" },
        { status: 401 }
      );
    }

    const document = await prisma.document.findUnique({
      where: { id: params.id },
    });

    if (!document) {
      return NextResponse.json(
        { message: "Documento não encontrado" },
        { status: 404 }
      );
    }

    // Verifica se o documento pertence ao usuário
    if (document.userId !== session.user.id) {
      return NextResponse.json(
        { message: "Não autorizado" },
        { status: 401 }
      );
    }

    return NextResponse.json({ document });
  } catch (error) {
    console.error("Erro ao buscar documento:", error);
    return NextResponse.json(
      { message: "Erro ao buscar documento" },
      { status: 500 }
    );
  }
} 