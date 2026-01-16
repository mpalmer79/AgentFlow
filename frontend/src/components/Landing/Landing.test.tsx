import { describe, it, expect, vi } from 'vitest'
import { render, screen, fireEvent } from '@testing-library/react'
import Landing from './Landing'

describe('Landing', () => {
  const mockOnGetStarted = vi.fn()

  beforeEach(() => {
    mockOnGetStarted.mockClear()
  })

  it('renders the main headline', () => {
    render(<Landing onGetStarted={mockOnGetStarted} />)
    expect(screen.getByText(/Build AI automations/i)).toBeInTheDocument()
    expect(screen.getByText(/visually/i)).toBeInTheDocument()
  })

  it('renders the tagline', () => {
    render(<Landing onGetStarted={mockOnGetStarted} />)
    expect(screen.getByText(/No code required/i)).toBeInTheDocument()
  })

  it('renders the AgentFlow logo', () => {
    render(<Landing onGetStarted={mockOnGetStarted} />)
    expect(screen.getByText('AF')).toBeInTheDocument()
    expect(screen.getByText('AgentFlow')).toBeInTheDocument()
  })

  it('calls onGetStarted when Get Started button is clicked', () => {
    render(<Landing onGetStarted={mockOnGetStarted} />)
    
    const getStartedButtons = screen.getAllByRole('button', { name: /get started/i })
    fireEvent.click(getStartedButtons[0])
    
    expect(mockOnGetStarted).toHaveBeenCalledTimes(1)
  })

  it('calls onGetStarted when Start Building button is clicked', () => {
    render(<Landing onGetStarted={mockOnGetStarted} />)
    
    const startBuildingButton = screen.getByRole('button', { name: /start building/i })
    fireEvent.click(startBuildingButton)
    
    expect(mockOnGetStarted).toHaveBeenCalledTimes(1)
  })

  it('renders use cases section', () => {
    render(<Landing onGetStarted={mockOnGetStarted} />)
    expect(screen.getByText('Personal')).toBeInTheDocument()
    expect(screen.getByText('Business')).toBeInTheDocument()
  })

  it('renders templates section', () => {
    render(<Landing onGetStarted={mockOnGetStarted} />)
    expect(screen.getByText('Start with a Template')).toBeInTheDocument()
  })

  it('renders template cards', () => {
    render(<Landing onGetStarted={mockOnGetStarted} />)
    expect(screen.getByText('Trip Planner')).toBeInTheDocument()
    expect(screen.getByText('Lead Scorer')).toBeInTheDocument()
    expect(screen.getByText('Content Generator')).toBeInTheDocument()
  })

  it('renders how it works section', () => {
    render(<Landing onGetStarted={mockOnGetStarted} />)
    expect(screen.getByText('How It Works')).toBeInTheDocument()
    expect(screen.getByText('Pick a Template')).toBeInTheDocument()
    expect(screen.getByText('Customize')).toBeInTheDocument()
    expect(screen.getByText('Run & Share')).toBeInTheDocument()
  })

  it('renders footer with author link', () => {
    render(<Landing onGetStarted={mockOnGetStarted} />)
    expect(screen.getByText('Michael Palmer')).toBeInTheDocument()
  })

  it('displays time saved for templates', () => {
    render(<Landing onGetStarted={mockOnGetStarted} />)
    expect(screen.getByText(/Saves 3 hours/i)).toBeInTheDocument()
  })
})
