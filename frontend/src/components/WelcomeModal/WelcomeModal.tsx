
import { useState, useEffect } from 'react'
import { 
  X, 
  MousePointer2, 
  Link2, 
  Settings2, 
  Play,
  Sparkles,
  ArrowRight
} from 'lucide-react'

interface WelcomeModalProps {
  onClose: () => void
  onStartTour?: () => void
}

const STORAGE_KEY = 'agentflow-welcome-seen'

export default function WelcomeModal({ onClose, onStartTour }: WelcomeModalProps) {
  const [isVisible, setIsVisible] = useState(false)

  useEffect(() => {
    const hasSeenWelcome = localStorage.getItem(STORAGE_KEY)
    if (!hasSeenWelcome) {
      setIsVisible(true)
    }
  }, [])

  const handleClose = () => {
    localStorage.setItem(STORAGE_KEY, 'true')
    setIsVisible(false)
    onClose()
  }

  const handleStartTour = () => {
    localStorage.setItem(STORAGE_KEY, 'true')
    setIsVisible(false)
    onStartTour?.()
  }

  if (!isVisible) return null

  const steps = [
    {
      icon: MousePointer2,
      title: 'Drag & Drop Nodes',
      description: 'Pick nodes from the left sidebar and drag them onto the canvas to build your workflow.',
    },
    {
      icon: Link2,
      title: 'Connect Nodes',
      description: 'Click and drag from one node\'s handle to another to create connections between steps.',
    },
    {
      icon: Settings2,
      title: 'Configure Each Step',
      description: 'Click any node to open the config panel and customize its behavior.',
    },
    {
      icon: Play,
      title: 'Run Your Workflow',
      description: 'Hit "Run Workflow" to execute your automation and see results in real-time.',
    },
  ]

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      {/* Backdrop */}
      <div 
        className="absolute inset-0 bg-black/70 backdrop-blur-sm"
        onClick={handleClose}
      />
      
      {/* Modal */}
      <div className="relative bg-canvas-surface border border-canvas-border rounded-2xl max-w-2xl w-full shadow-2xl animate-in fade-in zoom-in-95 duration-200">
        {/* Close button */}
        <button
          onClick={handleClose}
          className="absolute top-4 right-4 p-2 rounded-lg hover:bg-canvas-hover transition-colors text-gray-400 hover:text-white"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Header */}
        <div className="p-8 pb-0 text-center">
          <div className="inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-gradient-to-br from-agent-500 to-flow-500 mb-4 shadow-lg shadow-agent-500/25">
            <Sparkles className="w-8 h-8 text-white" />
          </div>
          <h2 className="font-display text-2xl font-bold mb-2">Welcome to AgentFlow!</h2>
          <p className="text-gray-400 max-w-md mx-auto">
            Build powerful AI automations visually. Here's how to get started in 4 simple steps.
          </p>
        </div>

        {/* Steps */}
        <div className="p-8 grid grid-cols-1 sm:grid-cols-2 gap-4">
          {steps.map((step, index) => (
            <div 
              key={step.title}
              className="flex gap-4 p-4 rounded-xl bg-canvas-bg/50 border border-canvas-border/50"
            >
              <div className="flex-shrink-0 w-10 h-10 rounded-lg bg-agent-500/10 flex items-center justify-center">
                <step.icon className="w-5 h-5 text-agent-400" />
              </div>
              <div>
                <div className="flex items-center gap-2 mb-1">
                  <span className="text-xs font-medium text-agent-400">Step {index + 1}</span>
                </div>
                <h3 className="font-medium text-sm mb-1">{step.title}</h3>
                <p className="text-xs text-gray-400 leading-relaxed">{step.description}</p>
              </div>
            </div>
          ))}
        </div>

        {/* Footer */}
        <div className="p-6 pt-0 flex flex-col sm:flex-row items-center justify-center gap-3">
          <button
            onClick={handleClose}
            className="px-6 py-2.5 text-sm text-gray-400 hover:text-white transition-colors"
          >
            Skip for now
          </button>
          <button
            onClick={handleStartTour}
            className="flex items-center gap-2 px-6 py-2.5 bg-gradient-to-r from-agent-600 to-agent-500 hover:from-agent-500 hover:to-agent-400 rounded-lg transition-all text-sm font-medium shadow-lg shadow-agent-500/25"
          >
            Get Started
            <ArrowRight className="w-4 h-4" />
          </button>
        </div>

        {/* Pro tip */}
        <div className="px-8 pb-6">
          <div className="p-3 rounded-lg bg-flow-500/10 border border-flow-500/20 text-center">
            <p className="text-xs text-flow-300">
              <span className="font-medium">Pro tip:</span> Start with a Template from the top menu for pre-built workflows you can customize!
            </p>
          </div>
        </div>
      </div>
    </div>
  )
}

// Helper to reset welcome state (for testing)
export function resetWelcomeModal() {
  localStorage.removeItem(STORAGE_KEY)
}
