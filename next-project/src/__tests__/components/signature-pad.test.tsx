import { render, screen, fireEvent, waitFor } from '@testing-library/react'
import SignaturePad from '@/components/signature-pad'

describe('SignaturePad', () => {
  const mockOnSave = jest.fn()
  const mockOnCancel = jest.fn()

  beforeEach(() => {
    jest.clearAllMocks()
  })

  it('deve renderizar o componente corretamente', () => {
    render(
      <SignaturePad
        onSave={mockOnSave}
        onCancel={mockOnCancel}
        signaturePosition={{ x: 0, y: 0 }}
      />
    )

    expect(screen.getByText(/assinatura/i)).toBeInTheDocument()
    expect(screen.getByRole('button', { name: /salvar/i })).toBeInTheDocument()
    expect(screen.getByRole('button', { name: /cancelar/i })).toBeInTheDocument()
  })

  it('deve chamar onCancel quando o botão cancelar é clicado', () => {
    render(
      <SignaturePad
        onSave={mockOnSave}
        onCancel={mockOnCancel}
        signaturePosition={{ x: 0, y: 0 }}
      />
    )

    const cancelButton = screen.getByRole('button', { name: /cancelar/i })
    fireEvent.click(cancelButton)

    expect(mockOnCancel).toHaveBeenCalled()
  })

  it('deve mostrar erro quando tenta salvar sem assinar', async () => {
    render(
      <SignaturePad
        onSave={mockOnSave}
        onCancel={mockOnCancel}
        signaturePosition={{ x: 0, y: 0 }}
      />
    )

    const saveButton = screen.getByRole('button', { name: /salvar/i })
    fireEvent.click(saveButton)

    await waitFor(() => {
      expect(screen.getByText(/por favor, assine o documento/i)).toBeInTheDocument()
    })
    expect(mockOnSave).not.toHaveBeenCalled()
  })

  it('deve chamar onSave com a assinatura quando salvar com sucesso', async () => {
    render(
      <SignaturePad
        onSave={mockOnSave}
        onCancel={mockOnCancel}
        signaturePosition={{ x: 0, y: 0 }}
      />
    )

    // Simula uma assinatura
    const canvas = screen.getByRole('img')
    fireEvent.mouseDown(canvas, { clientX: 0, clientY: 0 })
    fireEvent.mouseMove(canvas, { clientX: 100, clientY: 100 })
    fireEvent.mouseUp(canvas)

    const saveButton = screen.getByRole('button', { name: /salvar/i })
    fireEvent.click(saveButton)

    await waitFor(() => {
      expect(mockOnSave).toHaveBeenCalled()
    })
  })

  it('deve limpar a assinatura quando o botão limpar é clicado', () => {
    render(
      <SignaturePad
        onSave={mockOnSave}
        onCancel={mockOnCancel}
        signaturePosition={{ x: 0, y: 0 }}
      />
    )

    // Simula uma assinatura
    const canvas = screen.getByRole('img')
    fireEvent.mouseDown(canvas, { clientX: 0, clientY: 0 })
    fireEvent.mouseMove(canvas, { clientX: 100, clientY: 100 })
    fireEvent.mouseUp(canvas)

    const clearButton = screen.getByRole('button', { name: /limpar/i })
    fireEvent.click(clearButton)

    const saveButton = screen.getByRole('button', { name: /salvar/i })
    fireEvent.click(saveButton)

    expect(screen.getByText(/por favor, assine o documento/i)).toBeInTheDocument()
  })
}) 