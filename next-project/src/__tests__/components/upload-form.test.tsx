import { render, screen, fireEvent, waitFor } from '@testing-library/react'
import { useRouter } from 'next/navigation'
import UploadForm from '@/components/upload-form'

// Mock do useRouter
jest.mock('next/navigation', () => ({
  useRouter: jest.fn(),
}))

describe('UploadForm', () => {
  const mockRouter = {
    push: jest.fn(),
  }

  beforeEach(() => {
    (useRouter as jest.Mock).mockReturnValue(mockRouter)
  })

  afterEach(() => {
    jest.clearAllMocks()
  })

  it('deve renderizar o formulário corretamente', () => {
    render(<UploadForm />)
    
    expect(screen.getByLabelText(/nome do documento/i)).toBeInTheDocument()
    expect(screen.getByLabelText(/arquivo pdf/i)).toBeInTheDocument()
    expect(screen.getByRole('button', { name: /enviar/i })).toBeInTheDocument()
  })

  it('deve mostrar erro quando o nome está vazio', async () => {
    render(<UploadForm />)
    
    const submitButton = screen.getByRole('button', { name: /enviar/i })
    fireEvent.click(submitButton)

    await waitFor(() => {
      expect(screen.getByText(/nome do documento é obrigatório/i)).toBeInTheDocument()
    })
  })

  it('deve mostrar erro quando nenhum arquivo é selecionado', async () => {
    render(<UploadForm />)
    
    const nameInput = screen.getByLabelText(/nome do documento/i)
    fireEvent.change(nameInput, { target: { value: 'Teste' } })
    
    const submitButton = screen.getByRole('button', { name: /enviar/i })
    fireEvent.click(submitButton)

    await waitFor(() => {
      expect(screen.getByText(/selecione um arquivo pdf/i)).toBeInTheDocument()
    })
  })

  it('deve mostrar erro quando o arquivo não é um PDF', async () => {
    render(<UploadForm />)
    
    const nameInput = screen.getByLabelText(/nome do documento/i)
    fireEvent.change(nameInput, { target: { value: 'Teste' } })
    
    const fileInput = screen.getByLabelText(/arquivo pdf/i)
    const file = new File(['test'], 'test.txt', { type: 'text/plain' })
    fireEvent.change(fileInput, { target: { files: [file] } })
    
    const submitButton = screen.getByRole('button', { name: /enviar/i })
    fireEvent.click(submitButton)

    await waitFor(() => {
      expect(screen.getByText(/apenas arquivos pdf são permitidos/i)).toBeInTheDocument()
    })
  })

  it('deve mostrar erro quando o PDF tem mais de uma página', async () => {
    // Mock do fetch para simular erro de múltiplas páginas
    global.fetch = jest.fn().mockResolvedValueOnce({
      ok: false,
      json: () => Promise.resolve({
        message: 'O documento tem 2 páginas. Apenas documentos com uma página são permitidos.'
      })
    })

    render(<UploadForm />)
    
    const nameInput = screen.getByLabelText(/nome do documento/i)
    fireEvent.change(nameInput, { target: { value: 'Teste' } })
    
    const fileInput = screen.getByLabelText(/arquivo pdf/i)
    const file = new File(['test'], 'test.pdf', { type: 'application/pdf' })
    fireEvent.change(fileInput, { target: { files: [file] } })
    
    const submitButton = screen.getByRole('button', { name: /enviar/i })
    fireEvent.click(submitButton)

    await waitFor(() => {
      expect(screen.getByText(/apenas documentos com uma página são permitidos/i)).toBeInTheDocument()
    })
  })

  it('deve redirecionar para o dashboard após upload bem-sucedido', async () => {
    // Mock do fetch para simular sucesso
    global.fetch = jest.fn().mockResolvedValueOnce({
      ok: true,
      json: () => Promise.resolve({ id: '1' })
    })

    render(<UploadForm />)
    
    const nameInput = screen.getByLabelText(/nome do documento/i)
    fireEvent.change(nameInput, { target: { value: 'Teste' } })
    
    const fileInput = screen.getByLabelText(/arquivo pdf/i)
    const file = new File(['test'], 'test.pdf', { type: 'application/pdf' })
    fireEvent.change(fileInput, { target: { files: [file] } })
    
    const submitButton = screen.getByRole('button', { name: /enviar/i })
    fireEvent.click(submitButton)

    await waitFor(() => {
      expect(mockRouter.push).toHaveBeenCalledWith('/dashboard')
    })
  })
}) 