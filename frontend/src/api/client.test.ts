import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest'
import { apiClient } from './client'

describe('ApiClient', () => {
  beforeEach(() => {
    global.fetch = vi.fn()
  })

  afterEach(() => {
    vi.restoreAllMocks()
  })

  it('healthCheck calls correct endpoint', async () => {
    const mockResponse = { status: 'ok' }
    ;(global.fetch as ReturnType<typeof vi.fn>).mockResolvedValueOnce({
      ok: true,
      json: () => Promise.resolve(mockResponse),
    })

    const result = await apiClient.healthCheck()
    
    expect(global.fetch).toHaveBeenCalledWith(
      expect.stringContaining('/health'),
      expect.any(Object)
    )
    expect(result).toEqual(mockResponse)
  })

  it('executeWorkflow calls correct endpoint', async () => {
    const mockResponse = { success: true, results: [], finalOutput: null, totalDuration: 100 }
    ;(global.fetch as ReturnType<typeof vi.fn>).mockResolvedValueOnce({
      ok: true,
      json: () => Promise.resolve(mockResponse),
    })

    const result = await apiClient.executeWorkflow({
      nodes: [],
      edges: [],
      input: 'test',
    })

    expect(global.fetch).toHaveBeenCalledWith(
      expect.stringContaining('/execute'),
      expect.objectContaining({ method: 'POST' })
    )
    expect(result).toEqual(mockResponse)
  })

  it('throws error on failed request', async () => {
    ;(global.fetch as ReturnType<typeof vi.fn>).mockResolvedValueOnce({
      ok: false,
      status: 500,
      json: () => Promise.resolve({ message: 'Server error' }),
    })

    await expect(apiClient.healthCheck()).rejects.toThrow('Server error')
  })
})
