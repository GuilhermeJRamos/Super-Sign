import { NextRequest } from 'next/server'
import { POST, GET, DELETE } from '@/app/api/documents/route'
import { getServerSession } from 'next-auth'
import prisma from '@/lib/prisma'
import { PDFDocument } from 'pdf-lib'

// Mock do next-auth
jest.mock('next-auth', () => ({
  getServerSession: jest.fn(),
}))

// Mock do Prisma
jest.mock('@/lib/prisma', () => ({
  __esModule: true,
  default: {
    document: {
      create: jest.fn(),
      findMany: jest.fn(),
      findUnique: jest.fn(),
      delete: jest.fn(),
    },
    user: {
      findUnique: jest.fn(),
    },
  },
}))

// Mock do PDF-lib
jest.mock('pdf-lib', () => ({
  PDFDocument: {
    load: jest.fn().mockResolvedValue({
      getPageCount: jest.fn().mockReturnValue(1),
      getPage: jest.fn().mockReturnValue({
        getSize: jest.fn().mockReturnValue({ width: 595, height: 842 }),
        drawImage: jest.fn(),
      }),
      save: jest.fn().mockResolvedValue(new Uint8Array()),
    }),
  },
}))

describe('API Routes - Documents', () => {
  const mockUser = {
    id: '1',
    email: 'test@example.com',
    name: 'Test User',
  }

  const mockSession = {
    user: mockUser,
  }

  beforeEach(() => {
    jest.clearAllMocks()
    ;(getServerSession as jest.Mock).mockResolvedValue(mockSession)
    ;(prisma.user.findUnique as jest.Mock).mockResolvedValue(mockUser)
  })

  describe('POST /api/documents', () => {
    it('deve retornar 401 quando não há sessão', async () => {
      ;(getServerSession as jest.Mock).mockResolvedValue(null)
      
      const request = new NextRequest('http://localhost:3000/api/documents', {
        method: 'POST',
        body: new FormData(),
      })

      const response = await POST(request)
      expect(response.status).toBe(401)
      expect(await response.json()).toEqual({ message: 'Não autorizado' })
    })

    it('deve retornar 400 quando não há arquivo', async () => {
      const formData = new FormData()
      formData.append('name', 'Test Document')

      const request = new NextRequest('http://localhost:3000/api/documents', {
        method: 'POST',
        body: formData,
      })

      const response = await POST(request)
      expect(response.status).toBe(400)
      expect(await response.json()).toEqual({ message: 'Nenhum arquivo enviado' })
    })

    it('deve retornar 400 quando não há nome', async () => {
      const formData = new FormData()
      formData.append('file', new File(['test'], 'test.pdf', { type: 'application/pdf' }))

      const request = new NextRequest('http://localhost:3000/api/documents', {
        method: 'POST',
        body: formData,
      })

      const response = await POST(request)
      expect(response.status).toBe(400)
      expect(await response.json()).toEqual({ message: 'Nome do documento é obrigatório' })
    })

    it('deve retornar 400 quando o arquivo não é PDF', async () => {
      const formData = new FormData()
      formData.append('name', 'Test Document')
      formData.append('file', new File(['test'], 'test.txt', { type: 'text/plain' }))

      const request = new NextRequest('http://localhost:3000/api/documents', {
        method: 'POST',
        body: formData,
      })

      const response = await POST(request)
      expect(response.status).toBe(400)
      expect(await response.json()).toEqual({ message: 'Apenas arquivos PDF são permitidos' })
    })

    it('deve retornar 400 quando o PDF tem mais de uma página', async () => {
      ;(PDFDocument.load as jest.Mock).mockResolvedValueOnce({
        getPageCount: jest.fn().mockReturnValue(2),
      })

      const formData = new FormData()
      formData.append('name', 'Test Document')
      formData.append('file', new File(['test'], 'test.pdf', { type: 'application/pdf' }))

      const request = new NextRequest('http://localhost:3000/api/documents', {
        method: 'POST',
        body: formData,
      })

      const response = await POST(request)
      expect(response.status).toBe(400)
      expect(await response.json()).toEqual({
        message: 'O documento tem 2 páginas. Apenas documentos com uma página são permitidos.',
      })
    })

    it('deve criar o documento com sucesso', async () => {
      const mockDocument = {
        id: '1',
        name: 'Test Document',
        fileKey: 'test.pdf',
        status: 'PENDING',
      }

      ;(prisma.document.create as jest.Mock).mockResolvedValue(mockDocument)

      const formData = new FormData()
      formData.append('name', 'Test Document')
      formData.append('file', new File(['test'], 'test.pdf', { type: 'application/pdf' }))

      const request = new NextRequest('http://localhost:3000/api/documents', {
        method: 'POST',
        body: formData,
      })

      const response = await POST(request)
      expect(response.status).toBe(200)
      expect(await response.json()).toEqual(mockDocument)
    })
  })

  describe('GET /api/documents', () => {
    it('deve retornar 401 quando não há sessão', async () => {
      ;(getServerSession as jest.Mock).mockResolvedValue(null)
      
      const request = new NextRequest('http://localhost:3000/api/documents')
      const response = await GET(request)
      
      expect(response.status).toBe(401)
      expect(await response.json()).toEqual({ message: 'Não autorizado' })
    })

    it('deve retornar os documentos do usuário', async () => {
      const mockDocuments = [
        { id: '1', name: 'Document 1' },
        { id: '2', name: 'Document 2' },
      ]

      ;(prisma.document.findMany as jest.Mock).mockResolvedValue(mockDocuments)

      const request = new NextRequest('http://localhost:3000/api/documents')
      const response = await GET(request)

      expect(response.status).toBe(200)
      expect(await response.json()).toEqual(mockDocuments)
    })
  })

  describe('DELETE /api/documents/[id]', () => {
    it('deve retornar 401 quando não há sessão', async () => {
      ;(getServerSession as jest.Mock).mockResolvedValue(null)
      
      const request = new NextRequest('http://localhost:3000/api/documents/1', {
        method: 'DELETE',
      })
      const response = await DELETE(request)
      
      expect(response.status).toBe(401)
      expect(await response.json()).toEqual({ message: 'Não autorizado' })
    })

    it('deve retornar 404 quando o documento não existe', async () => {
      ;(prisma.document.findUnique as jest.Mock).mockResolvedValue(null)

      const request = new NextRequest('http://localhost:3000/api/documents/1', {
        method: 'DELETE',
      })
      const response = await DELETE(request)

      expect(response.status).toBe(404)
      expect(await response.json()).toEqual({ message: 'Documento não encontrado' })
    })

    it('deve retornar 403 quando o documento não pertence ao usuário', async () => {
      ;(prisma.document.findUnique as jest.Mock).mockResolvedValue({
        id: '1',
        userId: '2',
      })

      const request = new NextRequest('http://localhost:3000/api/documents/1', {
        method: 'DELETE',
      })
      const response = await DELETE(request)

      expect(response.status).toBe(403)
      expect(await response.json()).toEqual({ message: 'Não autorizado' })
    })

    it('deve deletar o documento com sucesso', async () => {
      ;(prisma.document.findUnique as jest.Mock).mockResolvedValue({
        id: '1',
        userId: '1',
        fileKey: 'test.pdf',
      })

      const request = new NextRequest('http://localhost:3000/api/documents/1', {
        method: 'DELETE',
      })
      const response = await DELETE(request)

      expect(response.status).toBe(200)
      expect(await response.json()).toEqual({ message: 'Documento excluído com sucesso' })
    })
  })
}) 