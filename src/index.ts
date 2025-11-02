// AIDEV-NOTE: Headless SDK for Pullreque.st feedback button
// Provides core API client that can be wrapped by UI frameworks (React, Vue, etc.)

export interface FeedbackOptions {
    projectKey: string
    endpoint?: string
    message: string
    pageUrl?: string
    userEmail?: string
    meta?: Record<string, unknown>
    captchaToken?: string
    category?: 'loving_it' | 'report_bug' | 'missing_something' | 'other'
    assets?: Array<{
        kind: 'image' | 'video'
        url: string
        size: number
    }>
}

export interface FeedbackResponse {
    id: string
    status: 'received'
}

export interface FeedbackError {
    error: string
    details?: unknown
}

/**
 * Submit feedback to Pullreque.st API
 */
export async function submitFeedback(
    options: FeedbackOptions
): Promise<FeedbackResponse> {
    const endpoint = options.endpoint || 'https://pullreque.st/api/feedback'

    const response = await fetch(endpoint, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({
            projectKey: options.projectKey,
            message: options.message,
            pageUrl: options.pageUrl || window.location.href,
            userEmail: options.userEmail,
            meta: options.meta,
            captchaToken: options.captchaToken,
            category: options.category,
            assets: options.assets,
        }),
    })

    if (!response.ok) {
        const error: FeedbackError = await response.json()
        throw new Error(error.error || 'Failed to submit feedback')
    }

    return response.json()
}

/**
 * Headless feedback manager
 */
export class FeedbackClient {
    private projectKey: string
    private endpoint: string

    constructor(projectKey: string, endpoint?: string) {
        this.projectKey = projectKey
        this.endpoint = endpoint || 'https://pullreque.st/api/feedback'
    }

    async submit(options: Omit<FeedbackOptions, 'projectKey' | 'endpoint'>) {
        return submitFeedback({
            ...options,
            projectKey: this.projectKey,
            endpoint: this.endpoint,
        })
    }
}

/**
 * Create a feedback client instance
 */
export function createFeedbackClient(
    projectKey: string,
    endpoint?: string
): FeedbackClient {
    return new FeedbackClient(projectKey, endpoint)
}
