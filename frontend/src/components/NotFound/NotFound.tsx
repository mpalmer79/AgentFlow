import { Home, RefreshCw, Search, Workflow } from 'lucide-react'

interface NotFoundProps {
  onGoHome?: () => void
}

export function NotFound({ onGoHome }: NotFoundProps) {
  const handleGoHome = () => {
    if (onGoHome) {
      onGoHome()
    } else {
      window.location.href = '/'
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-950 via-slate-900 to-slate-950 flex items-center justify-center p-6">
      {/* Animated background nodes */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-1/4 left-1/4 w-32 h-32 bg-violet-500/10 rounded-2xl rotate-12 animate-pulse" />
        <div className="absolute top-1/3 right-1/4 w-24 h-24 bg-blue-500/10 rounded-2xl -rotate-6 animate-pulse delay-300" />
        <div className="absolute bottom-1/4 left-1/3 w-20 h-20 bg-emerald-500/10 rounded-2xl rotate-45 animate-pulse delay-500" />
        <div className="absolute bottom-1/3 right-1/3 w-28 h-28 bg-amber-500/10 rounded-2xl -rotate-12 animate-pulse delay-700" />
        
        {/* Disconnected flow lines */}
        <svg className="absolute inset-0 w-full h-full opacity-20">
          <path
            d="M100,200 Q200,100 300,200"
            stroke="url(#gradient1)"
            strokeWidth="2"
            fill="none"
            strokeDasharray="8 8"
            className="animate-flow-dash"
          />
          <path
            d="M400,300 Q500,400 600,300"
            stroke="url(#gradient2)"
            strokeWidth="2"
            fill="none"
            strokeDasharray="8 8"
            className="animate-flow-dash"
          />
          <defs>
            <linearGradient id="gradient1" x1="0%" y1="0%" x2="100%" y2="0%">
              <stop offset="0%" stopColor="#8b5cf6" />
              <stop offset="100%" stopColor="#3b82f6" />
            </linearGradient>
            <linearGradient id="gradient2" x1="0%" y1="0%" x2="100%" y2="0%">
              <stop offset="0%" stopColor="#10b981" />
              <stop offset="100%" stopColor="#8b5cf6" />
            </linearGradient>
          </defs>
        </svg>
      </div>

      {/* Main content */}
      <div className="relative z-10 text-center max-w-2xl mx-auto">
        {/* Broken workflow icon */}
        <div className="mb-8 relative inline-block">
          <div className="w-32 h-32 mx-auto bg-slate-800/50 rounded-3xl border border-slate-700/50 flex items-center justify-center backdrop-blur-sm">
            <Workflow className="w-16 h-16 text-slate-500" />
          </div>
          {/* Disconnected indicator */}
          <div className="absolute -top-2 -right-2 w-8 h-8 bg-rose-500/20 border border-rose-500/50 rounded-full flex items-center justify-center">
            <span className="text-rose-400 text-lg font-bold">!</span>
          </div>
        </div>

        {/* Error code */}
        <div className="mb-4">
          <span className="text-8xl md:text-9xl font-bold bg-gradient-to-r from-violet-400 via-blue-400 to-emerald-400 bg-clip-text text-transparent">
            404
          </span>
        </div>

        {/* Message */}
        <h1 className="text-2xl md:text-3xl font-semibold text-white mb-4">
          Workflow Not Found
        </h1>
        <p className="text-slate-400 text-lg mb-8 max-w-md mx-auto">
          Looks like this node got disconnected from the flow. 
          The page you're looking for doesn't exist or has been moved.
        </p>

        {/* Action buttons */}
        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <button
            onClick={handleGoHome}
            className="inline-flex items-center justify-center gap-2 px-6 py-3 bg-gradient-to-r from-violet-600 to-blue-600 hover:from-violet-500 hover:to-blue-500 text-white font-medium rounded-xl transition-all duration-200 shadow-lg shadow-violet-500/25 hover:shadow-violet-500/40"
          >
            <Home className="w-5 h-5" />
            Back to Home
          </button>
          <button
            onClick={() => window.history.back()}
            className="inline-flex items-center justify-center gap-2 px-6 py-3 bg-slate-800 hover:bg-slate-700 text-slate-200 font-medium rounded-xl transition-all duration-200 border border-slate-700"
          >
            <RefreshCw className="w-5 h-5" />
            Go Back
          </button>
        </div>

        {/* Help text */}
        <div className="mt-12 p-4 bg-slate-800/30 rounded-xl border border-slate-700/50 backdrop-blur-sm">
          <div className="flex items-center justify-center gap-2 text-slate-500 text-sm">
            <Search className="w-4 h-4" />
            <span>
              Try checking the URL or{' '}
              <button 
                onClick={handleGoHome}
                className="text-violet-400 hover:text-violet-300 underline underline-offset-2"
              >
                start a new workflow
              </button>
            </span>
          </div>
        </div>
      </div>
    </div>
  )
}

export default NotFound
