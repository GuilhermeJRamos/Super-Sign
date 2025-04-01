import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { writeFile } from "fs/promises";
import { join } from "path";

export async function POST(
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

    const { signatureImg, position } = await request.json();

    if (!signatureImg || !position || !position.x || !position.y) {
      return NextResponse.json(
        { message: "Dados da assinatura incompletos" },
        { status: 400 }
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

    if (document.status === "SIGNED") {
      return NextResponse.json(
        { message: "Documento já está assinado" },
        { status: 400 }
      );
    }

    // Salvar a imagem da assinatura
    const signatureFileName = `signature-${params.id}.png`;
    const signaturePath = join(process.cwd(), "public", "uploads", signatureFileName);
    
    const base64Data = signatureImg.replace(/^data:image\/png;base64,/, "");
    await writeFile(signaturePath, Buffer.from(base64Data, "base64"));

    // Atualizar o documento com a assinatura
    const updatedDocument = await prisma.document.update({
      where: { id: params.id },
      data: {
        status: "SIGNED",
        signatureUrl: `/uploads/${signatureFileName}`,
        signaturePosition: JSON.stringify(position),
      },
    });

    return NextResponse.json(updatedDocument);
  } catch (error) {
    console.error("Erro ao assinar documento:", error);
    return NextResponse.json(
      { message: "Erro ao assinar documento" },
      { status: 500 }
    );
  }
} 