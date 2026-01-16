import { describe, it, expect, vi } from 'vitest'
import { render, screen } from '@testing-library/react'
import Landing from './Landing'

describe('Landing', () => {
  const mockOnGetStarted = vi.fn()

  it('renders without crashing', () => {
    render(<Landing onGetStarted={mockOnGetStarted} />)
    expect(document.body).toBeTruthy()
  })

  it('renders main heading', () => {
    render(<Landing onGetStarted={mockOnGetStarted} />)
    expect(screen.getByRole('heading', { level: 1 })).toBeInTheDocument()
  })

  it('renders get started button', () => {
    render(<Landing onGetStarted={mockOnGetStarted} />)
    const buttons = screen.getAllByRole('button')
    expect(buttons.length).toBeGreaterThan(0)
  })
})
