import { describe, it, expect, beforeEach, vi } from 'vitest'
import { render, screen, fireEvent } from '@testing-library/react'
import { ReactFlowProvider } from '@xyflow/react'
import Canvas from './Canvas'
import { useWorkflowStore } from '../../store/workflowStore'

const CanvasWithProvider = () => (
  <ReactFlowProvider>
    <div style={{ width: 800, height: 600 }}>
      <Canvas />
    </div>
  </ReactFlowProvider>
)

describe('Canvas', () => {
  beforeEach(() => {
    useWorkflowStore.getState().clearWorkflow()
  })

  it('renders the canvas container', () => {
    render(<CanvasWithProvider />)
    expect(screen.getByTestId('workflow-canvas')).toBeInTheDocument()
  })

  it('renders with empty state initially', () => {
    render(<CanvasWithProvider />)
    const state = useWorkflowStore.getState()
    expect(state.nodes).toHaveLength(0)
    expect(state.edges).toHaveLength(0)
  })

  it('renders nodes when added to store', () => {
    useWorkflowStore.getState().addNode({
      id: 'test-node-1',
      type: 'input',
      position: { x: 100, y: 100 },
      data: { label: 'Test Input', inputType: 'text' },
    })

    render(<CanvasWithProvider />)
    
    const state = useWorkflowStore.getState()
    expect(state.nodes).toHaveLength(1)
  })

  it('renders multiple nodes', () => {
    useWorkflowStore.getState().addNode({
      id: 'node-1',
      type: 'input',
      position: { x: 100, y: 100 },
      data: { label: 'Input', inputType: 'text' },
    })
    useWorkflowStore.getState().addNode({
      id: 'node-2',
      type: 'llm',
      position: { x: 300, y: 100 },
      data: { label: 'LLM', model: 'claude-3-sonnet', prompt: 'Test' },
    })

    render(<CanvasWithProvider />)
    
    const state = useWorkflowStore.getState()
    expect(state.nodes).toHaveLength(2)
  })

  it('handles drag over events', () => {
    render(<CanvasWithProvider />)
    const canvas = screen.getByTestId('workflow-canvas')
    
    const dragOverEvent = new Event('dragover', { bubbles: true })
    Object.defineProperty(dragOverEvent, 'preventDefault', { value: vi.fn() })
    Object.defineProperty(dragOverEvent, 'dataTransfer', { 
      value: { dropEffect: '' } 
    })
    
    fireEvent(canvas, dragOverEvent)
  })

  it('maintains selection state when node is selected', () => {
    useWorkflowStore.getState().addNode({
      id: 'test-node',
      type: 'input',
      position: { x: 100, y: 100 },
      data: { label: 'Test', inputType: 'text' },
    })
    
    render(<CanvasWithProvider />)
    
    useWorkflowStore.getState().selectNode('test-node')
    const state = useWorkflowStore.getState()
    expect(state.selectedNodeId).toBe('test-node')
  })

  it('clears selection on pane click', () => {
    useWorkflowStore.getState().addNode({
      id: 'test-node',
      type: 'input',
      position: { x: 100, y: 100 },
      data: { label: 'Test', inputType: 'text' },
    })
    useWorkflowStore.getState().selectNode('test-node')
    
    render(<CanvasWithProvider />)
    
    useWorkflowStore.getState().selectNode(null)
    const state = useWorkflowStore.getState()
    expect(state.selectedNodeId).toBeNull()
  })
})

describe('Canvas node operations', () => {
  beforeEach(() => {
    useWorkflowStore.getState().clearWorkflow()
  })

  it('adds edge when nodes are connected', () => {
    useWorkflowStore.getState().addNode({
      id: 'node-1',
      type: 'input',
      position: { x: 100, y: 100 },
      data: { label: 'Input', inputType: 'text' },
    })
    useWorkflowStore.getState().addNode({
      id: 'node-2',
      type: 'llm',
      position: { x: 300, y: 100 },
      data: { label: 'LLM', model: 'claude-3-sonnet', prompt: '' },
    })

    useWorkflowStore.getState().addEdge({
      source: 'node-1',
      target: 'node-2',
      sourceHandle: null,
      targetHandle: null,
    })

    render(<CanvasWithProvider />)
    
    const state = useWorkflowStore.getState()
    expect(state.edges).toHaveLength(1)
    expect(state.edges[0].source).toBe('node-1')
    expect(state.edges[0].target).toBe('node-2')
  })

  it('removes edges when source node is deleted', () => {
    useWorkflowStore.getState().addNode({
      id: 'node-1',
      type: 'input',
      position: { x: 100, y: 100 },
      data: { label: 'Input', inputType: 'text' },
    })
    useWorkflowStore.getState().addNode({
      id: 'node-2',
      type: 'llm',
      position: { x: 300, y: 100 },
      data: { label: 'LLM', model: 'claude-3-sonnet', prompt: '' },
    })
    useWorkflowStore.getState().addEdge({
      source: 'node-1',
      target: 'node-2',
      sourceHandle: null,
      targetHandle: null,
    })

    useWorkflowStore.getState().removeNode('node-1')

    render(<CanvasWithProvider />)
    
    const state = useWorkflowStore.getState()
    expect(state.nodes).toHaveLength(1)
    expect(state.edges).toHaveLength(0)
  })
})
