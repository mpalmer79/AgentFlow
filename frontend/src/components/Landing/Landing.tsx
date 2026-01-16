import { 
  Sparkles, 
  Zap, 
  Users, 
  Building2, 
  ArrowRight,
  Play,
  FileText,
  Mail,
  BarChart3,
  Plane,
  Briefcase,
  DollarSign
} from 'lucide-react'

interface LandingProps {
  onGetStarted: () => void
}

const templates = [
  {
    id: 'trip-planner',
    name: 'Trip Planner',
    description: 'Plan your perfect vacation with AI',
    icon: Plane,
    category: 'personal',
    uses: '2.3k',
    timeSaved: '3 hours',
  },
  {
    id: 'lead-scorer',
    name: 'Lead Scorer',
    description: 'Automatically qualify and route leads',
    icon: Briefcase,
    category: 'business',
    uses: '1.8k',
    timeSaved: '5 hours/week',
  },
  {
    id: 'content-generator',
    name: 'Content Generator',
    description: 'Turn one piece into multi-channel content',
    icon: FileText,
    category: 'productivity',
    uses: '3.1k',
    timeSaved: '4 hours',
  },
  {
    id: 'email-classifier',
    name: 'Email Classifier',
    description: 'Auto-categorize and respond to emails',
    icon: Mail,
    category: 'productivity',
    uses: '2.7k',
    timeSaved: '2 hours/day',
  },
  {
    id: 'budget-analyzer',
    name: 'Budget Analyzer',
    description: 'Understand your spending with AI insights',
    icon: DollarSign,
    category: 'personal',
    uses: '1.5k',
    timeSaved: '1 hour/week',
  },
  {
    id: 'report-generator',
    name: 'Report Generator',
    description: 'Turn data into beautiful reports',
    icon: BarChart3,
    category: 'business',
    uses: '2.1k',
    timeSaved: '6 hours',
  },
]

const useCases = [
  {
    icon: Users,
    title: 'Personal',
    description: 'Automate your daily tasks, plan trips, manage finances, and boost productivity.',
    examples: ['Trip Planning', 'Budget Analysis', 'Job Applications', 'Learning Paths'],
  },
  {
    icon: Building2,
    title: 'Business',
    description: 'Streamline operations, qualify leads, process documents, and scale your team.',
    examples: ['Lead Scoring', 'Customer Support', 'Invoice Processing', 'Content Marketing'],
  },
]

