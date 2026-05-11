import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { vi } from 'vitest'
import ClientForm from '../ClientForm'

describe('ClientForm', () => {
  it('renders fields and calls onSubmit with form data', async () => {
    const user = userEvent.setup()

    const onSubmit = vi.fn()

    render(
      <ClientForm
        initialData={{ fullName: '', email: '', description: '' }}
        onSubmit={onSubmit}
      />,
    )

  await user.type(screen.getByLabelText(/Полное имя/i), 'Иван Иванов')
    await user.type(screen.getByLabelText(/Email/i), 'ivan@example.com')
    await user.type(screen.getByLabelText(/Описание/i), 'test')

    await user.click(screen.getByRole('button'))

    expect(onSubmit).toHaveBeenCalledTimes(1)
    expect(onSubmit).toHaveBeenCalledWith({
      fullName: 'Иван Иванов',
      email: 'ivan@example.com',
      description: 'test',
    })
  })
})
