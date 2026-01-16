import { describe, it, expect, beforeEach, vi } from 'vitest'
import { render, screen, fireEvent } from '@testing-library/react'
import WelcomeModal from './WelcomeModal'

// Mock localStorage
const localStorageMock = {
  getItem: vi.fn(),
  setItem: vi.fn(),
  removeItem: vi.fn(),
  clear: vi.fn(),
}
Object.defineProperty(window, 'localStorage', { value: localStorageMock })

describe('WelcomeModal', () => {
  beforeEach(() => {
    vi.clearAllMocks()
    localStorageMock.getItem.mockReturnValue(null) // First visit
  })

  it('renders on first visit', () => {
    render(<WelcomeModal onClose={() => {}} />)
    expect(screen.getByText('Welcome to AgentFlow!')).toBeInTheDocument()
  })

  it('does not render if already seen', () => {
    localStorageMock.getItem.mockReturnValue('true')
    render(<WelcomeModal onClose={() => {}} />)
    expect(screen.queryByText('Welcome to AgentFlow!')).not.toBeInTheDocument()
  })

  it('shows all 4 steps', () => {
    render(<WelcomeModal onClose={() => {}} />)
    expect(screen.getByText('Drag & Drop Nodes')).toBeInTheDocument()
    expect(screen.getByText('Connect Nodes')).toBeInTheDocument()
    expect(screen.getByText('Configure Each Step')).toBeInTheDocument()
    expect(screen.getByText('Run Your Workflow')).toBeInTheDocument()
  })

  it('calls onClose and sets localStorage when closed', () => {
    const onClose = vi.fn()
    render(<WelcomeModal onClose={onClose} />)
    
    fireEvent.click(screen.getByText('Skip for now'))
    
    expect(localStorageMock.setItem).toHaveBeenCalledWith('agentflow-welcome-seen', 'true')
    expect(onClose).toHaveBeenCalled()
  })

  it('calls onStartTour when Get Started is clicked', () => {
    const onStartTour = vi.fn()
    render(<WelcomeModal onClose={() => {}} onStartTour={onStartTour} />)
    
    fireEvent.click(screen.getByText('Get Started'))
    
    expect(onStartTour).toHaveBeenCalled()
  })

  it('shows pro tip about templates', () => {
    render(<WelcomeModal onClose={() => {}} />)
    expect(screen.getByText(/Start with a Template/)).toBeInTheDocument()
  })
})
