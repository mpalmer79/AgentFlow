import { 
  MousePointer2, 
  Workflow, 
  Lightbulb,
  ArrowDownLeft
} from 'lucide-react'

interface EmptyCanvasStateProps {
  onLoadTemplate?: () => void
}

export default function EmptyCanvasState({ onLoadTemplate }: EmptyCanvasStateProps) {
  return (
    <div className="absolute inset-0 flex items-center justify-center pointer-events-none z-10">
      <div className="text-center max-w-md px-8">
        {/* Main instruction */}
        <div className="relative mb-8">
          <div className="w-20 h-20 mx-auto rounded-2xl bg-gradient-to-br from-agent-500/20 to-flow-500/20 border border-agent-500/30 flex items-center justify-center mb-4">
            <Workflow className="w-10 h-10 text-agent-400" />
          </div>
          <h3 className="font-display text-xl font-semibold mb-2 text-white">
            Start Building Your Workflow
          </h3>
          <p className="text-gray-400 text-sm leading-relaxed">
            Drag nodes from the sidebar onto this canvas to create your AI-powered automation.
          </p>
        </div>

        {/* Arrow pointing to sidebar */}
        <div className="absolute top-1/2 -left-8 transform -translate-y-1/2 hidden lg:block">
          <ArrowDownLeft className="w-12 h-12 text-agent-500/40 animate-pulse" />
        </div>

        {/* Quick tips */}
        <div className="space-y-3 mb-6">
          <div className="flex items-center gap-3 p-3 rounded-lg bg-canvas-surface/50 border border-canvas-border/50 text-left">
            <div className="w-8 h-8 rounded-lg bg-emerald-500/10 flex items-center justify-center flex-shrink-0">
              <MousePointer2 className="w-4 h-4 text-emerald-400" />
            </div>
            <div>
              <p className="text-sm font-medium text-white">Drag & Drop</p>
              <p className="text-xs text-gray-400">Pick a node from the left panel and drop it here</p>
            </div>
          </div>

          <div className="flex items-center gap-3 p-3 rounded-lg bg-canvas-surface/50 border border-canvas-border/50 text-left">
            <div className="w-8 h-8 rounded-lg bg-amber-500/10 flex items-center justify-center flex-shrink-0">
              <Lightbulb className="w-4 h-4 text-amber-400" />
            </div>
            <div>
              <p className="text-sm font-medium text-white">Start Simple</p>
              <p className="text-xs text-gray-400">Try: Input → LLM → Output for your first workflow</p>
            </div>
          </div>
        </div>

        {/* Template shortcut */}
        {onLoadTemplate && (
          <button
            onClick={onLoadTemplate}
            className="pointer-events-auto px-4 py-2 text-sm text-agent-400 hover:text-agent-300 hover:bg-agent-500/10 rounded-lg transition-all border border-agent-500/30 hover:border-agent-500/50"
          >
            Or start with a template →
          </button>
        )}
      </div>
    </div>
  )
}
