import { describe, it, expect, beforeEach } from 'vitest'
import { render, screen, fireEvent } from '@testing-library/react'
import ExecutionTrace from './ExecutionTrace'
import { useWorkflowStore } from '../../store/workflowStore'

describe('ExecutionTrace', () => {
  beforeEach(() => {
    useWorkflowStore.getState().clearWorkflow()
  })

  it('returns null when no execution trace', () => {
    const { container } = render(<ExecutionTrace />)
    expect(container.firstChild).toBeNull()
  })

  it('renders when execution is running', () => {
    useWorkflowStore.setState({
      executionTrace: {
        workflowId: 'test',
        status: 'running',
        startedAt: new Date().toISOString(),
        results: [],
      },
    })

    render(<ExecutionTrace />)
    expect(screen.getByTestId('execution-trace')).toBeInTheDocument()
    expect(screen.getByText('Running Workflow...')).toBeInTheDocument()
  })

  it('shows success state when completed', () => {
    useWorkflowStore.setState({
      executionTrace: {
        workflowId: 'test',
        status: 'success',
        startedAt: new Date().toISOString(),
        completedAt: new Date().toISOString(),
        results: [],
      },
    })

    render(<ExecutionTrace />)
    expect(screen.getByText('Workflow Completed')).toBeInTheDocument()
  })

  it('shows error state when failed', () => {
    useWorkflowStore.setState({
      executionTrace: {
        workflowId: 'test',
        status: 'error',
        startedAt: new Date().toISOString(),
        completedAt: new Date().toISOString(),
        results: [],
      },
    })

    render(<ExecutionTrace />)
    expect(screen.getByText('Workflow Failed')).toBeInTheDocument()
  })

  it('shows node count', () => {
    useWorkflowStore.setState({
      executionTrace: {
        workflowId: 'test',
        status: 'success',
        startedAt: new Date().toISOString(),
        completedAt: new Date().toISOString(),
        results: [
          { nodeId: 'node-1', status: 'success', timestamp: new Date().toISOString() },
          { nodeId: 'node-2', status: 'success', timestamp: new Date().toISOString() },
        ],
      },
    })

    render(<ExecutionTrace />)
    expect(screen.getByText(/2 nodes executed/)).toBeInTheDocument()
  })

  it('shows total duration', () => {
    useWorkflowStore.setState({
      executionTrace: {
        workflowId: 'test',
        status: 'success',
        startedAt: new Date().toISOString(),
        completedAt: new Date().toISOString(),
        results: [
          { nodeId: 'node-1', status: 'success', duration: 100, timestamp: new Date().toISOString() },
          { nodeId: 'node-2', status: 'success', duration: 150, timestamp: new Date().toISOString() },
        ],
      },
    })

    render(<ExecutionTrace />)
    expect(screen.getByText(/250ms total/)).toBeInTheDocument()
  })
})

describe('ExecutionTrace - Results', () => {
  beforeEach(() => {
    useWorkflowStore.getState().clearWorkflow()
    useWorkflowStore.getState().addNode({
      id: 'node-1',
      type: 'input',
      position: { x: 0, y: 0 },
      data: { label: 'My Input Node', inputType: 'text' },
    })
  })

  it('renders individual node results', () => {
    useWorkflowStore.setState({
      executionTrace: {
        workflowId: 'test',
        status: 'success',
        startedAt: new Date().toISOString(),
        completedAt: new Date().toISOString(),
        results: [
          { nodeId: 'node-1', status: 'success', duration: 100, timestamp: new Date().toISOString() },
        ],
      },
    })

    render(<ExecutionTrace />)
    expect(screen.getByTestId('execution-result-node-1')).toBeInTheDocument()
  })

  it('shows node label in results', () => {
    useWorkflowStore.setState({
      executionTrace: {
        workflowId: 'test',
        status: 'success',
        startedAt: new Date().toISOString(),
        completedAt: new Date().toISOString(),
        results: [
          { nodeId: 'node-1', status: 'success', duration: 100, timestamp: new Date().toISOString() },
        ],
      },
    })

    render(<ExecutionTrace />)
    expect(screen.getByText('My Input Node')).toBeInTheDocument()
  })

  it('shows error message when node fails', () => {
    useWorkflowStore.setState({
      executionTrace: {
        workflowId: 'test',
        status: 'error',
        startedAt: new Date().toISOString(),
        completedAt: new Date().toISOString(),
        results: [
          { nodeId: 'node-1', status: 'error', error: 'Connection timeout', timestamp: new Date().toISOString() },
        ],
      },
    })

    render(<ExecutionTrace />)
    expect(screen.getByText('Connection timeout')).toBeInTheDocument()
  })
})

describe('ExecutionTrace - Actions', () => {
  beforeEach(() => {
    useWorkflowStore.getState().clearWorkflow()
  })

  it('shows dismiss button when not running', () => {
    useWorkflowStore.setState({
      executionTrace: {
        workflowId: 'test',
        status: 'success',
        startedAt: new Date().toISOString(),
        completedAt: new Date().toISOString(),
        results: [],
      },
    })

    render(<ExecutionTrace />)
    expect(screen.getByTestId('reset-execution')).toBeInTheDocument()
  })

  it('hides dismiss button when running', () => {
    useWorkflowStore.setState({
      executionTrace: {
        workflowId: 'test',
        status: 'running',
        startedAt: new Date().toISOString(),
        results: [],
      },
    })

    render(<ExecutionTrace />)
    expect(screen.queryByTestId('reset-execution')).not.toBeInTheDocument()
  })

  it('resets execution when dismiss is clicked', () => {
    useWorkflowStore.setState({
      executionTrace: {
        workflowId: 'test',
        status: 'success',
        startedAt: new Date().toISOString(),
        completedAt: new Date().toISOString(),
        results: [],
      },
    })

    render(<ExecutionTrace />)
    
    const dismissButton = screen.getByTestId('reset-execution')
    fireEvent.click(dismissButton)
    
    expect(useWorkflowStore.getState().executionTrace).toBeNull()
  })

  it('shows processing indicator when running', () => {
    useWorkflowStore.setState({
      executionTrace: {
        workflowId: 'test',
        status: 'running',
        startedAt: new Date().toISOString(),
        results: [],
      },
    })

    render(<ExecutionTrace />)
    expect(screen.getByText('Processing next node...')).toBeInTheDocument()
  })
})
