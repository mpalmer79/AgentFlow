import { useCallback } from 'react'
import {
  ReactFlow,
  Background,
  Controls,
  MiniMap,
  BackgroundVariant,
  NodeTypes,
  Connection,
  useReactFlow,
} from '@xyflow/react'
import '@xyflow/react/dist/style.css'

import { useWorkflowStore } from '../../store/workflowStore'
import WorkflowNode from '../WorkflowNode/WorkflowNode'
import EmptyCanvasState from '../EmptyCanvasState/EmptyCanvasState'
import { NodeType, WorkflowNodeData } from '../../types/workflow'

const nodeTypes: NodeTypes = {
  input: WorkflowNode,
  llm: WorkflowNode,
  tool: WorkflowNode,
  router: WorkflowNode,
  loop: WorkflowNode,
  transform: WorkflowNode,
  output: WorkflowNode,
}

const defaultEdgeOptions = {
  style: { strokeWidth: 2, stroke: '#6366f1' },
  animated: true,
}

export default function Canvas() {
  const { 
    nodes, 
    edges, 
    onNodesChange, 
    onEdgesChange, 
    addEdge,
    selectNode 
  } = useWorkflowStore()

  const { screenToFlowPosition } = useReactFlow()

  const onConnect = useCallback(
    (connection: Connection) => {
      addEdge(connection)
    },
    [addEdge]
  )

  const onNodeClick = useCallback(
    (_: React.MouseEvent, node: { id: string }) => {
      selectNode(node.id)
    },
    [selectNode]
  )

  const onPaneClick = useCallback(() => {
    selectNode(null)
  }, [selectNode])

  const onDragOver = useCallback((event: React.DragEvent) => {
    event.preventDefault()
    event.dataTransfer.dropEffect = 'move'
  }, [])

  const onDrop = useCallback(
    (event: React.DragEvent) => {
      event.preventDefault()

      const type = event.dataTransfer.getData('application/agentflow-node-type') as NodeType
      const label = event.dataTransfer.getData('application/agentflow-node-label')

      if (!type) return

      const position = screenToFlowPosition({
        x: event.clientX,
        y: event.clientY,
      })

      const newNode = {
        id: `${type}-${Date.now()}`,
        type,
        position,
        data: getDefaultNodeData(type, label),
      }

      useWorkflowStore.getState().addNode(newNode)
    },
    [screenToFlowPosition]
  )

  return (
    <div className="w-full h-full relative" data-testid="workflow-canvas">
      {/* Empty state overlay */}
      {nodes.length === 0 && <EmptyCanvasState />}
      
      <ReactFlow
        nodes={nodes}
        edges={edges}
        onNodesChange={onNodesChange}
        onEdgesChange={onEdgesChange}
        onConnect={onConnect}
        onNodeClick={onNodeClick}
        onPaneClick={onPaneClick}
        onDragOver={onDragOver}
        onDrop={onDrop}
        nodeTypes={nodeTypes}
        defaultEdgeOptions={defaultEdgeOptions}
        fitView
        snapToGrid
        snapGrid={[16, 16]}
        minZoom={0.2}
        maxZoom={2}
        className="bg-canvas-bg"
      >
        <Background
          variant={BackgroundVariant.Dots}
          gap={24}
          size={1}
          color="#2a2a35"
        />
        <Controls 
          className="!bg-canvas-surface !border-canvas-border !rounded-lg overflow-hidden"
          showInteractive={false}
        />
        {/* Hide MiniMap on mobile for more canvas space */}
        <MiniMap
          className="!bg-canvas-surface !border-canvas-border !rounded-lg hidden sm:block"
          nodeColor={(node) => getNodeColor(node.type as NodeType)}
          maskColor="rgba(0, 0, 0, 0.8)"
        />
      </ReactFlow>
    </div>
  )
}

function getDefaultNodeData(type: NodeType, label: string): WorkflowNodeData {
  const baseData = { label }

  switch (type) {
    case 'input':
      return { ...baseData, inputType: 'text', placeholder: 'Enter your input...' }
    case 'llm':
      return { ...baseData, model: 'claude-4-sonnet', prompt: '', temperature: 0.7 }
    case 'tool':
      return { ...baseData, toolType: 'web-search' }
    case 'router':
      return { ...baseData, condition: '', trueLabel: 'Yes', falseLabel: 'No' }
    case 'loop':
      return { ...baseData, iteratorVariable: 'item', maxIterations: 10 }
    case 'transform':
      return { ...baseData, transformType: 'json-parse' }
    case 'output':
      return { ...baseData, outputType: 'display' }
    default:
      return baseData as WorkflowNodeData
  }
}

function getNodeColor(type: NodeType): string {
  const colors: Record<NodeType, string> = {
    input: '#10b981',
    llm: '#8b5cf6',
    tool: '#f59e0b',
    router: '#3b82f6',
    loop: '#06b6d4',
    transform: '#ec4899',
    output: '#ef4444',
  }
  return colors[type] || '#6b7280'
}
