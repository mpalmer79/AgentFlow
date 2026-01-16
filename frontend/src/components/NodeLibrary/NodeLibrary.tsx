import { 
  MessageSquare, 
  Wrench, 
  GitBranch, 
  Repeat, 
  Sparkles,
  LogIn,
  LogOut,
  Search,
  X
} from 'lucide-react'
import { useState } from 'react'
import { NodeType } from '../../types/workflow'

interface NodeDefinition {
  type: NodeType
  label: string
  description: string
  icon: React.ComponentType<{ className?: string }>
  color: string
}

interface NodeLibraryProps {
  isOpen?: boolean
  onClose?: () => void
  isMobile?: boolean
}

const nodeDefinitions: NodeDefinition[] = [
  {
    type: 'input',
    label: 'Input',
    description: 'User prompt, file upload, or webhook trigger',
    icon: LogIn,
    color: 'text-emerald-400 bg-emerald-500/10 border-emerald-500/30',
  },
  {
    type: 'llm',
    label: 'LLM',
    description: 'AI model call with customizable prompt',
    icon: MessageSquare,
    color: 'text-violet-400 bg-violet-500/10 border-violet-500/30',
  },
  {
    type: 'tool',
    label: 'Tool',
    description: 'Web search, calculator, code executor',
    icon: Wrench,
    color: 'text-amber-400 bg-amber-500/10 border-amber-500/30',
  },
  {
    type: 'router',
    label: 'Router',
    description: 'Conditional branching based on logic',
    icon: GitBranch,
    color: 'text-blue-400 bg-blue-500/10 border-blue-500/30',
  },
  {
    type: 'loop',
    label: 'Loop',
    description: 'Iterate over arrays or repeat actions',
    icon: Repeat,
    color: 'text-cyan-400 bg-cyan-500/10 border-cyan-500/30',
  },
  {
    type: 'transform',
    label: 'Transform',
    description: 'Parse JSON, extract fields, format text',
    icon: Sparkles,
    color: 'text-pink-400 bg-pink-500/10 border-pink-500/30',
  },
  {
    type: 'output',
    label: 'Output',
    description: 'Display result, save file, API response',
    icon: LogOut,
    color: 'text-rose-400 bg-rose-500/10 border-rose-500/30',
  },
]

export default function NodeLibrary({ isOpen = true, onClose, isMobile = false }: NodeLibraryProps) {
  const [searchQuery, setSearchQuery] = useState('')

  const filteredNodes = nodeDefinitions.filter(
    (node) =>
      node.label.toLowerCase().includes(searchQuery.toLowerCase()) ||
      node.description.toLowerCase().includes(searchQuery.toLowerCase())
  )

  const onDragStart = (event: React.DragEvent, node: NodeDefinition) => {
    event.dataTransfer.setData('application/agentflow-node-type', node.type)
    event.dataTransfer.setData('application/agentflow-node-label', node.label)
    event.dataTransfer.effectAllowed = 'move'
  }

  // Mobile: slide-in panel
  // Desktop: collapsible sidebar
  const sidebarClasses = isMobile
    ? `fixed inset-y-0 left-0 z-50 w-72 transform transition-transform duration-300 ease-in-out ${
        isOpen ? 'translate-x-0' : '-translate-x-full'
      }`
    : `hidden lg:flex transition-all duration-300 ease-in-out ${
        isOpen ? 'w-64' : 'w-0 overflow-hidden'
      }`

  return (
    <aside 
      className={`${sidebarClasses} border-r border-canvas-border bg-canvas-surface/95 backdrop-blur-sm flex-col`}
      data-testid="node-library"
    >
      <div className="p-4 border-b border-canvas-border">
        <div className="flex items-center justify-between mb-3">
          <h2 className="font-display font-semibold text-sm">Nodes</h2>
          {isMobile && onClose && (
            <button 
              onClick={onClose}
              className="p-1.5 rounded-lg hover:bg-canvas-hover transition-colors lg:hidden"
            >
              <X className="w-4 h-4" />
            </button>
          )}
        </div>
        
        <div className="relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-500" />
          <input
            type="text"
            placeholder="Search nodes..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-9 pr-3 py-2 bg-canvas-bg border border-canvas-border rounded-lg text-sm focus:outline-none focus:border-agent-500 transition-colors"
            data-testid="node-search"
          />
        </div>
      </div>

      <div className="flex-1 overflow-y-auto p-3 space-y-2">
        {filteredNodes.map((node) => (
          <div
            key={node.type}
            draggable
            onDragStart={(e) => onDragStart(e, node)}
            className={`
              p-3 rounded-lg border cursor-grab active:cursor-grabbing
              ${node.color}
              hover:scale-[1.02] hover:shadow-lg
              transition-all duration-200
            `}
            data-testid={`node-library-item-${node.type}`}
          >
            <div className="flex items-center gap-3">
              <node.icon className="w-5 h-5" />
              <div>
                <h3 className="font-medium text-sm text-white">{node.label}</h3>
                <p className="text-xs text-gray-400 line-clamp-1">{node.description}</p>
              </div>
            </div>
          </div>
        ))}

        {filteredNodes.length === 0 && (
          <div className="text-center py-8 text-gray-500 text-sm">
            No nodes found matching "{searchQuery}"
          </div>
        )}
      </div>

      <div className="p-4 border-t border-canvas-border space-y-3">
        <div className="flex items-start gap-2">
          <div className="w-1.5 h-1.5 rounded-full bg-agent-400 mt-1.5 animate-pulse" />
          <p className="text-xs text-gray-400">
            <span className="text-white font-medium">Drag & drop</span> nodes onto the canvas
          </p>
        </div>
        <div className="flex items-start gap-2">
          <div className="w-1.5 h-1.5 rounded-full bg-flow-400 mt-1.5" />
          <p className="text-xs text-gray-400">
            <span className="text-white font-medium">Connect</span> nodes by dragging between handles
          </p>
        </div>
        <div className="flex items-start gap-2">
          <div className="w-1.5 h-1.5 rounded-full bg-emerald-400 mt-1.5" />
          <p className="text-xs text-gray-400">
            <span className="text-white font-medium">Click</span> any node to configure it
          </p>
        </div>
      </div>
    </aside>
  )
}
