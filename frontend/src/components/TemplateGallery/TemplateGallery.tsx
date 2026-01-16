import { Plane, Briefcase, FileText, BarChart3, X } from 'lucide-react'
import { WorkflowTemplate, TemplateCategory } from '../../types/workflow'
import { useWorkflowStore } from '../../store/workflowStore'

interface TemplateGalleryProps {
  isOpen: boolean
  onClose: () => void
}

const templates: WorkflowTemplate[] = [
  {
    id: 'trip-planner',
    name: 'Trip Planner',
    description: 'Plan your perfect vacation with AI-powered recommendations for flights, hotels, and activities.',
    category: 'personal',
    tags: ['travel', 'planning', 'ai'],
    usageCount: 2300,
    timeSaved: '3 hours',
    workflow: {
      name: 'Trip Planner',
      nodes: [
        { id: 'input-1', type: 'input', position: { x: 50, y: 150 }, data: { label: 'Trip Details', inputType: 'text', placeholder: 'Where do you want to go?' } },
        { id: 'llm-1', type: 'llm', position: { x: 300, y: 100 }, data: { label: 'Research Destination', model: 'claude-3-sonnet', prompt: 'Research the best things to do in {{input}}' } },
        { id: 'tool-1', type: 'tool', position: { x: 300, y: 250 }, data: { label: 'Search Flights', toolType: 'web-search' } },
        { id: 'llm-2', type: 'llm', position: { x: 550, y: 150 }, data: { label: 'Create Itinerary', model: 'claude-3-sonnet', prompt: 'Create a detailed itinerary based on the research' } },
        { id: 'output-1', type: 'output', position: { x: 800, y: 150 }, data: { label: 'Trip Plan', outputType: 'display' } },
      ],
      edges: [
        { id: 'e1', source: 'input-1', target: 'llm-1' },
        { id: 'e2', source: 'input-1', target: 'tool-1' },
        { id: 'e3', source: 'llm-1', target: 'llm-2' },
        { id: 'e4', source: 'tool-1', target: 'llm-2' },
        { id: 'e5', source: 'llm-2', target: 'output-1' },
      ],
    },
  },
  {
    id: 'lead-scorer',
    name: 'Lead Scorer',
    description: 'Automatically qualify and route leads based on company data and engagement signals.',
    category: 'business',
    tags: ['sales', 'automation', 'crm'],
    usageCount: 1800,
    timeSaved: '5 hours/week',
    workflow: {
      name: 'Lead Scorer',
      nodes: [
        { id: 'input-1', type: 'input', position: { x: 50, y: 150 }, data: { label: 'Lead Info', inputType: 'webhook' } },
        { id: 'tool-1', type: 'tool', position: { x: 300, y: 150 }, data: { label: 'Enrich Data', toolType: 'api-call' } },
        { id: 'llm-1', type: 'llm', position: { x: 550, y: 150 }, data: { label: 'Score Lead', model: 'claude-3-sonnet', prompt: 'Analyze this lead and provide a score 1-100' } },
        { id: 'router-1', type: 'router', position: { x: 800, y: 150 }, data: { label: 'High Value?', condition: 'score > 70' } },
        { id: 'output-1', type: 'output', position: { x: 1050, y: 100 }, data: { label: 'Priority Queue', outputType: 'api-response' } },
        { id: 'output-2', type: 'output', position: { x: 1050, y: 200 }, data: { label: 'Standard Queue', outputType: 'api-response' } },
      ],
      edges: [
        { id: 'e1', source: 'input-1', target: 'tool-1' },
        { id: 'e2', source: 'tool-1', target: 'llm-1' },
        { id: 'e3', source: 'llm-1', target: 'router-1' },
        { id: 'e4', source: 'router-1', target: 'output-1', sourceHandle: 'true' },
        { id: 'e5', source: 'router-1', target: 'output-2', sourceHandle: 'false' },
      ],
    },
  },
  {
    id: 'content-generator',
    name: 'Content Generator',
    description: 'Transform a single blog post into multi-channel content for social media and email.',
    category: 'productivity',
    tags: ['content', 'marketing', 'social'],
    usageCount: 3100,
    timeSaved: '4 hours',
    workflow: {
      name: 'Content Generator',
      nodes: [
        { id: 'input-1', type: 'input', position: { x: 50, y: 200 }, data: { label: 'Blog Post', inputType: 'text' } },
        { id: 'llm-1', type: 'llm', position: { x: 300, y: 100 }, data: { label: 'Twitter Thread', model: 'claude-3-haiku', prompt: 'Convert to a Twitter thread' } },
        { id: 'llm-2', type: 'llm', position: { x: 300, y: 200 }, data: { label: 'LinkedIn Post', model: 'claude-3-haiku', prompt: 'Convert to a LinkedIn post' } },
        { id: 'llm-3', type: 'llm', position: { x: 300, y: 300 }, data: { label: 'Email Newsletter', model: 'claude-3-sonnet', prompt: 'Convert to an email newsletter' } },
        { id: 'output-1', type: 'output', position: { x: 550, y: 200 }, data: { label: 'Content Package', outputType: 'display' } },
      ],
      edges: [
        { id: 'e1', source: 'input-1', target: 'llm-1' },
        { id: 'e2', source: 'input-1', target: 'llm-2' },
        { id: 'e3', source: 'input-1', target: 'llm-3' },
        { id: 'e4', source: 'llm-1', target: 'output-1' },
        { id: 'e5', source: 'llm-2', target: 'output-1' },
        { id: 'e6', source: 'llm-3', target: 'output-1' },
      ],
    },
  },
]

