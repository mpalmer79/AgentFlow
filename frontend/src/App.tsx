import { useState } from 'react'
import { ReactFlowProvider } from '@xyflow/react'
import { Menu, X, PanelLeftClose, PanelLeft } from 'lucide-react'
import Landing from './components/Landing/Landing'
import Canvas from './components/Canvas/Canvas'
import NodeLibrary from './components/NodeLibrary/NodeLibrary'
import ConfigPanel from './components/ConfigPanel/ConfigPanel'
import ExecutionTrace from './components/ExecutionTrace/ExecutionTrace'
import WelcomeModal from './components/WelcomeModal/WelcomeModal'
import { useWorkflowStore } from './store/workflowStore'

type View = 'landing' | 'editor'

function App() {
  const [view, setView] = useState<View>('landing')
  const [showWelcome, setShowWelcome] = useState(true)
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false)
  const [isSidebarOpen, setIsSidebarOpen] = useState(true)
  const { isConfigPanelOpen, executionTrace } = useWorkflowStore()

  if (view === 'landing') {
    return <Landing onGetStarted={() => setView('editor')} />
  }

  return (
    <ReactFlowProvider>
      <div className="h-screen w-screen flex flex-col gradient-bg overflow-hidden">
        {/* Welcome Modal */}
        {showWelcome && (
          <WelcomeModal 
            onClose={() => setShowWelcome(false)}
            onStartTour={() => setShowWelcome(false)}
          />
        )}
        
        {/* Mobile Menu Overlay */}
        {isMobileMenuOpen && (
          <div 
            className="fixed inset-0 bg-black/50 z-40 lg:hidden"
            onClick={() => setIsMobileMenuOpen(false)}
          />
        )}
        
        {/* Header */}
        <header className="h-14 border-b border-canvas-border flex items-center justify-between px-3 sm:px-4 glass z-30">
          <div className="flex items-center gap-2 sm:gap-3">
            {/* Mobile menu button */}
            <button
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              className="p-2 rounded-lg hover:bg-canvas-hover transition-colors lg:hidden"
              aria-label="Toggle menu"
            >
              {isMobileMenuOpen ? (
                <X className="w-5 h-5" />
              ) : (
                <Menu className="w-5 h-5" />
              )}
            </button>
            
            {/* Desktop sidebar toggle */}
            <button
              onClick={() => setIsSidebarOpen(!isSidebarOpen)}
              className="hidden lg:flex p-2 rounded-lg hover:bg-canvas-hover transition-colors"
              aria-label="Toggle sidebar"
            >
              {isSidebarOpen ? (
                <PanelLeftClose className="w-5 h-5 text-gray-400" />
              ) : (
                <PanelLeft className="w-5 h-5 text-gray-400" />
              )}
            </button>
            
            <button
              onClick={() => setView('landing')}
              className="flex items-center gap-2 hover:opacity-80 transition-opacity"
            >
              <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-agent-500 to-flow-500 flex items-center justify-center">
                <span className="text-white font-bold text-sm">AF</span>
              </div>
              <span className="font-display font-semibold text-lg hidden sm:inline">AgentFlow</span>
            </button>
          </div>

          <div className="flex items-center gap-1 sm:gap-2">
            <button className="hidden sm:block px-4 py-1.5 text-sm text-gray-400 hover:text-white transition-colors">
              Templates
            </button>
            <button 
              onClick={() => setShowWelcome(true)}
              className="hidden sm:block px-4 py-1.5 text-sm text-gray-400 hover:text-white transition-colors"
            >
              Help
            </button>
            <button className="px-3 sm:px-4 py-1.5 text-sm bg-agent-600 hover:bg-agent-500 rounded-lg transition-colors btn-glow">
              <span className="hidden sm:inline">Run Workflow</span>
              <span className="sm:hidden">Run</span>
            </button>
          </div>
        </header>

        {/* Main content */}
        <div className="flex-1 flex overflow-hidden">
          {/* Node Library Sidebar */}
          <NodeLibrary 
            isOpen={isMobileMenuOpen || isSidebarOpen}
            onClose={() => setIsMobileMenuOpen(false)}
            isMobile={isMobileMenuOpen}
          />

          {/* Canvas */}
          <div className="flex-1 relative">
            <Canvas />
            
            {/* Execution Trace Overlay */}
            {executionTrace && (
              <div className="absolute bottom-4 left-4 right-4 max-w-2xl mx-auto">
                <ExecutionTrace />
              </div>
            )}
          </div>

          {/* Config Panel */}
          {isConfigPanelOpen && <ConfigPanel />}
        </div>
      </div>
    </ReactFlowProvider>
  )
}

export default App
