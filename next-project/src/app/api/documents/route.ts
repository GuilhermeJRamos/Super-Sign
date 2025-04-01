import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { writeFile, mkdir } from "fs/promises";
import { join } from "path";
import { PDFDocument } from "pdf-lib";

export async function GET() {
  try {
    const session = await getServerSession(authOptions);

    if (!session?.user?.id) {
      return NextResponse.json(
        { message: "Não autorizado" },
        { status: 401 }
      );
    }

    const documents = await prisma.document.findMany({
      where: {
        userId: session.user.id,
      },
      orderBy: {
        createdAt: "desc",
      },
    });

    return NextResponse.json(documents);
  } catch (error) {
    console.error("Erro ao buscar documentos:", error);
    return NextResponse.json(
      { message: "Erro ao buscar documentos" },
      { status: 500 }
    );
  }
}

export async function POST(request: Request) {
  try {
    const session = await getServerSession(authOptions);

    if (!session?.user?.email) {
      return NextResponse.json(
        { message: "Não autorizado" },
        { status: 401 }
      );
    }

    const formData = await request.formData();
    const file = formData.get("file") as File;
    const name = formData.get("name") as string;

    if (!file) {
      return NextResponse.json(
        { message: "Nenhum arquivo enviado" },
        { status: 400 }
      );
    }

    if (!name) {
      return NextResponse.json(
        { message: "Nome do documento é obrigatório" },
        { status: 400 }
      );
    }

    if (!file.name.toLowerCase().endsWith(".pdf")) {
      return NextResponse.json(
        { message: "Apenas arquivos PDF são permitidos" },
        { status: 400 }
      );
    }

    // Verifica o número de páginas do PDF
    const arrayBuffer = await file.arrayBuffer();
    const pdfDoc = await PDFDocument.load(arrayBuffer);
    
    if (pdfDoc.getPageCount() > 1) {
      return NextResponse.json(
        { message: `O documento tem ${pdfDoc.getPageCount()} páginas. Apenas documentos com uma página são permitidos.` },
        { status: 400 }
      );
    }

    const bytes = await file.arrayBuffer();
    const buffer = Buffer.from(bytes);

    const uploadDir = join(process.cwd(), "public", "uploads");
    try {
      await mkdir(uploadDir, { recursive: true });
    } catch (error) {
      console.error("Erro ao criar diretório de uploads:", error);
      return NextResponse.json(
        { message: "Erro ao criar diretório de uploads" },
        { status: 500 }
      );
    }

    const fileName = `${Date.now()}-${file.name}`;
    const filePath = join(uploadDir, fileName);

    try {
      await writeFile(filePath, buffer);
    } catch (error) {
      console.error("Erro ao salvar arquivo:", error);
      return NextResponse.json(
        { message: "Erro ao salvar arquivo" },
        { status: 500 }
      );
    }

    const user = await prisma.user.findUnique({
      where: { email: session.user.email },
    });

    if (!user) {
      return NextResponse.json(
        { message: "Usuário não encontrado" },
        { status: 404 }
      );
    }

    const document = await prisma.document.create({
      data: {
        name,
        fileKey: fileName,
        userId: session.user.id,
        status: "PENDING"
      }
    });

    return NextResponse.json(document);
  } catch (error) {
    console.error("Erro ao criar documento:", error);
    return NextResponse.json(
      { message: error instanceof Error ? error.message : "Erro ao criar documento" },
      { status: 500 }
    );
  }
} 