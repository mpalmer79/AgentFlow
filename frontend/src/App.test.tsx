import { describe, it, expect, beforeEach } from 'vitest'
import { render, screen, fireEvent } from '@testing-library/react'
import App from './App'
import { useWorkflowStore } from './store/workflowStore'

describe('App', () => {
  beforeEach(() => {
    useWorkflowStore.getState().clearWorkflow()
  })

  it('renders landing page by default', () => {
    render(<App />)
    expect(screen.getByText(/Build AI automations visually/i)).toBeInTheDocument()
  })

  it('shows editor when Get Started is clicked', () => {
    render(<App />)
    
    const getStartedButton = screen.getByRole('button', { name: /get started/i })
    fireEvent.click(getStartedButton)
    
    expect(screen.getByText(/AgentFlow/i)).toBeInTheDocument()
    expect(screen.getByText(/Run Workflow/i)).toBeInTheDocument()
  })

  it('shows AgentFlow logo in editor view', () => {
    render(<App />)
    
    const getStartedButton = screen.getByRole('button', { name: /get started/i })
    fireEvent.click(getStartedButton)
    
    expect(screen.getByText('AF')).toBeInTheDocument()
  })

  it('can navigate back to landing from editor', () => {
    render(<App />)
    
    // Go to editor
    const getStartedButton = screen.getByRole('button', { name: /get started/i })
    fireEvent.click(getStartedButton)
    
    // Click logo to go back
    const logo = screen.getByText('AF').closest('button')
    if (logo) {
      fireEvent.click(logo)
    }
    
    expect(screen.getByText(/Build AI automations visually/i)).toBeInTheDocument()
  })
})
