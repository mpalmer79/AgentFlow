import { describe, it, expect, vi } from 'vitest'
import { render, screen, fireEvent } from '@testing-library/react'
import EmptyCanvasState from './EmptyCanvasState'

describe('EmptyCanvasState', () => {
  it('renders the main heading', () => {
    render(<EmptyCanvasState />)
    expect(screen.getByText('Start Building Your Workflow')).toBeInTheDocument()
  })

  it('shows drag & drop instruction', () => {
    render(<EmptyCanvasState />)
    expect(screen.getByText('Drag & Drop')).toBeInTheDocument()
  })

  it('shows start simple tip', () => {
    render(<EmptyCanvasState />)
    expect(screen.getByText('Start Simple')).toBeInTheDocument()
    expect(screen.getByText(/Input → LLM → Output/)).toBeInTheDocument()
  })

  it('renders template button when onLoadTemplate is provided', () => {
    const onLoadTemplate = vi.fn()
    render(<EmptyCanvasState onLoadTemplate={onLoadTemplate} />)
    
    const templateButton = screen.getByText(/start with a template/i)
    expect(templateButton).toBeInTheDocument()
  })

  it('calls onLoadTemplate when template button is clicked', () => {
    const onLoadTemplate = vi.fn()
    render(<EmptyCanvasState onLoadTemplate={onLoadTemplate} />)
    
    fireEvent.click(screen.getByText(/start with a template/i))
    expect(onLoadTemplate).toHaveBeenCalled()
  })

  it('does not render template button when onLoadTemplate is not provided', () => {
    render(<EmptyCanvasState />)
    expect(screen.queryByText(/start with a template/i)).not.toBeInTheDocument()
  })
})
