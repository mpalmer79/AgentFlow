import { describe, it, expect, vi } from 'vitest'
import { render, screen, fireEvent } from '@testing-library/react'
import NodeLibrary from './NodeLibrary'

describe('NodeLibrary', () => {
  it('renders the node library', () => {
    render(<NodeLibrary />)
    expect(screen.getByTestId('node-library')).toBeInTheDocument()
  })

  it('renders the Nodes header', () => {
    render(<NodeLibrary />)
    expect(screen.getByText('Nodes')).toBeInTheDocument()
  })

  it('renders the search input', () => {
    render(<NodeLibrary />)
    expect(screen.getByTestId('node-search')).toBeInTheDocument()
    expect(screen.getByPlaceholderText('Search nodes...')).toBeInTheDocument()
  })

  it('renders all node types', () => {
    render(<NodeLibrary />)
    
    const nodeTypes = ['input', 'llm', 'tool', 'router', 'loop', 'transform', 'output']
    nodeTypes.forEach((type) => {
      expect(screen.getByTestId(`node-library-item-${type}`)).toBeInTheDocument()
    })
  })

  it('renders node labels', () => {
    render(<NodeLibrary />)
    
    expect(screen.getByText('Input')).toBeInTheDocument()
    expect(screen.getByText('LLM')).toBeInTheDocument()
    expect(screen.getByText('Tool')).toBeInTheDocument()
    expect(screen.getByText('Router')).toBeInTheDocument()
    expect(screen.getByText('Loop')).toBeInTheDocument()
    expect(screen.getByText('Transform')).toBeInTheDocument()
    expect(screen.getByText('Output')).toBeInTheDocument()
  })

  it('renders help text', () => {
    render(<NodeLibrary />)
    expect(screen.getByText(/Drag nodes onto the canvas/i)).toBeInTheDocument()
  })
})

describe('NodeLibrary search', () => {
  it('filters nodes based on label search', () => {
    render(<NodeLibrary />)
    
    const searchInput = screen.getByTestId('node-search')
    fireEvent.change(searchInput, { target: { value: 'LLM' } })
    
    expect(screen.getByTestId('node-library-item-llm')).toBeInTheDocument()
    expect(screen.queryByTestId('node-library-item-input')).not.toBeInTheDocument()
  })

  it('filters nodes based on description search', () => {
    render(<NodeLibrary />)
    
    const searchInput = screen.getByTestId('node-search')
    fireEvent.change(searchInput, { target: { value: 'webhook' } })
    
    expect(screen.getByTestId('node-library-item-input')).toBeInTheDocument()
    expect(screen.queryByTestId('node-library-item-llm')).not.toBeInTheDocument()
  })

  it('shows empty state when no matches found', () => {
    render(<NodeLibrary />)
    
    const searchInput = screen.getByTestId('node-search')
    fireEvent.change(searchInput, { target: { value: 'xyz123notfound' } })
    
    expect(screen.getByText(/No nodes found matching/i)).toBeInTheDocument()
  })

  it('search is case insensitive', () => {
    render(<NodeLibrary />)
    
    const searchInput = screen.getByTestId('node-search')
    fireEvent.change(searchInput, { target: { value: 'llm' } })
    
    expect(screen.getByTestId('node-library-item-llm')).toBeInTheDocument()
  })
})

describe('NodeLibrary drag and drop', () => {
  it('nodes are draggable', () => {
    render(<NodeLibrary />)
    
    const inputNode = screen.getByTestId('node-library-item-input')
    expect(inputNode).toHaveAttribute('draggable', 'true')
  })

  it('sets correct data on drag start', () => {
    render(<NodeLibrary />)
    
    const inputNode = screen.getByTestId('node-library-item-input')
    
    const dataTransfer = {
      setData: vi.fn(),
      effectAllowed: '',
    }
    
    fireEvent.dragStart(inputNode, { dataTransfer })
    
    expect(dataTransfer.setData).toHaveBeenCalledWith(
      'application/agentflow-node-type',
      'input'
    )
    expect(dataTransfer.setData).toHaveBeenCalledWith(
      'application/agentflow-node-label',
      'Input'
    )
  })

  it('sets effectAllowed to move on drag start', () => {
    render(<NodeLibrary />)
    
    const llmNode = screen.getByTestId('node-library-item-llm')
    
    const dataTransfer = {
      setData: vi.fn(),
      effectAllowed: '',
    }
    
    fireEvent.dragStart(llmNode, { dataTransfer })
    
    expect(dataTransfer.effectAllowed).toBe('move')
  })
})
