// AIDEV-NOTE: Headless React SDK Exports
// Provides FeedbackProvider context and useFeedback hook for complete UI control
// Users can build their own feedback forms with any styling approach

export { FeedbackProvider } from './context'
export type { FeedbackProviderProps, FeedbackContextValue } from './context'

export { useFeedback } from './hooks'
export type {
    UseFeedbackOptions,
    UseFeedbackReturn,
    SubmitOptions,
} from './hooks'
