import { Node, Edge } from '@xyflow/react'

// Node type identifiers
export type NodeType = 
  | 'input'
  | 'llm'
  | 'tool'
  | 'router'
  | 'loop'
  | 'transform'
  | 'output'

// Base node data interface
export interface BaseNodeData {
  label: string
  description?: string
  icon?: string
}

// Specific node data interfaces
export interface InputNodeData extends BaseNodeData {
  inputType: 'text' | 'file' | 'webhook'
  placeholder?: string
}

export interface LLMNodeData extends BaseNodeData {
  model: 'claude-3-opus' | 'claude-3-sonnet' | 'claude-3-haiku'
  prompt: string
  temperature?: number
  maxTokens?: number
}

export interface ToolNodeData extends BaseNodeData {
  toolType: 'web-search' | 'calculator' | 'code-executor' | 'api-call'
  config?: Record<string, unknown>
}

export interface RouterNodeData extends BaseNodeData {
  condition: string
  trueLabel?: string
  falseLabel?: string
}

export interface LoopNodeData extends BaseNodeData {
  iteratorVariable: string
  maxIterations?: number
}

export interface TransformNodeData extends BaseNodeData {
  transformType: 'json-parse' | 'extract-field' | 'format-text' | 'filter'
  config?: Record<string, unknown>
}

export interface OutputNodeData extends BaseNodeData {
  outputType: 'display' | 'file' | 'api-response'
  format?: string
}

// Union type for all node data
export type WorkflowNodeData = 
  | InputNodeData
  | LLMNodeData
  | ToolNodeData
  | RouterNodeData
  | LoopNodeData
  | TransformNodeData
  | OutputNodeData

// Workflow node with specific data
export type WorkflowNode = Node<WorkflowNodeData, NodeType>

// Workflow edge
export type WorkflowEdge = Edge

// Complete workflow definition
export interface Workflow {
  id: string
  name: string
  description?: string
  nodes: WorkflowNode[]
  edges: WorkflowEdge[]
  createdAt: string
  updatedAt: string
}

// Template category
export type TemplateCategory = 'personal' | 'business' | 'productivity' | 'data'

// Workflow template
export interface WorkflowTemplate {
  id: string
  name: string
  description: string
  category: TemplateCategory
  tags: string[]
  usageCount: number
  timeSaved: string
  workflow: Omit<Workflow, 'id' | 'createdAt' | 'updatedAt'>
  preview?: string
}

// Execution status
export type ExecutionStatus = 'idle' | 'running' | 'success' | 'error'

// Node execution result
export interface NodeExecutionResult {
  nodeId: string
  status: ExecutionStatus
  input?: unknown
  output?: unknown
  error?: string
  duration?: number
  timestamp: string
}

// Workflow execution trace
export interface ExecutionTrace {
  workflowId: string
  status: ExecutionStatus
  startedAt: string
  completedAt?: string
  results: NodeExecutionResult[]
}
