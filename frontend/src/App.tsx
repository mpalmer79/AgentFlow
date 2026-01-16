import { useState } from 'react'
import { ReactFlowProvider } from '@xyflow/react'
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
        
        {/* Header */}
        <header className="h-14 border-b border-canvas-border flex items-center justify-between px-4 glass">
          <div className="flex items-center gap-3">
            <button
              onClick={() => setView('landing')}
              className="flex items-center gap-2 hover:opacity-80 transition-opacity"
            >
              <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-agent-500 to-flow-500 flex items-center justify-center">
                <span className="text-white font-bold text-sm">AF</span>
              </div>
              <span className="font-display font-semibold text-lg">AgentFlow</span>
            </button>
          </div>

          <div className="flex items-center gap-2">
            <button className="px-4 py-1.5 text-sm text-gray-400 hover:text-white transition-colors">
              Templates
            </button>
            <button 
              onClick={() => setShowWelcome(true)}
              className="px-4 py-1.5 text-sm text-gray-400 hover:text-white transition-colors"
            >
              Help
            </button>
            <button className="px-4 py-1.5 text-sm bg-agent-600 hover:bg-agent-500 rounded-lg transition-colors btn-glow">
              Run Workflow
            </button>
          </div>
        </header>

        {/* Main content */}
        <div className="flex-1 flex overflow-hidden">
          {/* Node Library Sidebar */}
          <NodeLibrary />

          {/* Canvas */}
          <div className="flex-1 relative">
            <Canvas />
            
            {/* Execution Trace Overlay */}
            {executionTrace && (
              <div className="absolute bottom-4 left-4 right-4 max-w-2xl">
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
