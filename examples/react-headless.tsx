/**
 * Example: Pure Headless React Feedback (No Styles) - TypeScript
 *
 * This example shows how to use the useFeedback hook in React
 * with zero styling - perfect for applying your own CSS or
 * integrating with any design system.
 *
 * Features:
 * - No CSS frameworks or libraries required
 * - Complete control over markup and styling
 * - Minimal implementation showing core functionality
 * - Easy to customize and extend
 * - Full TypeScript support
 */

import { useState } from 'react'
import { FeedbackProvider, useFeedback } from '@pullreque.st/button/react/headless'

// Pure headless feedback component - bring your own styles
function HeadlessFeedbackForm() {
  const { submit, isSubmitting, error, reset } = useFeedback({
    onSuccess: () => {
      // Handle success
      setOpen(false)
      setMessage('')
      setEmail('')
      console.log('Feedback submitted successfully!')
    },
    onError: (err) => {
      // Handle error
      console.error('Failed to submit feedback:', err)
    },
  })

  const [open, setOpen] = useState(false)
  const [message, setMessage] = useState('')
  const [email, setEmail] = useState('')

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!message.trim()) return

    await submit({
      message,
      userEmail: email || undefined,
      meta: {
        source: 'headless-react',
        timestamp: new Date().toISOString(),
      },
    })
  }

  const handleCancel = () => {
    setOpen(false)
    setMessage('')
    setEmail('')
    reset()
  }

  return (
    <div>
      {/* Trigger Button */}
      <button onClick={() => setOpen(true)} type="button">
        Open Feedback
      </button>

      {/* Modal/Dialog */}
      {open && (
        <div>
          <div>
            <h2>Send Feedback</h2>
            <p>We'd love to hear your thoughts, suggestions, or issues.</p>
          </div>

          <form onSubmit={handleSubmit}>
            {/* Message Field */}
            <div>
              <label htmlFor="feedback-message">
                Message <span>*</span>
              </label>
              <textarea
                id="feedback-message"
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                placeholder="Tell us what you think..."
                disabled={isSubmitting}
                required
              />
            </div>

            {/* Email Field */}
            <div>
              <label htmlFor="feedback-email">Email (optional)</label>
              <input
                id="feedback-email"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="your@email.com"
                disabled={isSubmitting}
              />
            </div>

            {/* Error Display */}
            {error && (
              <div role="alert">
                <strong>Error:</strong> {error.message}
              </div>
            )}

            {/* Actions */}
            <div>
              <button type="button" onClick={handleCancel} disabled={isSubmitting}>
                Cancel
              </button>
              <button type="submit" disabled={isSubmitting || !message.trim()}>
                {isSubmitting ? 'Submitting...' : 'Submit Feedback'}
              </button>
            </div>
          </form>
        </div>
      )}
    </div>
  )
}

// Alternative: Inline feedback (always visible)
function InlineFeedbackForm() {
  const { submit, isSubmitting, error, reset } = useFeedback({
    onSuccess: () => {
      setMessage('')
      setEmail('')
      setSuccessMessage('Thank you for your feedback!')
      setTimeout(() => setSuccessMessage(''), 3000)
    },
  })

  const [message, setMessage] = useState('')
  const [email, setEmail] = useState('')
  const [successMessage, setSuccessMessage] = useState('')

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!message.trim()) return

    await submit({
      message,
      userEmail: email || undefined,
    })
  }

  return (
    <form onSubmit={handleSubmit}>
      <h3>Quick Feedback</h3>

      {successMessage && <div role="status">{successMessage}</div>}

      {error && (
        <div role="alert">
          Error: {error.message}
        </div>
      )}

      <div>
        <label htmlFor="inline-message">Message</label>
        <textarea
          id="inline-message"
          value={message}
          onChange={(e) => setMessage(e.target.value)}
          placeholder="Share your thoughts..."
          disabled={isSubmitting}
          required
        />
      </div>

      <div>
        <label htmlFor="inline-email">Email (optional)</label>
        <input
          id="inline-email"
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          placeholder="your@email.com"
          disabled={isSubmitting}
        />
      </div>

      <button type="submit" disabled={isSubmitting || !message.trim()}>
        {isSubmitting ? 'Sending...' : 'Send'}
      </button>
    </form>
  )
}

// Simple button-only implementation
function SimpleFeedbackButton() {
  const { submit, isSubmitting } = useFeedback({
    onSuccess: () => {
      alert('Thanks for your feedback!')
    },
  })

  const handleClick = async () => {
    const message = prompt('What feedback would you like to share?')
    if (!message) return

    await submit({ message })
  }

  return (
    <button onClick={handleClick} disabled={isSubmitting}>
      {isSubmitting ? 'Sending...' : 'Quick Feedback'}
    </button>
  )
}

// App wrapper with provider - choose your implementation
export default function App() {
  return (
    <FeedbackProvider projectKey="prj_pk_YOUR_PROJECT_KEY">
      {/* Option 1: Modal/Dialog style */}
      <HeadlessFeedbackForm />

      {/* Option 2: Inline form (uncomment to use) */}
      {/* <InlineFeedbackForm /> */}

      {/* Option 3: Simple button (uncomment to use) */}
      {/* <SimpleFeedbackButton /> */}
    </FeedbackProvider>
  )
}

/**
 * Usage Notes:
 *
 * 1. The useFeedback hook provides:
 *    - submit(data): Function to submit feedback
 *    - isSubmitting: Boolean indicating submission state
 *    - error: Error object if submission fails
 *    - reset(): Function to clear error state
 *
 * 2. Submit function accepts:
 *    - message (required): The feedback message
 *    - userEmail (optional): User's email
 *    - meta (optional): Additional metadata object
 *
 * 3. Style this however you want:
 *    - Add inline styles
 *    - Import your own CSS file
 *    - Use CSS modules
 *    - Apply any CSS framework classes
 *    - Use CSS-in-JS libraries
 *
 * 4. Examples of what you can build:
 *    - Modal dialogs
 *    - Slide-out panels
 *    - Inline forms
 *    - Fixed position buttons
 *    - Floating action buttons
 *    - Embedded forms
 */
