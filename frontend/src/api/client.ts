const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:8000'

export interface ExecuteWorkflowRequest {
  nodes: Array<{
    id: string
    type: string
    data: Record<string, unknown>
  }>
  edges: Array<{
    id: string
    source: string
    target: string
    sourceHandle?: string | null
    targetHandle?: string | null
  }>
  input: unknown
}

export interface ExecuteWorkflowResponse {
  success: boolean
  results: Array<{
    nodeId: string
    status: 'success' | 'error'
    output?: unknown
    error?: string
    duration: number
  }>
  finalOutput: unknown
  totalDuration: number
}

export interface ApiError {
  message: string
  code?: string
}

class ApiClient {
  private baseUrl: string

  constructor(baseUrl: string = API_BASE_URL) {
    this.baseUrl = baseUrl
  }

  private async request<T>(
    endpoint: string,
    options: RequestInit = {}
  ): Promise<T> {
    const url = `${this.baseUrl}${endpoint}`
    
    const response = await fetch(url, {
      ...options,
      headers: {
        'Content-Type': 'application/json',
        ...options.headers,
      },
    })

    if (!response.ok) {
      const error: ApiError = await response.json().catch(() => ({
        message: `HTTP error ${response.status}`,
      }))
      throw new Error(error.message)
    }

    return response.json()
  }

  async healthCheck(): Promise<{ status: string }> {
    return this.request('/health')
  }

  async executeWorkflow(
    request: ExecuteWorkflowRequest
  ): Promise<ExecuteWorkflowResponse> {
    return this.request('/api/execute', {
      method: 'POST',
      body: JSON.stringify(request),
    })
  }
}

export const apiClient = new ApiClient()
export default apiClient
