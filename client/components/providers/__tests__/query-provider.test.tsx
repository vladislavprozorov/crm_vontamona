import { render, screen } from '@testing-library/react'
import { QueryProvider } from '../query-provider'

describe('QueryProvider', () => {
  it('renders children', () => {
    render(
      <QueryProvider>
        <div>child</div>
      </QueryProvider>,
    )

    expect(screen.getByText('child')).toBeInTheDocument()
  })
})
