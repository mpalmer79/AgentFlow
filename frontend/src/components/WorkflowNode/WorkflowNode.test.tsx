import { describe, it, expect, vi } from 'vitest'
import { render, screen } from '@testing-library/react'
import { ReactFlowProvider } from '@xyflow/react'
import WorkflowNode from './WorkflowNode'

// Mock the store
vi.mock('../../store/workflowStore', () => ({
  useWorkflowStore: vi.fn((selector) => {
    const state = {
      removeNode: vi.fn(),
      executionTrace: null,
    }
    return selector ? selector(state) : state
  }),
}))

const renderWithProvider = (component: React.ReactNode) => {
  return render(
    <ReactFlowProvider>
      {component}
    </ReactFlowProvider>
  )
}

describe('WorkflowNode', () => {
  it('renders node with label', () => {
    renderWithProvider(
      <WorkflowNode
        id="test-1"
        type="llm"
        data={{ label: 'Test Node' }}
      />
    )
    expect(screen.getByText('Test Node')).toBeInTheDocument()
  })

  it('renders node with description', () => {
    renderWithProvider(
      <WorkflowNode
        id="test-1"
        type="llm"
        data={{ label: 'Test', description: 'A test description' }}
      />
    )
    expect(screen.getByText('A test description')).toBeInTheDocument()
  })

  it('renders different node types', () => {
    const types = ['input', 'llm', 'tool', 'router', 'loop', 'transform', 'output']
    
    types.forEach((type) => {
      const { unmount } = renderWithProvider(
        <WorkflowNode
          id={`test-${type}`}
          type={type}
          data={{ label: `${type} Node` }}
        />
      )
      expect(screen.getByText(type)).toBeInTheDocument()
      unmount()
    })
  })

  it('shows selected state', () => {
    renderWithProvider(
      <WorkflowNode
        id="test-1"
        type="llm"
        data={{ label: 'Test' }}
        selected={true}
      />
    )
    const node = screen.getByTestId('workflow-node-test-1')
    expect(node.className).toContain('ring-2')
  })

  it('renders delete button', () => {
    renderWithProvider(
      <WorkflowNode
        id="test-1"
        type="llm"
        data={{ label: 'Test' }}
      />
    )
    expect(screen.getByTestId('delete-node-test-1')).toBeInTheDocument()
  })
})
