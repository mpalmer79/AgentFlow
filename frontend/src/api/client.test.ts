import { describe, it, expect, vi, beforeEach } from 'vitest'

// Mock fetch
const mockFetch = vi.fn()
global.fetch = mockFetch

// Import after mocking
import { apiClient } from './client'

describe('ApiClient', () => {
  beforeEach(() => {
    mockFetch.mockClear()
  })

  describe('healthCheck', () => {
    it('should return status ok', async () => {
      mockFetch.mockResolvedValueOnce({
        ok: true,
        json: async () => ({ status: 'ok' }),
      })

      const result = await apiClient.healthCheck()
      expect(result).toEqual({ status: 'ok' })
    })

    it('should throw on error response', async () => {
      mockFetch.mockResolvedValueOnce({
        ok: false,
        status: 500,
        json: async () => ({ message: 'Server error' }),
      })

      await expect(apiClient.healthCheck()).rejects.toThrow('Server error')
    })
  })

  describe('executeWorkflow', () => {
    it('should execute workflow and return results', async () => {
      const mockResponse = {
        success: true,
        results: [
          { nodeId: 'node-1', status: 'success', output: 'test', duration: 100 }
        ],
        finalOutput: 'test',
        totalDuration: 100,
      }

      mockFetch.mockResolvedValueOnce({
        ok: true,
        json: async () => mockResponse,
      })

      const result = await apiClient.executeWorkflow({
        nodes: [{ id: 'node-1', type: 'input', data: { label: 'Test' } }],
        edges: [],
        input: 'test input',
      })

      expect(result).toEqual(mockResponse)
      expect(mockFetch).toHaveBeenCalledWith(
        expect.stringContaining('/api/execute'),
        expect.objectContaining({
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
        })
      )
    })
  })
})
