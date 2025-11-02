import { describe, it, expect, vi, beforeEach } from 'vitest'
import { submitFeedback, createFeedbackClient } from '../src/index'

describe('Core SDK', () => {
  beforeEach(() => {
    // Reset fetch mock before each test
    global.fetch = vi.fn()
  })

  describe('submitFeedback', () => {
    it('should export submitFeedback function', () => {
      expect(submitFeedback).toBeDefined()
      expect(typeof submitFeedback).toBe('function')
    })

    it('should call API with correct parameters', async () => {
      const mockResponse = { success: true, id: 'test-123' }
      global.fetch = vi.fn().mockResolvedValueOnce({
        ok: true,
        json: async () => mockResponse,
      })

      const result = await submitFeedback({
        projectKey: 'prj_pk_test',
        message: 'Test feedback',
        endpoint: 'https://test.com/api/feedback',
      })

      expect(global.fetch).toHaveBeenCalledWith(
        'https://test.com/api/feedback',
        expect.objectContaining({
          method: 'POST',
          headers: expect.objectContaining({
            'Content-Type': 'application/json',
          }),
          body: expect.stringContaining('Test feedback'),
        })
      )

      expect(result).toEqual(mockResponse)
    })

    it('should handle errors gracefully', async () => {
      global.fetch = vi.fn().mockRejectedValueOnce(new Error('Network error'))

      await expect(
        submitFeedback({
          projectKey: 'prj_pk_test',
          message: 'Test feedback',
        })
      ).rejects.toThrow()
    })

    it('should use default endpoint if not provided', async () => {
      global.fetch = vi.fn().mockResolvedValueOnce({
        ok: true,
        json: async () => ({ success: true }),
      })

      await submitFeedback({
        projectKey: 'prj_pk_test',
        message: 'Test feedback',
      })

      expect(global.fetch).toHaveBeenCalledWith(
        expect.stringContaining('/api/feedback'),
        expect.any(Object)
      )
    })
  })

  describe('createFeedbackClient', () => {
    it('should export createFeedbackClient function', () => {
      expect(createFeedbackClient).toBeDefined()
      expect(typeof createFeedbackClient).toBe('function')
    })

    it('should create a client with bound projectKey', async () => {
      global.fetch = vi.fn().mockResolvedValueOnce({
        ok: true,
        json: async () => ({ success: true }),
      })

      const client = createFeedbackClient({
        projectKey: 'prj_pk_test',
        endpoint: 'https://test.com/api/feedback',
      })

      expect(client).toBeDefined()
      expect(typeof client.submit).toBe('function')

      await client.submit({ message: 'Test' })

      expect(global.fetch).toHaveBeenCalled()
    })
  })
})
