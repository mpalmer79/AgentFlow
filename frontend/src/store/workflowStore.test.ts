import { describe, it, expect, beforeEach } from 'vitest'
import { useWorkflowStore } from './workflowStore'
import { WorkflowNode } from '../types/workflow'

describe('workflowStore', () => {
  beforeEach(() => {
    useWorkflowStore.getState().clearWorkflow()
  })

  describe('initial state', () => {
    it('should have empty nodes and edges', () => {
      const state = useWorkflowStore.getState()
      expect(state.nodes).toEqual([])
      expect(state.edges).toEqual([])
    })

    it('should have default workflow name', () => {
      const state = useWorkflowStore.getState()
      expect(state.workflowName).toBe('Untitled Workflow')
    })

    it('should have idle execution status', () => {
      const state = useWorkflowStore.getState()
      expect(state.executionStatus).toBe('idle')
    })
  })

  describe('addNode', () => {
    it('should add a node to the workflow', () => {
      const node: WorkflowNode = {
        id: 'node-1',
        type: 'input',
        position: { x: 100, y: 100 },
        data: { label: 'Test Input', inputType: 'text' },
      }

      useWorkflowStore.getState().addNode(node)
      
      const state = useWorkflowStore.getState()
      expect(state.nodes).toHaveLength(1)
      expect(state.nodes[0]).toEqual(node)
    })
  })

  describe('updateNode', () => {
    it('should update node data', () => {
      const node: WorkflowNode = {
        id: 'node-1',
        type: 'input',
        position: { x: 100, y: 100 },
        data: { label: 'Original', inputType: 'text' },
      }

      useWorkflowStore.getState().addNode(node)
      useWorkflowStore.getState().updateNode('node-1', { label: 'Updated' })
      
      const state = useWorkflowStore.getState()
      expect(state.nodes[0].data.label).toBe('Updated')
    })
  })

  describe('removeNode', () => {
    it('should remove a node and its edges', () => {
      const node1: WorkflowNode = {
        id: 'node-1',
        type: 'input',
        position: { x: 100, y: 100 },
        data: { label: 'Input', inputType: 'text' },
      }
      const node2: WorkflowNode = {
        id: 'node-2',
        type: 'llm',
        position: { x: 300, y: 100 },
        data: { label: 'LLM', model: 'claude-3-sonnet', prompt: 'Test' },
      }

      useWorkflowStore.getState().addNode(node1)
      useWorkflowStore.getState().addNode(node2)
      useWorkflowStore.getState().addEdge({ source: 'node-1', target: 'node-2', sourceHandle: null, targetHandle: null })
      
      useWorkflowStore.getState().removeNode('node-1')
      
      const state = useWorkflowStore.getState()
      expect(state.nodes).toHaveLength(1)
      expect(state.edges).toHaveLength(0)
    })
  })

  describe('execution', () => {
    it('should start execution', () => {
      useWorkflowStore.getState().startExecution()
      
      const state = useWorkflowStore.getState()
      expect(state.executionStatus).toBe('running')
      expect(state.executionTrace).not.toBeNull()
    })

    it('should complete execution', () => {
      useWorkflowStore.getState().startExecution()
      useWorkflowStore.getState().completeExecution('success')
      
      const state = useWorkflowStore.getState()
      expect(state.executionStatus).toBe('success')
    })

    it('should reset execution', () => {
      useWorkflowStore.getState().startExecution()
      useWorkflowStore.getState().resetExecution()
      
      const state = useWorkflowStore.getState()
      expect(state.executionStatus).toBe('idle')
      expect(state.executionTrace).toBeNull()
    })
  })
})
