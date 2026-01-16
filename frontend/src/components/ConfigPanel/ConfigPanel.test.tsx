import { describe, it, expect, beforeEach } from 'vitest'
import { render, screen, fireEvent } from '@testing-library/react'
import ConfigPanel from './ConfigPanel'
import { useWorkflowStore } from '../../store/workflowStore'

describe('ConfigPanel', () => {
  beforeEach(() => {
    useWorkflowStore.getState().clearWorkflow()
  })

  it('returns null when no node is selected', () => {
    const { container } = render(<ConfigPanel />)
    expect(container.firstChild).toBeNull()
  })

  it('renders when a node is selected', () => {
    useWorkflowStore.getState().addNode({
      id: 'test-node',
      type: 'llm',
      position: { x: 100, y: 100 },
      data: { label: 'Test LLM', model: 'claude-3-sonnet', prompt: '' },
    })
    useWorkflowStore.getState().selectNode('test-node')

    render(<ConfigPanel />)
    expect(screen.getByTestId('config-panel')).toBeInTheDocument()
  })

  it('shows Configure Node header', () => {
    useWorkflowStore.getState().addNode({
      id: 'test-node',
      type: 'llm',
      position: { x: 100, y: 100 },
      data: { label: 'Test', model: 'claude-3-sonnet', prompt: '' },
    })
    useWorkflowStore.getState().selectNode('test-node')

    render(<ConfigPanel />)
    expect(screen.getByText('Configure Node')).toBeInTheDocument()
  })

  it('closes when close button is clicked', () => {
    useWorkflowStore.getState().addNode({
      id: 'test-node',
      type: 'llm',
      position: { x: 100, y: 100 },
      data: { label: 'Test', model: 'claude-3-sonnet', prompt: '' },
    })
    useWorkflowStore.getState().selectNode('test-node')

    render(<ConfigPanel />)
    
    const closeButton = screen.getByTestId('close-config-panel')
    fireEvent.click(closeButton)
    
    expect(useWorkflowStore.getState().isConfigPanelOpen).toBe(false)
  })
})

describe('ConfigPanel - Label and Description', () => {
  beforeEach(() => {
    useWorkflowStore.getState().clearWorkflow()
    useWorkflowStore.getState().addNode({
      id: 'test-node',
      type: 'llm',
      position: { x: 100, y: 100 },
      data: { label: 'Original Label', model: 'claude-3-sonnet', prompt: '' },
    })
    useWorkflowStore.getState().selectNode('test-node')
  })

  it('renders label input with current value', () => {
    render(<ConfigPanel />)
    
    const labelInput = screen.getByTestId('config-label') as HTMLInputElement
    expect(labelInput.value).toBe('Original Label')
  })

  it('updates label when changed', () => {
    render(<ConfigPanel />)
    
    const labelInput = screen.getByTestId('config-label')
    fireEvent.change(labelInput, { target: { value: 'New Label' } })
    
    const state = useWorkflowStore.getState()
    const node = state.nodes.find(n => n.id === 'test-node')
    expect(node?.data.label).toBe('New Label')
  })
})

describe('ConfigPanel - LLM Node', () => {
  beforeEach(() => {
    useWorkflowStore.getState().clearWorkflow()
    useWorkflowStore.getState().addNode({
      id: 'llm-node',
      type: 'llm',
      position: { x: 100, y: 100 },
      data: { label: 'LLM', model: 'claude-3-sonnet', prompt: 'Test prompt', temperature: 0.7 },
    })
    useWorkflowStore.getState().selectNode('llm-node')
  })

  it('renders model select', () => {
    render(<ConfigPanel />)
    expect(screen.getByTestId('config-model')).toBeInTheDocument()
  })

  it('renders prompt textarea', () => {
    render(<ConfigPanel />)
    
    const promptTextarea = screen.getByTestId('config-prompt') as HTMLTextAreaElement
    expect(promptTextarea.value).toBe('Test prompt')
  })

  it('renders temperature slider', () => {
    render(<ConfigPanel />)
    expect(screen.getByTestId('config-temperature')).toBeInTheDocument()
  })
})

describe('ConfigPanel - Input Node', () => {
  beforeEach(() => {
    useWorkflowStore.getState().clearWorkflow()
    useWorkflowStore.getState().addNode({
      id: 'input-node',
      type: 'input',
      position: { x: 100, y: 100 },
      data: { label: 'Input', inputType: 'text', placeholder: 'Enter text...' },
    })
    useWorkflowStore.getState().selectNode('input-node')
  })

  it('renders input type select', () => {
    render(<ConfigPanel />)
    expect(screen.getByTestId('config-input-type')).toBeInTheDocument()
  })

  it('renders placeholder input', () => {
    render(<ConfigPanel />)
    expect(screen.getByTestId('config-placeholder')).toBeInTheDocument()
  })
})

describe('ConfigPanel - Tool Node', () => {
  beforeEach(() => {
    useWorkflowStore.getState().clearWorkflow()
    useWorkflowStore.getState().addNode({
      id: 'tool-node',
      type: 'tool',
      position: { x: 100, y: 100 },
      data: { label: 'Tool', toolType: 'web-search' },
    })
    useWorkflowStore.getState().selectNode('tool-node')
  })

  it('renders tool type select', () => {
    render(<ConfigPanel />)
    expect(screen.getByTestId('config-tool-type')).toBeInTheDocument()
  })
})
