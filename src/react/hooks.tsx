import { useState, useCallback } from 'react'
import { submitFeedback, FeedbackOptions, FeedbackResponse } from '../index'
import { useFeedbackContext } from './context'

// AIDEV-NOTE: Headless React Hook for Feedback Submission
// Provides stateful feedback submission with full UI control
// Users implement their own forms, buttons, modals, etc.

export interface SubmitOptions {
    message: string
    userEmail?: string
    pageUrl?: string
    meta?: Record<string, unknown>
    captchaToken?: string
    category?: 'loving_it' | 'report_bug' | 'missing_something' | 'other'
    assets?: Array<{
        kind: 'image' | 'video'
        url: string
        size: number
    }>
}

export interface UseFeedbackOptions {
    /**
     * Called before submission. Can transform or validate data.
     * Return modified data or throw an error to prevent submission.
     */
    onBeforeSubmit?: (
        data: SubmitOptions
    ) => SubmitOptions | Promise<SubmitOptions>

    /**
     * Called after successful submission
     */
    onSuccess?: (response: FeedbackResponse) => void

    /**
     * Called if submission fails
     */
    onError?: (error: Error) => void

    /**
     * Auto-capture current page URL (default: true)
     */
    autoCaptureUrl?: boolean
}

export interface UseFeedbackReturn {
    /**
     * Submit feedback with the provided options
     */
    submit: (options: SubmitOptions) => Promise<void>

    /**
     * Whether a submission is currently in progress
     */
    isSubmitting: boolean

    /**
     * Error from the last submission attempt (null if no error)
     */
    error: Error | null

    /**
     * Response data from the last successful submission (null if no success yet)
     */
    data: FeedbackResponse | null

    /**
     * Reset error and data state
     */
    reset: () => void
}

/**
 * useFeedback - Headless hook for feedback submission
 *
 * Provides stateful feedback submission with complete UI control.
 * Must be used within a FeedbackProvider.
 *
 * @example
 * ```tsx
 * function MyFeedbackForm() {
 *   const { submit, isSubmitting, error } = useFeedback({
 *     onSuccess: () => toast.success('Thanks for your feedback!'),
 *     onError: (err) => toast.error(err.message)
 *   })
 *
 *   const [message, setMessage] = useState('')
 *
 *   return (
 *     <form onSubmit={(e) => {
 *       e.preventDefault()
 *       submit({ message })
 *     }}>
 *       <textarea
 *         value={message}
 *         onChange={(e) => setMessage(e.target.value)}
 *         className="your-custom-styles"
 *       />
 *       <button disabled={isSubmitting}>
 *         {isSubmitting ? 'Sending...' : 'Send Feedback'}
 *       </button>
 *       {error && <p>{error.message}</p>}
 *     </form>
 *   )
 * }
 * ```
 */
export function useFeedback(options: UseFeedbackOptions = {}): UseFeedbackReturn {
    const { projectKey, endpoint } = useFeedbackContext()
    const {
        onBeforeSubmit,
        onSuccess,
        onError,
        autoCaptureUrl = true,
    } = options

    const [isSubmitting, setIsSubmitting] = useState(false)
    const [error, setError] = useState<Error | null>(null)
    const [data, setData] = useState<FeedbackResponse | null>(null)

    const submit = useCallback(
        async (submitOptions: SubmitOptions) => {
            setIsSubmitting(true)
            setError(null)

            try {
                // Prepare submission data
                let submissionData = { ...submitOptions }

                // Auto-capture page URL if enabled
                if (autoCaptureUrl && !submissionData.pageUrl) {
                    submissionData.pageUrl = window.location.href
                }

                // Allow transformation/validation before submit
                if (onBeforeSubmit) {
                    submissionData = await onBeforeSubmit(submissionData)
                }

                // Build final options
                const feedbackOptions: FeedbackOptions = {
                    projectKey,
                    endpoint,
                    ...submissionData,
                }

                // Submit feedback
                const response = await submitFeedback(feedbackOptions)

                setData(response)

                // Call success callback
                if (onSuccess) {
                    onSuccess(response)
                }
            } catch (err) {
                const error = err instanceof Error ? err : new Error(String(err))
                setError(error)

                // Call error callback
                if (onError) {
                    onError(error)
                }
            } finally {
                setIsSubmitting(false)
            }
        },
        [projectKey, endpoint, autoCaptureUrl, onBeforeSubmit, onSuccess, onError]
    )

    const reset = useCallback(() => {
        setError(null)
        setData(null)
    }, [])

    return {
        submit,
        isSubmitting,
        error,
        data,
        reset,
    }
}
