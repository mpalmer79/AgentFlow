
import { CheckCircle, XCircle, Loader2, Clock } from 'lucide-react'
import { useWorkflowStore } from '../../store/workflowStore'

export default function ExecutionTrace() {
  const { executionTrace, nodes, resetExecution } = useWorkflowStore()

  if (!executionTrace) {
    return null
  }

  const getNodeLabel = (nodeId: string) => {
    const node = nodes.find((n) => n.id === nodeId)
    return node?.data.label || nodeId
  }

  const totalDuration = executionTrace.results.reduce(
    (sum, r) => sum + (r.duration || 0),
    0
  )

  return (
    <div 
      className="glass rounded-xl p-4 shadow-xl"
      data-testid="execution-trace"
    >
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-3">
          {executionTrace.status === 'running' && (
            <Loader2 className="w-5 h-5 text-yellow-400 animate-spin" />
          )}
          {executionTrace.status === 'success' && (
            <CheckCircle className="w-5 h-5 text-green-400" />
          )}
          {executionTrace.status === 'error' && (
            <XCircle className="w-5 h-5 text-red-400" />
          )}
          
          <div>
            <h3 className="font-display font-semibold text-sm">
              {executionTrace.status === 'running' && 'Running Workflow...'}
              {executionTrace.status === 'success' && 'Workflow Completed'}
              {executionTrace.status === 'error' && 'Workflow Failed'}
            </h3>
            <p className="text-xs text-gray-400">
              {executionTrace.results.length} nodes executed
              {totalDuration > 0 && ` • ${totalDuration}ms total`}
            </p>
          </div>
        </div>

        {executionTrace.status !== 'running' && (
          <button
            onClick={resetExecution}
            className="text-xs text-gray-400 hover:text-white transition-colors"
            data-testid="reset-execution"
          >
            Dismiss
          </button>
        )}
      </div>

      <div className="space-y-2 max-h-48 overflow-y-auto">
        {executionTrace.results.map((result, index) => (
          <div
            key={`${result.nodeId}-${index}`}
            className={`
              flex items-center gap-3 p-2 rounded-lg text-sm
              ${result.status === 'success' ? 'bg-green-500/10' : ''}
              ${result.status === 'error' ? 'bg-red-500/10' : ''}
              ${result.status === 'running' ? 'bg-yellow-500/10' : ''}
            `}
            data-testid={`execution-result-${result.nodeId}`}
          >
            <div className="flex-shrink-0">
              {result.status === 'success' && (
                <CheckCircle className="w-4 h-4 text-green-400" />
              )}
              {result.status === 'error' && (
                <XCircle className="w-4 h-4 text-red-400" />
              )}
              {result.status === 'running' && (
                <Loader2 className="w-4 h-4 text-yellow-400 animate-spin" />
              )}
            </div>

            <div className="flex-1 min-w-0">
              <span className="font-medium text-white">
                {getNodeLabel(result.nodeId)}
              </span>
              {result.error && (
                <p className="text-xs text-red-300 truncate">{result.error}</p>
              )}
            </div>

            {result.duration && (
              <div className="flex items-center gap-1 text-xs text-gray-400">
                <Clock className="w-3 h-3" />
                {result.duration}ms
              </div>
            )}
          </div>
        ))}

        {executionTrace.status === 'running' && (
          <div className="flex items-center gap-3 p-2 rounded-lg bg-canvas-surface text-sm text-gray-400">
            <Loader2 className="w-4 h-4 animate-spin" />
            <span>Processing next node...</span>
          </div>
        )}
      </div>

      {executionTrace.status === 'success' && executionTrace.results.length > 0 && (
        <div className="mt-4 pt-4 border-t border-canvas-border">
          <h4 className="text-xs font-medium text-gray-400 mb-2">Output Preview</h4>
          <div className="p-3 bg-canvas-bg rounded-lg text-sm font-mono text-green-300 max-h-32 overflow-auto">
            {JSON.stringify(
              executionTrace.results[executionTrace.results.length - 1].output || 'No output',
              null,
              2
            )}
          </div>
        </div>
      )}
    </div>
  )
}
