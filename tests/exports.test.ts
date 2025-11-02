import { describe, it, expect } from 'vitest'

describe('Package Exports', () => {
  describe('Core exports', () => {
    it('should export core SDK functions', async () => {
      const core = await import('../src/index')

      expect(core.submitFeedback).toBeDefined()
      expect(core.createFeedbackClient).toBeDefined()
      expect(typeof core.submitFeedback).toBe('function')
      expect(typeof core.createFeedbackClient).toBe('function')
    })

    it('should export TypeScript types', async () => {
      // Type imports should not throw
      const types = await import('../src/index')

      // We can't directly test types, but we can verify the module loads
      expect(types).toBeDefined()
    })
  })

  describe('React headless exports', () => {
    it('should export React headless components and hooks', async () => {
      const reactHeadless = await import('../src/react/index')

      expect(reactHeadless.FeedbackProvider).toBeDefined()
      expect(reactHeadless.useFeedback).toBeDefined()
      expect(typeof reactHeadless.FeedbackProvider).toBe('function')
      expect(typeof reactHeadless.useFeedback).toBe('function')
    })
  })

  describe('React component exports', () => {
    it('should export React component', async () => {
      const reactComponent = await import('../src/react')

      expect(reactComponent.FeedbackButton).toBeDefined()
      expect(typeof reactComponent.FeedbackButton).toBe('function')
    })
  })

  describe('Widget exports', () => {
    it('should export widget class', async () => {
      const widget = await import('../src/widget')

      expect(widget.FeedbackWidget).toBeDefined()
      expect(typeof widget.FeedbackWidget).toBe('function')
    })
  })
})
