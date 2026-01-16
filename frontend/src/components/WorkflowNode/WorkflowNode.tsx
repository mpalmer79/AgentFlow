import { memo } from 'react'
import { Handle, Position } from '@xyflow/react'
import { 
  MessageSquare, 
  Wrench, 
  GitBranch, 
  Repeat, 
  Sparkles,
  LogIn,
  LogOut,
  X
} from 'lucide-react'
import { NodeType } from '../../types/workflow'
import { useWorkflowStore } from '../../store/workflowStore'

interface WorkflowNodeProps {
  id: string
  type?: string
  data: {
    label: string
    description?: string
    [key: string]: unknown
  }
  selected?: boolean
}

const nodeIcons: Record<NodeType, React.ComponentType<{ className?: string }>> = {
  input: LogIn,
  llm: MessageSquare,
  tool: Wrench,
  router: GitBranch,
  loop: Repeat,
  transform: Sparkles,
  output: LogOut,
}

const nodeColors: Record<NodeType, { bg: string; border: string; icon: string }> = {
  input: { bg: 'bg-emerald-900/50', border: 'border-emerald-500', icon: 'text-emerald-400' },
  llm: { bg: 'bg-violet-900/50', border: 'border-violet-500', icon: 'text-violet-400' },
  tool: { bg: 'bg-amber-900/50', border: 'border-amber-500', icon: 'text-amber-400' },
  router: { bg: 'bg-blue-900/50', border: 'border-blue-500', icon: 'text-blue-400' },
  loop: { bg: 'bg-cyan-900/50', border: 'border-cyan-500', icon: 'text-cyan-400' },
  transform: { bg: 'bg-pink-900/50', border: 'border-pink-500', icon: 'text-pink-400' },
  output: { bg: 'bg-rose-900/50', border: 'border-rose-500', icon: 'text-rose-400' },
}

function WorkflowNode({ id, type, data, selected }: WorkflowNodeProps) {
  const nodeType = (type || 'llm') as NodeType
  const Icon = nodeIcons[nodeType] || MessageSquare
  const colors = nodeColors[nodeType] || nodeColors.llm
  
  const removeNode = useWorkflowStore((state) => state.removeNode)
  const executionTrace = useWorkflowStore((state) => state.executionTrace)
  
  const nodeResult = executionTrace?.results.find((r) => r.nodeId === id)
  const isExecuting = executionTrace?.status === 'running' && !nodeResult
  const executionStatus = nodeResult?.status

  const handleDelete = (e: React.MouseEvent) => {
    e.stopPropagation()
    removeNode(id)
  }

  return (
    <div
      data-testid={`workflow-node-${id}`}
      className={`
        relative min-w-[180px] rounded-xl border-2 backdrop-blur-sm group
        ${colors.bg} ${colors.border}
        ${selected ? 'ring-2 ring-agent-500 ring-offset-2 ring-offset-canvas-bg' : ''}
        ${isExecuting ? 'animate-pulse ring-2 ring-yellow-400' : ''}
        ${executionStatus === 'success' ? 'ring-2 ring-green-400' : ''}
        ${executionStatus === 'error' ? 'ring-2 ring-red-400' : ''}
        transition-all duration-200
      `}
    >
      {nodeType !== 'input' && (
        <Handle
          type="target"
          position={Position.Left}
          className="!w-3 !h-3 !bg-gray-400 !border-2 !border-canvas-bg"
        />
      )}

      <div className="p-4">
        <div className="flex items-center justify-between mb-2">
          <div className="flex items-center gap-2">
            <div className={`p-1.5 rounded-lg bg-black/20`}>
              <Icon className={`w-4 h-4 ${colors.icon}`} />
            </div>
            <span className="text-xs font-medium uppercase tracking-wider text-gray-400">
              {nodeType}
            </span>
          </div>
          
          <button
            onClick={handleDelete}
            className="p-1 rounded hover:bg-white/10 text-gray-500 hover:text-white transition-colors opacity-0 group-hover:opacity-100"
            data-testid={`delete-node-${id}`}
          >
            <X className="w-3.5 h-3.5" />
          </button>
        </div>

        <h3 className="font-medium text-white text-sm">{data.label}</h3>
        
        {data.description && (
          <p className="text-xs text-gray-400 mt-1 line-clamp-2">{data.description}</p>
        )}

        {nodeResult && (
          <div className={`
            mt-2 p-2 rounded-lg text-xs
            ${nodeResult.status === 'success' ? 'bg-green-500/10 text-green-300' : ''}
            ${nodeResult.status === 'error' ? 'bg-red-500/10 text-red-300' : ''}
          `}>
            {nodeResult.status === 'success' && (
              <span>✓ Completed in {nodeResult.duration}ms</span>
            )}
            {nodeResult.status === 'error' && (
              <span>✗ {nodeResult.error}</span>
            )}
          </div>
        )}
      </div>

      {nodeType !== 'output' && nodeType !== 'router' && (
        <Handle
          type="source"
          position={Position.Right}
          className="!w-3 !h-3 !bg-gray-400 !border-2 !border-canvas-bg"
        />
      )}

      {nodeType === 'router' && (
        <>
          <Handle
            type="source"
            position={Position.Right}
            id="true"
            className="!w-3 !h-3 !bg-green-400 !border-2 !border-canvas-bg !top-1/3"
          />
          <Handle
            type="source"
            position={Position.Right}
            id="false"
            className="!w-3 !h-3 !bg-red-400 !border-2 !border-canvas-bg !top-2/3"
          />
        </>
      )}
    </div>
  )
}

export default memo(WorkflowNode)
