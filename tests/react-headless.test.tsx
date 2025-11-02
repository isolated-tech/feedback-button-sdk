import React from 'react'
import { describe, it, expect, vi, beforeEach } from 'vitest'
import { render, screen, waitFor } from '@testing-library/react'
import { userEvent } from '@testing-library/user-event'
import { FeedbackProvider, useFeedback } from '../src/react/index'

// AIDEV-NOTE: React Compatibility Test
// Tests that React hooks work correctly across different React versions
// This test suite runs with React 16.8+, 17, 18, and 19 in CI

describe('React Headless Integration', () => {
  beforeEach(() => {
    global.fetch = vi.fn()
  })

  describe('FeedbackProvider', () => {
    it('should render children', () => {
      render(
        <FeedbackProvider projectKey="prj_pk_test">
          <div>Test Child</div>
        </FeedbackProvider>
      )

      expect(screen.getByText('Test Child')).toBeDefined()
    })

    it('should throw error when useFeedback is used outside provider', () => {
      // Suppress console.error for this test
      const spy = vi.spyOn(console, 'error').mockImplementation(() => {})

      const TestComponent = () => {
        try {
          useFeedback()
          return <div>Should not render</div>
        } catch (error) {
          return <div>Error: {(error as Error).message}</div>
        }
      }

      render(<TestComponent />)

      expect(
        screen.getByText(/useFeedback must be used within a FeedbackProvider/)
      ).toBeDefined()

      spy.mockRestore()
    })
  })

  describe('useFeedback hook', () => {
    const TestComponent = ({
      onSuccess,
      onError,
    }: {
      onSuccess?: () => void
      onError?: (error: Error) => void
    }) => {
      const { submit, isSubmitting, error, data } = useFeedback({
        onSuccess,
        onError,
      })
      const [message, setMessage] = React.useState('')

      return (
        <div>
          <input
            data-testid="message-input"
            value={message}
            onChange={(e) => setMessage(e.target.value)}
          />
          <button
            data-testid="submit-button"
            onClick={() => submit({ message })}
            disabled={isSubmitting}
          >
            {isSubmitting ? 'Submitting...' : 'Submit'}
          </button>
          {error && <div data-testid="error">{error.message}</div>}
          {data && <div data-testid="success">Success</div>}
        </div>
      )
    }

    it('should provide submit function and state', () => {
      render(
        <FeedbackProvider projectKey="prj_pk_test">
          <TestComponent />
        </FeedbackProvider>
      )

      expect(screen.getByTestId('message-input')).toBeDefined()
      expect(screen.getByTestId('submit-button')).toBeDefined()
      expect(screen.getByText('Submit')).toBeDefined()
    })

    it('should handle successful submission', async () => {
      const user = userEvent.setup()
      const mockResponse = { success: true, id: 'test-123' }
      const onSuccess = vi.fn()

      global.fetch = vi.fn().mockResolvedValueOnce({
        ok: true,
        json: async () => mockResponse,
      })

      render(
        <FeedbackProvider projectKey="prj_pk_test">
          <TestComponent onSuccess={onSuccess} />
        </FeedbackProvider>
      )

      const input = screen.getByTestId('message-input')
      const button = screen.getByTestId('submit-button')

      await user.type(input, 'Test feedback')
      await user.click(button)

      await waitFor(() => {
        expect(onSuccess).toHaveBeenCalled()
      })

      expect(screen.getByTestId('success')).toBeDefined()
    })

    it('should handle submission errors', async () => {
      const user = userEvent.setup()
      const onError = vi.fn()

      global.fetch = vi.fn().mockRejectedValueOnce(new Error('Network error'))

      render(
        <FeedbackProvider projectKey="prj_pk_test">
          <TestComponent onError={onError} />
        </FeedbackProvider>
      )

      const input = screen.getByTestId('message-input')
      const button = screen.getByTestId('submit-button')

      await user.type(input, 'Test feedback')
      await user.click(button)

      await waitFor(() => {
        expect(onError).toHaveBeenCalled()
      })

      expect(screen.getByTestId('error')).toBeDefined()
    })

    it('should show loading state during submission', async () => {
      const user = userEvent.setup()

      global.fetch = vi.fn().mockImplementation(
        () =>
          new Promise((resolve) =>
            setTimeout(
              () =>
                resolve({
                  ok: true,
                  json: async () => ({ success: true }),
                }),
              100
            )
          )
      )

      render(
        <FeedbackProvider projectKey="prj_pk_test">
          <TestComponent />
        </FeedbackProvider>
      )

      const input = screen.getByTestId('message-input')
      const button = screen.getByTestId('submit-button')

      await user.type(input, 'Test feedback')
      await user.click(button)

      // Should show loading state
      expect(screen.getByText('Submitting...')).toBeDefined()
      expect(button).toHaveProperty('disabled', true)

      // Wait for submission to complete
      await waitFor(() => {
        expect(screen.getByText('Submit')).toBeDefined()
      })
    })
  })

  describe('React version compatibility', () => {
    it('should work with current React version', () => {
      const ReactVersion = React.version

      render(
        <FeedbackProvider projectKey="prj_pk_test">
          <div data-testid="react-version">{ReactVersion}</div>
        </FeedbackProvider>
      )

      const versionElement = screen.getByTestId('react-version')
      expect(versionElement.textContent).toBeTruthy()

      // Parse major version
      const majorVersion = parseInt(ReactVersion.split('.')[0])

      // Should be at least React 16
      expect(majorVersion).toBeGreaterThanOrEqual(16)
    })
  })
})
