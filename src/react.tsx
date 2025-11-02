import React, { useState, useRef, useEffect } from 'react'
import { submitFeedback } from './index'

// AIDEV-NOTE: React/ShadCN SDK variant
// Provides a ready-to-use feedback button with dialog
// This is a basic implementation - users should copy ShadCN components to their project

interface FeedbackButtonProps {
    projectKey: string
    endpoint?: string
    dialogTitle?: string
    buttonText?: string
    placeholder?: string
    className?: string
    onSuccess?: () => void
    onError?: (error: Error) => void
}

// Simple toast notification component
function Toast({ message, show, onHide }: { message: string; show: boolean; onHide: () => void }) {
    useEffect(() => {
        if (show) {
            const timer = setTimeout(() => {
                onHide()
            }, 3000)
            return () => clearTimeout(timer)
        }
    }, [show, onHide])

    return (
        <div
            style={{
                position: 'fixed',
                bottom: '24px',
                left: '50%',
                transform: show ? 'translateX(-50%) translateY(0)' : 'translateX(-50%) translateY(100px)',
                background: '#18181b',
                color: 'white',
                padding: '12px 20px',
                borderRadius: '8px',
                fontSize: '14px',
                fontWeight: 500,
                boxShadow: '0 10px 40px rgba(0, 0, 0, 0.3)',
                zIndex: 1000001,
                display: 'flex',
                alignItems: 'center',
                gap: '8px',
                opacity: show ? 1 : 0,
                transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
                pointerEvents: show ? 'auto' : 'none',
            }}
        >
            <div
                style={{
                    width: '20px',
                    height: '20px',
                    borderRadius: '50%',
                    background: '#22c55e',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    fontSize: '12px',
                    flexShrink: 0,
                }}
            >
                ✓
            </div>
            <span>{message}</span>
        </div>
    )
}

