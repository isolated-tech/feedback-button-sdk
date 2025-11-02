// AIDEV-NOTE: UMD build for CDN usage
// Provides a global PullrequeStButton object for browser usage
// Supports both headless API (createFeedbackClient, submitFeedback) and opinionated widget (init)

import { submitFeedback, FeedbackClient, createFeedbackClient } from './index'
import { init, FeedbackWidget } from './widget'

declare global {
    interface Window {
        PullrequeStButton: {
            init: typeof init
            submitFeedback: typeof submitFeedback
            createFeedbackClient: typeof createFeedbackClient
            FeedbackClient: typeof FeedbackClient
            FeedbackWidget: typeof FeedbackWidget
        }
    }
}

if (typeof window !== 'undefined') {
    window.PullrequeStButton = {
        init,
        submitFeedback,
        createFeedbackClient,
        FeedbackClient,
        FeedbackWidget,
    }
}

export { init, submitFeedback, createFeedbackClient, FeedbackClient, FeedbackWidget }
