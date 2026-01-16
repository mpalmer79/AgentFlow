import { X } from 'lucide-react'
import { useWorkflowStore, useSelectedNode } from '../../store/workflowStore'
import { NodeType, LLMNodeData, InputNodeData, ToolNodeData, RouterNodeData, TransformNodeData, OutputNodeData } from '../../types/workflow'

export default function ConfigPanel() {
  const { toggleConfigPanel, updateNode } = useWorkflowStore()
  const selectedNode = useSelectedNode()

  if (!selectedNode) {
    return null
  }

  const nodeType = selectedNode.type as NodeType

  const handleUpdate = (updates: Record<string, unknown>) => {
    updateNode(selectedNode.id, updates)
  }

  return (
    <aside 
      className="w-80 border-l border-canvas-border bg-canvas-surface/50 flex flex-col"
      data-testid="config-panel"
    >
      <div className="p-4 border-b border-canvas-border flex items-center justify-between">
        <div>
          <h2 className="font-display font-semibold text-sm">Configure Node</h2>
          <p className="text-xs text-gray-500 capitalize">{nodeType} Node</p>
        </div>
        <button
          onClick={() => toggleConfigPanel(false)}
          className="p-1.5 rounded-lg hover:bg-canvas-hover transition-colors"
          data-testid="close-config-panel"
        >
          <X className="w-4 h-4" />
        </button>
      </div>

      <div className="flex-1 overflow-y-auto p-4 space-y-4">
        <div>
          <label className="block text-xs font-medium text-gray-400 mb-1.5">Label</label>
          <input
            type="text"
            value={selectedNode.data.label}
            onChange={(e) => handleUpdate({ label: e.target.value })}
            className="w-full px-3 py-2 bg-canvas-bg border border-canvas-border rounded-lg text-sm focus:outline-none focus:border-agent-500 transition-colors"
            data-testid="config-label"
          />
        </div>

        <div>
          <label className="block text-xs font-medium text-gray-400 mb-1.5">Description</label>
          <textarea
            value={selectedNode.data.description || ''}
            onChange={(e) => handleUpdate({ description: e.target.value })}
            placeholder="Optional description..."
            rows={2}
            className="w-full px-3 py-2 bg-canvas-bg border border-canvas-border rounded-lg text-sm focus:outline-none focus:border-agent-500 transition-colors resize-none"
            data-testid="config-description"
          />
        </div>

        {nodeType === 'input' && <InputConfig data={selectedNode.data as InputNodeData} onUpdate={handleUpdate} />}
        {nodeType === 'llm' && <LLMConfig data={selectedNode.data as LLMNodeData} onUpdate={handleUpdate} />}
        {nodeType === 'tool' && <ToolConfig data={selectedNode.data as ToolNodeData} onUpdate={handleUpdate} />}
        {nodeType === 'router' && <RouterConfig data={selectedNode.data as RouterNodeData} onUpdate={handleUpdate} />}
        {nodeType === 'transform' && <TransformConfig data={selectedNode.data as TransformNodeData} onUpdate={handleUpdate} />}
        {nodeType === 'output' && <OutputConfig data={selectedNode.data as OutputNodeData} onUpdate={handleUpdate} />}
      </div>
    </aside>
  )
}

function InputConfig({ data, onUpdate }: { data: InputNodeData; onUpdate: (updates: Record<string, unknown>) => void }) {
  return (
    <>
      <div>
        <label className="block text-xs font-medium text-gray-400 mb-1.5">Input Type</label>
        <select
          value={data.inputType}
          onChange={(e) => onUpdate({ inputType: e.target.value })}
          className="w-full px-3 py-2 bg-canvas-bg border border-canvas-border rounded-lg text-sm focus:outline-none focus:border-agent-500"
          data-testid="config-input-type"
        >
          <option value="text">Text Input</option>
          <option value="file">File Upload</option>
          <option value="webhook">Webhook</option>
        </select>
      </div>
      <div>
        <label className="block text-xs font-medium text-gray-400 mb-1.5">Placeholder</label>
        <input
          type="text"
          value={data.placeholder || ''}
          onChange={(e) => onUpdate({ placeholder: e.target.value })}
          placeholder="Enter placeholder text..."
          className="w-full px-3 py-2 bg-canvas-bg border border-canvas-border rounded-lg text-sm focus:outline-none focus:border-agent-500"
          data-testid="config-placeholder"
        />
      </div>
    </>
  )
}