export function FeedbackButton({
    projectKey,
    endpoint,
    dialogTitle = 'Send Feedback',
    buttonText = 'Feedback',
    placeholder = 'Tell us what you think...',
    className = '',
    onSuccess,
    onError,
}: FeedbackButtonProps) {
    const [open, setOpen] = useState(false)
    const [message, setMessage] = useState('')
    const [submitting, setSubmitting] = useState(false)
    const [imageFile, setImageFile] = useState<File | null>(null)
    const [imagePreview, setImagePreview] = useState<string | null>(null)
    const [isDragging, setIsDragging] = useState(false)
    const [showToast, setShowToast] = useState(false)
    const fileInputRef = useRef<HTMLInputElement>(null)

    const handleImageChange = (file: File | null) => {
        if (!file) {
            setImageFile(null)
            setImagePreview(null)
            return
        }

        // Validate file type
        if (!file.type.startsWith('image/')) {
            if (onError) {
                onError(new Error('Please upload an image file'))
            }
            return
        }

        // Validate file size (max 3MB)
        const maxSize = 3 * 1024 * 1024
        if (file.size > maxSize) {
            if (onError) {
                onError(new Error('Image must be less than 3MB'))
            }
            return
        }

        setImageFile(file)

        // Create preview
        const reader = new FileReader()
        reader.onloadend = () => {
            setImagePreview(reader.result as string)
        }
        reader.readAsDataURL(file)
    }

    const handleDragOver = (e: React.DragEvent) => {
        e.preventDefault()
        setIsDragging(true)
    }

    const handleDragLeave = (e: React.DragEvent) => {
        e.preventDefault()
        setIsDragging(false)
    }

    const handleDrop = (e: React.DragEvent) => {
        e.preventDefault()
        setIsDragging(false)

        const file = e.dataTransfer.files[0]
        if (file) {
            handleImageChange(file)
        }
    }

    const handleRemoveImage = () => {
        setImageFile(null)
        setImagePreview(null)
        if (fileInputRef.current) {
            fileInputRef.current.value = ''
        }
    }

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault()

        if (!message.trim()) {
            return
        }

        setSubmitting(true)

        try {
            // Convert image to base64 data URL if present
            let assets
            if (imageFile && imagePreview) {
                assets = [
                    {
                        kind: 'image' as const,
                        url: imagePreview,
                        size: imageFile.size,
                    },
                ]
            }

            await submitFeedback({
                projectKey,
                endpoint,
                message,
                pageUrl: window.location.href,
                assets,
            })

            setMessage('')
            setImageFile(null)
            setImagePreview(null)
            setOpen(false)

            // Show toast notification
            setShowToast(true)

            if (onSuccess) {
                onSuccess()
            }
        } catch (error) {
            if (onError) {
                onError(error as Error)
            }
        } finally {
            setSubmitting(false)
        }
    }

    return (
        <>
            <button
                onClick={() => setOpen(true)}
                className={className || 'px-4 py-2 bg-primary text-primary-foreground rounded-md hover:bg-primary/90'}
            >
                {buttonText}
            </button>

            <Toast message="Thanks for your feedback!" show={showToast} onHide={() => setShowToast(false)} />

            {open && (
                <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50" onClick={() => setOpen(false)}>
                    <div className="bg-background p-6 rounded-lg shadow-lg w-full max-w-md" onClick={(e) => e.stopPropagation()}>
                        <div className="flex items-center justify-between mb-4">
                            <h2 className="text-lg font-semibold">{dialogTitle}</h2>
                            <button
                                onClick={() => setOpen(false)}
                                className="text-muted-foreground hover:text-foreground"
                            >
                                ✕
                            </button>
                        </div>

                        <form onSubmit={handleSubmit} className="space-y-4">
                            <textarea
                                value={message}
                                onChange={(e) => setMessage(e.target.value)}
                                placeholder={placeholder}
                                className="w-full min-h-32 px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-primary"
                                disabled={submitting}
                            />

                            <div
                                onDragOver={handleDragOver}
                                onDragLeave={handleDragLeave}
                                onDrop={handleDrop}
                                className={`relative border-2 border-dashed rounded-md p-4 transition-colors ${
                                    isDragging ? 'border-primary bg-primary/5' : 'border-gray-300'
                                } ${submitting ? 'opacity-50 pointer-events-none' : ''}`}
                            >
                                {imagePreview ? (
                                    <div className="relative">
                                        <img
                                            src={imagePreview}
                                            alt="Preview"
                                            className="max-h-48 w-full object-contain rounded"
                                        />
                                        <button
                                            type="button"
                                            onClick={handleRemoveImage}
                                            className="absolute top-2 right-2 w-8 h-8 bg-red-500 text-white rounded-full hover:bg-red-600 flex items-center justify-center"
                                            disabled={submitting}
                                        >
                                            ✕
                                        </button>
                                    </div>
                                ) : (
                                    <div className="flex flex-col items-center gap-2 text-center">
                                        <div className="w-12 h-12 rounded-full bg-gray-100 flex items-center justify-center">
                                            <svg className="w-6 h-6 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                                            </svg>
                                        </div>
                                        <div>
                                            <p className="text-sm font-medium">Drop an image here, or click to select</p>
                                            <p className="text-xs text-muted-foreground">PNG, JPG, GIF up to 3MB</p>
                                        </div>
                                        <button
                                            type="button"
                                            onClick={() => fileInputRef.current?.click()}
                                            className="px-3 py-1.5 border rounded-md text-sm hover:bg-accent"
                                            disabled={submitting}
                                        >
                                            Choose File
                                        </button>
                                        <input
                                            ref={fileInputRef}
                                            type="file"
                                            accept="image/*"
                                            className="hidden"
                                            onChange={(e) => {
                                                const file = e.target.files?.[0]
                                                if (file) {
                                                    handleImageChange(file)
                                                }
                                            }}
                                            disabled={submitting}
                                        />
                                    </div>
                                )}
                            </div>

                            <div className="flex gap-2 justify-end">
                                <button
                                    type="button"
                                    onClick={() => setOpen(false)}
                                    className="px-4 py-2 border rounded-md hover:bg-accent"
                                    disabled={submitting}
                                >
                                    Cancel
                                </button>
                                <button
                                    type="submit"
                                    className="px-4 py-2 bg-primary text-primary-foreground rounded-md hover:bg-primary/90"
                                    disabled={submitting || !message.trim()}
                                >
                                    {submitting ? 'Submitting...' : 'Submit'}
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}
        </>
    )
}

export type { FeedbackButtonProps }
