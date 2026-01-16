import { describe, it, expect, beforeEach, vi } from 'vitest'
import { render, screen, fireEvent } from '@testing-library/react'
import TemplateGallery from './TemplateGallery'
import { useWorkflowStore } from '../../store/workflowStore'

describe('TemplateGallery', () => {
  const mockOnClose = vi.fn()

  beforeEach(() => {
    mockOnClose.mockClear()
    useWorkflowStore.getState().clearWorkflow()
  })

  it('returns null when not open', () => {
    const { container } = render(<TemplateGallery isOpen={false} onClose={mockOnClose} />)
    expect(container.firstChild).toBeNull()
  })

  it('renders when open', () => {
    render(<TemplateGallery isOpen={true} onClose={mockOnClose} />)
    expect(screen.getByTestId('template-gallery')).toBeInTheDocument()
  })

  it('shows Template Gallery header', () => {
    render(<TemplateGallery isOpen={true} onClose={mockOnClose} />)
    expect(screen.getByText('Template Gallery')).toBeInTheDocument()
  })

  it('renders template cards', () => {
    render(<TemplateGallery isOpen={true} onClose={mockOnClose} />)
    expect(screen.getByTestId('template-trip-planner')).toBeInTheDocument()
    expect(screen.getByTestId('template-lead-scorer')).toBeInTheDocument()
    expect(screen.getByTestId('template-content-generator')).toBeInTheDocument()
  })

  it('shows template names', () => {
    render(<TemplateGallery isOpen={true} onClose={mockOnClose} />)
    expect(screen.getByText('Trip Planner')).toBeInTheDocument()
    expect(screen.getByText('Lead Scorer')).toBeInTheDocument()
    expect(screen.getByText('Content Generator')).toBeInTheDocument()
  })

  it('shows usage counts', () => {
    render(<TemplateGallery isOpen={true} onClose={mockOnClose} />)
    expect(screen.getByText('2,300 uses')).toBeInTheDocument()
  })

  it('shows time saved', () => {
    render(<TemplateGallery isOpen={true} onClose={mockOnClose} />)
    expect(screen.getByText('Saves 3 hours')).toBeInTheDocument()
  })

  it('calls onClose when close button is clicked', () => {
    render(<TemplateGallery isOpen={true} onClose={mockOnClose} />)
    
    const closeButton = screen.getByTestId('close-template-gallery')
    fireEvent.click(closeButton)
    
    expect(mockOnClose).toHaveBeenCalledTimes(1)
  })

  it('loads workflow when template is selected', () => {
    render(<TemplateGallery isOpen={true} onClose={mockOnClose} />)
    
    const tripPlannerCard = screen.getByTestId('template-trip-planner')
    fireEvent.click(tripPlannerCard)
    
    const state = useWorkflowStore.getState()
    expect(state.workflowName).toBe('Trip Planner')
    expect(state.nodes.length).toBeGreaterThan(0)
  })

  it('closes gallery after selecting template', () => {
    render(<TemplateGallery isOpen={true} onClose={mockOnClose} />)
    
    const tripPlannerCard = screen.getByTestId('template-trip-planner')
    fireEvent.click(tripPlannerCard)
    
    expect(mockOnClose).toHaveBeenCalledTimes(1)
  })
})