const categoryIcons: Record<TemplateCategory, React.ComponentType<{ className?: string }>> = {
  personal: Plane,
  business: Briefcase,
  productivity: FileText,
  data: BarChart3,
}

const categoryLabels: Record<TemplateCategory, string> = {
  personal: 'Personal',
  business: 'Business',
  productivity: 'Productivity',
  data: 'Data',
}

export default function TemplateGallery({ isOpen, onClose }: TemplateGalleryProps) {
  const { loadWorkflow } = useWorkflowStore()

  if (!isOpen) return null

  const handleSelectTemplate = (template: WorkflowTemplate) => {
    loadWorkflow(template.workflow.nodes, template.workflow.edges, template.workflow.name, template.description)
    onClose()
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm" data-testid="template-gallery">
      <div className="w-full max-w-4xl max-h-[80vh] bg-canvas-surface rounded-2xl shadow-2xl overflow-hidden">
        <div className="p-6 border-b border-canvas-border flex items-center justify-between">
          <div>
            <h2 className="font-display text-xl font-semibold">Template Gallery</h2>
            <p className="text-sm text-gray-400">Start with a pre-built workflow</p>
          </div>
          <button onClick={onClose} className="p-2 rounded-lg hover:bg-canvas-hover transition-colors" data-testid="close-template-gallery">
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="p-6 overflow-y-auto max-h-[calc(80vh-100px)]">
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
            {templates.map((template) => {
              const CategoryIcon = categoryIcons[template.category]
              return (
                <button
                  key={template.id}
                  onClick={() => handleSelectTemplate(template)}
                  className="p-4 rounded-xl glass hover:bg-white/10 transition-all text-left group"
                  data-testid={`template-${template.id}`}
                >
                  <div className="flex items-start justify-between mb-3">
                    <div className="w-10 h-10 rounded-lg bg-canvas-bg flex items-center justify-center group-hover:bg-canvas-hover transition-colors">
                      <CategoryIcon className="w-5 h-5 text-agent-400" />
                    </div>
                    <span className="text-xs px-2 py-1 rounded-full bg-canvas-bg text-gray-400">{categoryLabels[template.category]}</span>
                  </div>
                  <h3 className="font-display font-semibold mb-1">{template.name}</h3>
                  <p className="text-sm text-gray-400 line-clamp-2 mb-3">{template.description}</p>
                  <div className="flex items-center justify-between text-xs text-gray-500">
                    <span>{template.usageCount.toLocaleString()} uses</span>
                    <span className="text-emerald-400">Saves {template.timeSaved}</span>
                  </div>
                  <div className="flex gap-1 mt-3">
                    {template.tags.map((tag) => (
                      <span key={tag} className="px-2 py-0.5 text-xs rounded bg-canvas-bg text-gray-400">{tag}</span>
                    ))}
                  </div>
                </button>
              )
            })}
          </div>
        </div>
      </div>
    </div>
  )
}