function LLMConfig({ data, onUpdate }: { data: LLMNodeData; onUpdate: (updates: Record<string, unknown>) => void }) {
  return (
    <>
      <div>
        <label className="block text-xs font-medium text-gray-400 mb-1.5">Model</label>
        <select
          value={data.model}
          onChange={(e) => onUpdate({ model: e.target.value })}
          className="w-full px-3 py-2 bg-canvas-bg border border-canvas-border rounded-lg text-sm focus:outline-none focus:border-agent-500"
          data-testid="config-model"
        >
          <option value="claude-4-opus">Claude 4 Opus</option>
          <option value="claude-4-sonnet">Claude 4 Sonnet</option>
          <option value="claude-4-haiku">Claude 4 Haiku</option>
        </select>
      </div>
      <div>
        <label className="block text-xs font-medium text-gray-400 mb-1.5">Prompt</label>
        <textarea
          value={data.prompt}
          onChange={(e) => onUpdate({ prompt: e.target.value })}
          placeholder="Enter your prompt... Use {{input}} for variables"
          rows={4}
          className="w-full px-3 py-2 bg-canvas-bg border border-canvas-border rounded-lg text-sm focus:outline-none focus:border-agent-500 resize-none font-mono"
          data-testid="config-prompt"
        />
      </div>
      <div>
        <label className="block text-xs font-medium text-gray-400 mb-1.5">Temperature: {data.temperature ?? 0.7}</label>
        <input
          type="range"
          min="0"
          max="1"
          step="0.1"
          value={data.temperature ?? 0.7}
          onChange={(e) => onUpdate({ temperature: parseFloat(e.target.value) })}
          className="w-full"
          data-testid="config-temperature"
        />
      </div>
    </>
  )
}

function ToolConfig({ data, onUpdate }: { data: ToolNodeData; onUpdate: (updates: Record<string, unknown>) => void }) {
  return (
    <div>
      <label className="block text-xs font-medium text-gray-400 mb-1.5">Tool Type</label>
      <select
        value={data.toolType}
        onChange={(e) => onUpdate({ toolType: e.target.value })}
        className="w-full px-3 py-2 bg-canvas-bg border border-canvas-border rounded-lg text-sm focus:outline-none focus:border-agent-500"
        data-testid="config-tool-type"
      >
        <option value="web-search">Web Search</option>
        <option value="calculator">Calculator</option>
        <option value="code-executor">Code Executor</option>
        <option value="api-call">API Call</option>
      </select>
    </div>
  )
}

function RouterConfig({ data, onUpdate }: { data: RouterNodeData; onUpdate: (updates: Record<string, unknown>) => void }) {
  return (
    <div>
      <label className="block text-xs font-medium text-gray-400 mb-1.5">Condition</label>
      <textarea
        value={data.condition}
        onChange={(e) => onUpdate({ condition: e.target.value })}
        placeholder="e.g., {{input}}.length > 100"
        rows={2}
        className="w-full px-3 py-2 bg-canvas-bg border border-canvas-border rounded-lg text-sm focus:outline-none focus:border-agent-500 resize-none font-mono"
        data-testid="config-condition"
      />
    </div>
  )
}

function TransformConfig({ data, onUpdate }: { data: TransformNodeData; onUpdate: (updates: Record<string, unknown>) => void }) {
  return (
    <div>
      <label className="block text-xs font-medium text-gray-400 mb-1.5">Transform Type</label>
      <select
        value={data.transformType}
        onChange={(e) => onUpdate({ transformType: e.target.value })}
        className="w-full px-3 py-2 bg-canvas-bg border border-canvas-border rounded-lg text-sm focus:outline-none focus:border-agent-500"
        data-testid="config-transform-type"
      >
        <option value="json-parse">Parse JSON</option>
        <option value="extract-field">Extract Field</option>
        <option value="format-text">Format Text</option>
        <option value="filter">Filter</option>
      </select>
    </div>
  )
}

function OutputConfig({ data, onUpdate }: { data: OutputNodeData; onUpdate: (updates: Record<string, unknown>) => void }) {
  return (
    <div>
      <label className="block text-xs font-medium text-gray-400 mb-1.5">Output Type</label>
      <select
        value={data.outputType}
        onChange={(e) => onUpdate({ outputType: e.target.value })}
        className="w-full px-3 py-2 bg-canvas-bg border border-canvas-border rounded-lg text-sm focus:outline-none focus:border-agent-500"
        data-testid="config-output-type"
      >
        <option value="display">Display Result</option>
        <option value="file">Save to File</option>
        <option value="api-response">API Response</option>
      </select>
    </div>
  )
}
