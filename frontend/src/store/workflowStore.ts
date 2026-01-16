import { create } from 'zustand'
import { 
  WorkflowNode, 
  WorkflowEdge, 
  ExecutionTrace, 
  ExecutionStatus,
  NodeExecutionResult 
} from '../types/workflow'
import { addEdge, applyNodeChanges, applyEdgeChanges, Connection, NodeChange, EdgeChange } from '@xyflow/react'

interface WorkflowState {
  nodes: WorkflowNode[]
  edges: WorkflowEdge[]
  workflowName: string
  workflowDescription: string
  selectedNodeId: string | null
  isConfigPanelOpen: boolean
  executionStatus: ExecutionStatus
  executionTrace: ExecutionTrace | null

  addNode: (node: WorkflowNode) => void
  updateNode: (nodeId: string, data: Partial<WorkflowNode['data']>) => void
  removeNode: (nodeId: string) => void
  onNodesChange: (changes: NodeChange<WorkflowNode>[]) => void
  addEdge: (connection: Connection) => void
  removeEdge: (edgeId: string) => void
  onEdgesChange: (changes: EdgeChange<WorkflowEdge>[]) => void
  selectNode: (nodeId: string | null) => void
  toggleConfigPanel: (open?: boolean) => void
  setWorkflowName: (name: string) => void
  setWorkflowDescription: (description: string) => void
  startExecution: () => void
  updateNodeExecution: (result: NodeExecutionResult) => void
  completeExecution: (status: ExecutionStatus) => void
  resetExecution: () => void
  loadWorkflow: (nodes: WorkflowNode[], edges: WorkflowEdge[], name?: string, description?: string) => void
  clearWorkflow: () => void
}

export const useWorkflowStore = create<WorkflowState>((set, get) => ({
  nodes: [],
  edges: [],
  workflowName: 'Untitled Workflow',
  workflowDescription: '',
  selectedNodeId: null,
  isConfigPanelOpen: false,
  executionStatus: 'idle',
  executionTrace: null,

  addNode: (node) => {
    set((state) => ({
      nodes: [...state.nodes, node],
    }))
  },

  updateNode: (nodeId, data) => {
    set((state) => ({
      nodes: state.nodes.map((node) =>
        node.id === nodeId
          ? { ...node, data: { ...node.data, ...data } }
          : node
      ),
    }))
  },

  removeNode: (nodeId) => {
    set((state) => ({
      nodes: state.nodes.filter((node) => node.id !== nodeId),
      edges: state.edges.filter(
        (edge) => edge.source !== nodeId && edge.target !== nodeId
      ),
      selectedNodeId: state.selectedNodeId === nodeId ? null : state.selectedNodeId,
    }))
  },

  onNodesChange: (changes) => {
    set((state) => ({
      nodes: applyNodeChanges(changes, state.nodes) as WorkflowNode[],
    }))
  },

  addEdge: (connection) => {
    set((state) => ({
      edges: addEdge(connection, state.edges),
    }))
  },

  removeEdge: (edgeId) => {
    set((state) => ({
      edges: state.edges.filter((edge) => edge.id !== edgeId),
    }))
  },

  onEdgesChange: (changes) => {
    set((state) => ({
      edges: applyEdgeChanges(changes, state.edges),
    }))
  },

  selectNode: (nodeId) => {
    set({
      selectedNodeId: nodeId,
      isConfigPanelOpen: nodeId !== null,
    })
  },

  toggleConfigPanel: (open) => {
    set((state) => ({
      isConfigPanelOpen: open ?? !state.isConfigPanelOpen,
    }))
  },

  setWorkflowName: (name) => {
    set({ workflowName: name })
  },

  setWorkflowDescription: (description) => {
    set({ workflowDescription: description })
  },

  startExecution: () => {
    set({
      executionStatus: 'running',
      executionTrace: {
        workflowId: 'current',
        status: 'running',
        startedAt: new Date().toISOString(),
        results: [],
      },
    })
  },

  updateNodeExecution: (result) => {
    set((state) => ({
      executionTrace: state.executionTrace
        ? {
            ...state.executionTrace,
            results: [...state.executionTrace.results, result],
          }
        : null,
    }))
  },

  completeExecution: (status) => {
    set((state) => ({
      executionStatus: status,
      executionTrace: state.executionTrace
        ? {
            ...state.executionTrace,
            status,
            completedAt: new Date().toISOString(),
          }
        : null,
    }))
  },

  resetExecution: () => {
    set({
      executionStatus: 'idle',
      executionTrace: null,
    })
  },

  loadWorkflow: (nodes, edges, name, description) => {
    set({
      nodes,
      edges,
      workflowName: name ?? 'Untitled Workflow',
      workflowDescription: description ?? '',
      selectedNodeId: null,
      isConfigPanelOpen: false,
      executionStatus: 'idle',
      executionTrace: null,
    })
  },

  clearWorkflow: () => {
    set({
      nodes: [],
      edges: [],
      workflowName: 'Untitled Workflow',
      workflowDescription: '',
      selectedNodeId: null,
      isConfigPanelOpen: false,
      executionStatus: 'idle',
      executionTrace: null,
    })
  },
}))

export const useSelectedNode = () => {
  const { nodes, selectedNodeId } = useWorkflowStore()
  return nodes.find((node) => node.id === selectedNodeId) ?? null
}

export const useIsExecuting = () => {
  return useWorkflowStore((state) => state.executionStatus === 'running')
}