export default function Landing({ onGetStarted }: LandingProps) {
  return (
    <div className="min-h-screen gradient-bg">
      {/* Header */}
      <header className="border-b border-canvas-border">
        <div className="max-w-7xl mx-auto px-6 py-4 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-agent-500 to-flow-500 flex items-center justify-center shadow-lg shadow-agent-500/25">
              <span className="text-white font-bold">AF</span>
            </div>
            <span className="font-display font-bold text-xl">AgentFlow</span>
          </div>
          
          <nav className="hidden md:flex items-center gap-8">
            <a href="#use-cases" className="text-gray-400 hover:text-white transition-colors text-sm">Use Cases</a>
            <a href="#templates" className="text-gray-400 hover:text-white transition-colors text-sm">Templates</a>
            <a href="#how-it-works" className="text-gray-400 hover:text-white transition-colors text-sm">How It Works</a>
          </nav>

          <button
            onClick={onGetStarted}
            className="px-5 py-2 bg-agent-600 hover:bg-agent-500 rounded-lg transition-all text-sm font-medium btn-glow"
          >
            Get Started
          </button>
        </div>
      </header>

      {/* Hero */}
      <section className="py-24 px-6">
        <div className="max-w-4xl mx-auto text-center">
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-agent-500/10 border border-agent-500/20 mb-8">
            <Sparkles className="w-4 h-4 text-agent-400" />
            <span className="text-sm text-agent-300">Powered by Claude AI</span>
          </div>
          
          <h1 className="font-display text-5xl md:text-7xl font-bold mb-6 leading-tight">
            Build AI automations{' '}
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-agent-400 to-flow-400">
              visually
            </span>
          </h1>
          
          <p className="text-xl text-gray-400 mb-10 max-w-2xl mx-auto leading-relaxed">
            Connect AI blocks, define your logic, and watch your workflow come to life. 
            No code required. From personal tasks to enterprise automation.
          </p>

          <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
            <button
              onClick={onGetStarted}
              className="flex items-center gap-2 px-8 py-4 bg-gradient-to-r from-agent-600 to-agent-500 hover:from-agent-500 hover:to-agent-400 rounded-xl transition-all text-lg font-medium shadow-lg shadow-agent-500/25 btn-glow"
            >
              <Play className="w-5 h-5" />
              Start Building
            </button>
            <button className="flex items-center gap-2 px-8 py-4 glass rounded-xl hover:bg-white/10 transition-all text-lg">
              <Zap className="w-5 h-5 text-flow-400" />
              View Templates
            </button>
          </div>
        </div>
      </section>

      {/* Use Cases */}
      <section id="use-cases" className="py-20 px-6 border-t border-canvas-border">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="font-display text-3xl md:text-4xl font-bold mb-4">Built for Everyone</h2>
            <p className="text-gray-400 text-lg">Whether you're automating personal tasks or scaling enterprise operations</p>
          </div>

          <div className="grid md:grid-cols-2 gap-8">
            {useCases.map((useCase) => (
              <div key={useCase.title} className="p-8 rounded-2xl glass hover:bg-white/10 transition-all group">
                <div className="w-14 h-14 rounded-xl bg-gradient-to-br from-agent-500/20 to-flow-500/20 flex items-center justify-center mb-6 group-hover:scale-110 transition-transform">
                  <useCase.icon className="w-7 h-7 text-agent-400" />
                </div>
                <h3 className="font-display text-2xl font-semibold mb-3">{useCase.title}</h3>
                <p className="text-gray-400 mb-6">{useCase.description}</p>
                <div className="flex flex-wrap gap-2">
                  {useCase.examples.map((example) => (
                    <span key={example} className="px-3 py-1 text-sm rounded-full bg-canvas-surface text-gray-300">{example}</span>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Templates */}
      <section id="templates" className="py-20 px-6 border-t border-canvas-border">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="font-display text-3xl md:text-4xl font-bold mb-4">Start with a Template</h2>
            <p className="text-gray-400 text-lg">Pre-built workflows you can customize and run in minutes</p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {templates.map((template) => (
              <button key={template.id} onClick={onGetStarted} className="p-6 rounded-xl glass hover:bg-white/10 transition-all text-left group">
                <div className="flex items-start justify-between mb-4">
                  <div className="w-12 h-12 rounded-lg bg-canvas-surface flex items-center justify-center group-hover:bg-canvas-hover transition-colors">
                    <template.icon className="w-6 h-6 text-agent-400" />
                  </div>
                  <span className="text-xs px-2 py-1 rounded-full bg-canvas-surface text-gray-400 capitalize">{template.category}</span>
                </div>
                <h3 className="font-display text-lg font-semibold mb-2">{template.name}</h3>
                <p className="text-sm text-gray-400 mb-4">{template.description}</p>
                <div className="flex items-center justify-between text-xs text-gray-500">
                  <span>{template.uses} uses</span>
                  <span className="text-emerald-400">Saves {template.timeSaved}</span>
                </div>
              </button>
            ))}
          </div>
        </div>
      </section>

      {/* How It Works */}
      <section id="how-it-works" className="py-20 px-6 border-t border-canvas-border">
        <div className="max-w-4xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="font-display text-3xl md:text-4xl font-bold mb-4">How It Works</h2>
            <p className="text-gray-400 text-lg">Three simple steps to automate anything</p>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            {[
              { step: '01', title: 'Pick a Template', description: 'Start with a pre-built workflow or create from scratch' },
              { step: '02', title: 'Customize', description: 'Drag, drop, and configure nodes to match your needs' },
              { step: '03', title: 'Run & Share', description: 'Execute your workflow and share it with others' },
            ].map((item) => (
              <div key={item.step} className="text-center">
                <div className="text-5xl font-display font-bold text-agent-500/30 mb-4">{item.step}</div>
                <h3 className="font-display text-xl font-semibold mb-2">{item.title}</h3>
                <p className="text-gray-400">{item.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-20 px-6 border-t border-canvas-border">
        <div className="max-w-3xl mx-auto text-center">
          <h2 className="font-display text-3xl md:text-4xl font-bold mb-6">Ready to automate?</h2>
          <p className="text-gray-400 text-lg mb-10">Join thousands of people using AgentFlow to save time and boost productivity.</p>
          <button onClick={onGetStarted} className="inline-flex items-center gap-2 px-8 py-4 bg-gradient-to-r from-agent-600 to-flow-600 hover:from-agent-500 hover:to-flow-500 rounded-xl transition-all text-lg font-medium shadow-lg shadow-agent-500/25">
            Get Started Free
            <ArrowRight className="w-5 h-5" />
          </button>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-canvas-border py-8 px-6">
        <div className="max-w-6xl mx-auto flex flex-col md:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-2 text-gray-400 text-sm">
            <span>Built by</span>
            <a href="https://www.linkedin.com/in/mpalmer79/" target="_blank" rel="noopener noreferrer" className="text-agent-400 hover:text-agent-300 transition-colors">Michael Palmer</a>
          </div>
          <div className="flex items-center gap-6 text-sm text-gray-400">
            <a href="https://github.com/mpalmer79" target="_blank" rel="noopener noreferrer" className="hover:text-white transition-colors">GitHub</a>
            <a href="https://www.linkedin.com/in/mpalmer79/" target="_blank" rel="noopener noreferrer" className="hover:text-white transition-colors">LinkedIn</a>
          </div>
        </div>
      </footer>
    </div>
  )
}
