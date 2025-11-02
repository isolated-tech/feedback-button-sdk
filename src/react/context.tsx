import React, { createContext, useContext } from 'react'

// AIDEV-NOTE: Headless React Context for Feedback
// Provides project configuration to child components via context
// Users can access via useFeedback hook for complete UI control

export interface FeedbackContextValue {
    projectKey: string
    endpoint?: string
}

const FeedbackContext = createContext<FeedbackContextValue | null>(null)

export interface FeedbackProviderProps {
    projectKey: string
    endpoint?: string
    children: React.ReactNode
}

/**
 * FeedbackProvider - Headless context provider for feedback functionality
 *
 * Wrap your app or component tree to provide feedback capabilities.
 * Children can use useFeedback() hook to submit feedback with their own UI.
 *
 * @example
 * ```tsx
 * <FeedbackProvider projectKey="prj_pk_...">
 *   <MyCustomFeedbackButton />
 * </FeedbackProvider>
 * ```
 */
export function FeedbackProvider({
    projectKey,
    endpoint,
    children,
}: FeedbackProviderProps) {
    const value: FeedbackContextValue = {
        projectKey,
        endpoint,
    }

    return (
        <FeedbackContext.Provider value={value}>
            {children}
        </FeedbackContext.Provider>
    )
}

/**
 * Internal hook to access feedback context
 * @internal
 */
export function useFeedbackContext(): FeedbackContextValue {
    const context = useContext(FeedbackContext)

    if (!context) {
        throw new Error(
            'useFeedback must be used within a FeedbackProvider. ' +
                'Wrap your component tree with <FeedbackProvider projectKey="...">.'
        )
    }

    return context
}
