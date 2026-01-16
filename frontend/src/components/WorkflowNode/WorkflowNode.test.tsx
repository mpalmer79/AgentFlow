import { describe, it, expect, beforeEach, vi } from 'vitest'
import { render, screen, fireEvent } from '@testing-library/react'
import { ReactFlowProvider } from '@xyflow/react'
import WorkflowNode from './WorkflowNode'
import { useWorkflowStore } from '../../store/workflowStore'

const createNodeProps = (overrides = {}) => ({
  id: 'test-node',
  type: 'llm',
  data: { 
    label: 'Test Node', 
    model: 'claude-3-sonnet',
    prompt: 'Test prompt' 
  },
  selected: false,
  isConnectable: true,
  positionAbsoluteX: 0,
  positionAbsoluteY: 0,
  zIndex: 0,
  dragging: false,
  ...overrides,
})

const NodeWithProvider = (props: ReturnType<typeof createNodeProps>) => (
  <ReactFlowProvider>
    <WorkflowNode {...props} />
  </ReactFlowProvider>
)

describe('WorkflowNode', () => {
  beforeEach(() => {
    useWorkflowStore.getState().clearWorkflow()
  })

  it('renders the node with label', () => {
    render(<NodeWithProvider {...createNodeProps()} />)
    expect(screen.getByText('Test Node')).toBeInTheDocument()
  })

  it('renders the node type badge', () => {
    render(<NodeWithProvider {...createNodeProps({ type: 'llm' })} />)
    expect(screen.getByText('llm')).toBeInTheDocument()
  })

  it('renders different node types correctly', () => {
    const types = ['input', 'llm', 'tool', 'router', 'loop', 'transform', 'output']
    
    types.forEach((type) => {
      const { unmount } = render(
        <NodeWithProvider 
          {...createNodeProps({ 
            type, 
            data: { label: `${type} Node`, inputType: 'text' } 
          })} 
        />
      )
      expect(screen.getByText(type)).toBeInTheDocument()
      unmount()
    })
  })

  it('shows selected state when selected', () => {
    render(<NodeWithProvider {...createNodeProps({ selected: true })} />)
    const node = screen.getByTestId('workflow-node-test-node')
    expect(node).toHaveClass('ring-2')
  })

  it('renders description when provided', () => {
    render(
      <NodeWithProvider 
        {...createNodeProps({ 
          data: { 
            label: 'Test', 
            description: 'This is a description',
            model: 'claude-3-sonnet',
            prompt: ''
          } 
        })} 
      />
    )
    expect(screen.getByText('This is a description')).toBeInTheDocument()
  })

  it('calls removeNode when delete button is clicked', () => {
    const removeNode = vi.fn()
    useWorkflowStore.setState({ removeNode })

    render(<NodeWithProvider {...createNodeProps()} />)
    
    const deleteButton = screen.getByTestId('delete-node-test-node')
    fireEvent.click(deleteButton)
    
    expect(removeNode).toHaveBeenCalledWith('test-node')
  })

  it('shows executing state during execution', () => {
    useWorkflowStore.setState({
      executionTrace: {
        workflowId: 'test',
        status: 'running',
        startedAt: new Date().toISOString(),
        results: [],
      },
    })

    render(<NodeWithProvider {...createNodeProps()} />)
    const node = screen.getByTestId('workflow-node-test-node')
    expect(node).toHaveClass('animate-pulse')
  })

  it('shows success state after successful execution', () => {
    useWorkflowStore.setState({
      executionTrace: {
        workflowId: 'test',
        status: 'success',
        startedAt: new Date().toISOString(),
        completedAt: new Date().toISOString(),
        results: [
          {
            nodeId: 'test-node',
            status: 'success',
            duration: 150,
            timestamp: new Date().toISOString(),
          },
        ],
      },
    })

    render(<NodeWithProvider {...createNodeProps()} />)
    expect(screen.getByText(/Completed in 150ms/)).toBeInTheDocument()
  })

  it('shows error state after failed execution', () => {
    useWorkflowStore.setState({
      executionTrace: {
        workflowId: 'test',
        status: 'error',
        startedAt: new Date().toISOString(),
        completedAt: new Date().toISOString(),
        results: [
          {
            nodeId: 'test-node',
            status: 'error',
            error: 'API rate limit exceeded',
            timestamp: new Date().toISOString(),
          },
        ],
      },
    })

    render(<NodeWithProvider {...createNodeProps()} />)
    expect(screen.getByText(/API rate limit exceeded/)).toBeInTheDocument()
  })
})
