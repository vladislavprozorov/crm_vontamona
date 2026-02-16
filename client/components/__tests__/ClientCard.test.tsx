import { describe, it, expect, vi } from 'vitest'
import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import ClientCard from '@/components/ClientCard'
import type { Client } from '@/types/client'

const mockClient: Client = {
  id: '1',
  fullName: 'Иван Иванов',
  email: 'ivan@example.com',
  description: 'Тестовое описание',
  createdAt: '2024-01-01T00:00:00.000Z',
}

const createWrapper = () => {
  const queryClient = new QueryClient({
    defaultOptions: {
      queries: { retry: false },
      mutations: { retry: false },
    },
  })
  const Wrapper = ({ children }: { children: React.ReactNode }) => (
    <QueryClientProvider client={queryClient}>{children}</QueryClientProvider>
  )
  Wrapper.displayName = 'TestWrapper'
  return Wrapper
}

describe('ClientCard', () => {
  it('должен отображать информацию о клиенте', () => {
    render(<ClientCard client={mockClient} />, { wrapper: createWrapper() })

    expect(screen.getByText('Иван Иванов')).toBeInTheDocument()
    expect(screen.getByText('ivan@example.com')).toBeInTheDocument()
    expect(screen.getByText('Тестовое описание')).toBeInTheDocument()
  })

  it('должен отображать кнопки действий', () => {
    render(<ClientCard client={mockClient} />, { wrapper: createWrapper() })

    expect(screen.getByRole('link', { name: /просмотр/i })).toBeInTheDocument()
    expect(screen.getByRole('link', { name: /изменить/i })).toBeInTheDocument()
    expect(screen.getByRole('button', { name: /удалить/i })).toBeInTheDocument()
  })

  it('должен показывать подтверждение при удалении', async () => {
    const user = userEvent.setup()
    global.confirm = vi.fn(() => false)

    render(<ClientCard client={mockClient} />, { wrapper: createWrapper() })

    const deleteButton = screen.getByRole('button', { name: /удалить/i })
    await user.click(deleteButton)

    expect(global.confirm).toHaveBeenCalledWith(
      'Вы уверены, что хотите удалить клиента Иван Иванов?'
    )
  })

  it('должен иметь правильные ссылки для просмотра и редактирования', () => {
    render(<ClientCard client={mockClient} />, { wrapper: createWrapper() })

    const viewLink = screen.getByRole('link', { name: /просмотр/i })
    const editLink = screen.getByRole('link', { name: /изменить/i })

    expect(viewLink).toHaveAttribute('href', '/clients/1')
    expect(editLink).toHaveAttribute('href', '/clients/1/edit')
  })
})
