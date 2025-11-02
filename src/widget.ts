// AIDEV-NOTE: Feedback widget for browser usage
// Creates a floating button and modal for collecting user feedback

import { submitFeedback } from './index'

export interface WidgetOptions {
    projectKey: string
    position?: 'bottom-right' | 'bottom-left' | 'top-right' | 'top-left'
    buttonText?: string
    primaryColor?: string
    endpoint?: string
}

export class FeedbackWidget {
    private projectKey: string
    private position: string
    private buttonText: string
    private primaryColor: string
    private endpoint?: string
    private button: HTMLElement | null = null
    private modal: HTMLElement | null = null

    constructor(options: WidgetOptions) {
        this.projectKey = options.projectKey
        this.position = options.position || 'bottom-right'
        this.buttonText = options.buttonText || 'Feedback'
        this.primaryColor = options.primaryColor || '#000000'
        this.endpoint = options.endpoint
        this.init()
    }

    private init() {
        this.injectStyles()
        this.createButton()
        this.createModal()
    }

    private injectStyles() {
        const style = document.createElement('style')
        style.textContent = `
            .pullrequest-feedback-button {
                position: fixed;
                z-index: 999999;
                padding: 12px 24px;
                background: ${this.primaryColor};
                color: white;
                border: none;
                border-radius: 24px;
                font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', 'Roboto', sans-serif;
                font-size: 14px;
                font-weight: 500;
                cursor: pointer;
                box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
                transition: transform 0.2s, box-shadow 0.2s;
            }
            .pullrequest-feedback-button:hover {
                transform: translateY(-2px);
                box-shadow: 0 6px 16px rgba(0, 0, 0, 0.2);
            }
            .pullrequest-feedback-button.bottom-right {
                bottom: 24px;
                right: 24px;
            }
            .pullrequest-feedback-button.bottom-left {
                bottom: 24px;
                left: 24px;
            }
            .pullrequest-feedback-button.top-right {
                top: 24px;
                right: 24px;
            }
            .pullrequest-feedback-button.top-left {
                top: 24px;
                left: 24px;
            }
            .pullrequest-modal-overlay {
                position: fixed;
                top: 0;
                left: 0;
                right: 0;
                bottom: 0;
                background: rgba(0, 0, 0, 0.5);
                z-index: 1000000;
                display: none;
                align-items: center;
                justify-content: center;
                animation: fadeIn 0.2s;
            }
            .pullrequest-modal-overlay.open {
                display: flex;
            }
            @keyframes fadeIn {
                from { opacity: 0; }
                to { opacity: 1; }
            }
            .pullrequest-modal {
                background: white;
                border-radius: 12px;
                padding: 24px;
                max-width: 500px;
                width: 90%;
                max-height: 90vh;
                overflow-y: auto;
                box-shadow: 0 20px 60px rgba(0, 0, 0, 0.3);
                animation: slideUp 0.3s;
            }
            @keyframes slideUp {
                from {
                    transform: translateY(20px);
                    opacity: 0;
                }
                to {
                    transform: translateY(0);
                    opacity: 1;
                }
            }
            .pullrequest-modal-header {
                display: flex;
                justify-content: space-between;
                align-items: center;
                margin-bottom: 20px;
            }
            .pullrequest-modal-title {
                font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', 'Roboto', sans-serif;
                font-size: 20px;
                font-weight: 600;
                margin: 0;
                color: #1a1a1a;
            }
            .pullrequest-modal-close {
                background: none;
                border: none;
                font-size: 24px;
                cursor: pointer;
                color: #666;
                padding: 0;
                width: 32px;
                height: 32px;
                display: flex;
                align-items: center;
                justify-content: center;
                border-radius: 4px;
                transition: background 0.2s;
            }
            .pullrequest-modal-close:hover {
                background: #f0f0f0;
            }
            .pullrequest-form-group {
                margin-bottom: 16px;
            }
            .pullrequest-form-label {
                display: block;
                font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', 'Roboto', sans-serif;
                font-size: 14px;
                font-weight: 500;
                margin-bottom: 6px;
                color: #333;
            }
            .pullrequest-form-input,
            .pullrequest-form-textarea {
                width: 100%;
                padding: 10px 12px;
                border: 1px solid #ddd;
                border-radius: 6px;
                font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', 'Roboto', sans-serif;
                font-size: 14px;
                box-sizing: border-box;
                transition: border-color 0.2s;
            }
            .pullrequest-form-input:focus,
            .pullrequest-form-textarea:focus {
                outline: none;
                border-color: ${this.primaryColor};
            }
            .pullrequest-form-textarea {
                resize: vertical;
                min-height: 100px;
            }
            .pullrequest-form-actions {
                display: flex;
                gap: 12px;
                margin-top: 20px;
            }
            .pullrequest-btn {
                padding: 10px 20px;
                border-radius: 6px;
                font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', 'Roboto', sans-serif;
                font-size: 14px;
                font-weight: 500;
                cursor: pointer;
                border: none;
                transition: opacity 0.2s;
            }
            .pullrequest-btn:disabled {
                opacity: 0.5;
                cursor: not-allowed;
            }
            .pullrequest-btn-primary {
                background: ${this.primaryColor};
                color: white;
                flex: 1;
            }
            .pullrequest-btn-primary:hover:not(:disabled) {
                opacity: 0.9;
            }
            .pullrequest-btn-secondary {
                background: #f0f0f0;
                color: #333;
            }
            .pullrequest-btn-secondary:hover:not(:disabled) {
                background: #e0e0e0;
            }
            .pullrequest-success-message {
                text-align: center;
                padding: 40px 20px;
            }
            .pullrequest-success-icon {
                font-size: 48px;
                margin-bottom: 16px;
            }
            .pullrequest-success-title {
                font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', 'Roboto', sans-serif;
                font-size: 18px;
                font-weight: 600;
                margin: 0 0 8px 0;
                color: #1a1a1a;
            }
            .pullrequest-success-text {
                font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', 'Roboto', sans-serif;
                font-size: 14px;
                color: #666;
                margin: 0;
            }
            .pullrequest-error-message {
                background: #fee;
                border: 1px solid #fcc;
                border-radius: 6px;
                padding: 12px;
                margin-bottom: 16px;
                font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', 'Roboto', sans-serif;
                font-size: 14px;
                color: #c00;
            }
            .pullrequest-toast {
                position: fixed;
                bottom: 24px;
                left: 50%;
                transform: translateX(-50%) translateY(100px);
                background: #18181b;
                color: white;
                padding: 12px 20px;
                border-radius: 8px;
                font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', 'Roboto', sans-serif;
                font-size: 14px;
                font-weight: 500;
                box-shadow: 0 10px 40px rgba(0, 0, 0, 0.3);
                z-index: 1000001;
                display: flex;
                align-items: center;
                gap: 8px;
                opacity: 0;
                transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
                pointer-events: none;
            }
            .pullrequest-toast.show {
                opacity: 1;
                transform: translateX(-50%) translateY(0);
                pointer-events: auto;
            }
            .pullrequest-toast-icon {
                width: 20px;
                height: 20px;
                border-radius: 50%;
                background: #22c55e;
                display: flex;
                align-items: center;
                justify-content: center;
                font-size: 12px;
                flex-shrink: 0;
            }
        `
        document.head.appendChild(style)
    }

    private createButton() {
        this.button = document.createElement('button')
        this.button.className = `pullrequest-feedback-button ${this.position}`
        this.button.textContent = this.buttonText
        this.button.addEventListener('click', () => this.openModal())
        document.body.appendChild(this.button)
    }

    private createModal() {
        const overlay = document.createElement('div')
        overlay.className = 'pullrequest-modal-overlay'
        overlay.addEventListener('click', (e) => {
            if (e.target === overlay) {
                this.closeModal()
            }
        })

        const modal = document.createElement('div')
        modal.className = 'pullrequest-modal'

        modal.innerHTML = `
            <div class="pullrequest-modal-header">
                <h2 class="pullrequest-modal-title">Send Feedback</h2>
                <button class="pullrequest-modal-close" aria-label="Close">&times;</button>
            </div>
            <div class="pullrequest-modal-content">
                <form class="pullrequest-feedback-form">
                    <div class="pullrequest-form-group">
                        <label class="pullrequest-form-label" for="pullrequest-message">
                            Message <span style="color: #999;">(required)</span>
                        </label>
                        <textarea
                            id="pullrequest-message"
                            class="pullrequest-form-textarea"
                            placeholder="Tell us what's on your mind..."
                            required
                        ></textarea>
                    </div>
                    <div class="pullrequest-form-group">
                        <label class="pullrequest-form-label" for="pullrequest-email">
                            Email <span style="color: #999;">(optional)</span>
                        </label>
                        <input
                            type="email"
                            id="pullrequest-email"
                            class="pullrequest-form-input"
                            placeholder="your@email.com"
                        />
                    </div>
                    <div class="pullrequest-form-actions">
                        <button type="button" class="pullrequest-btn pullrequest-btn-secondary pullrequest-cancel">
                            Cancel
                        </button>
                        <button type="submit" class="pullrequest-btn pullrequest-btn-primary pullrequest-submit">
                            Send Feedback
                        </button>
                    </div>
                </form>
            </div>
        `

        overlay.appendChild(modal)
        document.body.appendChild(overlay)
        this.modal = overlay

        // Event listeners
        const closeBtn = modal.querySelector('.pullrequest-modal-close')
        const cancelBtn = modal.querySelector('.pullrequest-cancel')
        const form = modal.querySelector('.pullrequest-feedback-form') as HTMLFormElement

        closeBtn?.addEventListener('click', () => this.closeModal())
        cancelBtn?.addEventListener('click', () => this.closeModal())
        form?.addEventListener('submit', (e) => this.handleSubmit(e))
    }

    private openModal() {
        this.modal?.classList.add('open')
    }

    private closeModal() {
        this.modal?.classList.remove('open')
        this.resetForm()
    }

    private resetForm() {
        const form = this.modal?.querySelector('.pullrequest-feedback-form') as HTMLFormElement
        form?.reset()
        const errorMsg = this.modal?.querySelector('.pullrequest-error-message')
        errorMsg?.remove()
    }

    private async handleSubmit(e: Event) {
        e.preventDefault()

        const form = e.target as HTMLFormElement
        const messageInput = form.querySelector('#pullrequest-message') as HTMLTextAreaElement
        const emailInput = form.querySelector('#pullrequest-email') as HTMLInputElement
        const submitBtn = form.querySelector('.pullrequest-submit') as HTMLButtonElement

        const message = messageInput.value.trim()
        const email = emailInput.value.trim()

        if (!message) {
            this.showError('Please enter a message')
            return
        }

        // Disable submit button
        submitBtn.disabled = true
        submitBtn.textContent = 'Sending...'

        try {
            await submitFeedback({
                projectKey: this.projectKey,
                message,
                userEmail: email || undefined,
                endpoint: this.endpoint,
            })

            this.showSuccess()
        } catch (error) {
            this.showError(error instanceof Error ? error.message : 'Failed to send feedback')
            submitBtn.disabled = false
            submitBtn.textContent = 'Send Feedback'
        }
    }

    private showError(message: string) {
        // Remove existing error
        const existingError = this.modal?.querySelector('.pullrequest-error-message')
        existingError?.remove()

        const errorDiv = document.createElement('div')
        errorDiv.className = 'pullrequest-error-message'
        errorDiv.textContent = message

        const content = this.modal?.querySelector('.pullrequest-modal-content')
        content?.insertBefore(errorDiv, content.firstChild)
    }

    private showToast(message: string) {
        // Create toast element
        const toast = document.createElement('div')
        toast.className = 'pullrequest-toast'
        toast.innerHTML = `
            <div class="pullrequest-toast-icon">✓</div>
            <span>${message}</span>
        `

        document.body.appendChild(toast)

        // Trigger animation
        setTimeout(() => {
            toast.classList.add('show')
        }, 10)

        // Remove after 3 seconds
        setTimeout(() => {
            toast.classList.remove('show')
            setTimeout(() => {
                toast.remove()
            }, 300)
        }, 3000)
    }

    private showSuccess() {
        const content = this.modal?.querySelector('.pullrequest-modal-content')
        if (!content) return

        content.innerHTML = `
            <div class="pullrequest-success-message">
                <div class="pullrequest-success-icon">✓</div>
                <h3 class="pullrequest-success-title">Thank you!</h3>
                <p class="pullrequest-success-text">Your feedback has been sent successfully.</p>
            </div>
        `

        // Show toast notification
        this.showToast('Thanks for your feedback!')

        setTimeout(() => {
            this.closeModal()
            // Reset content for next time
            setTimeout(() => {
                this.modal?.remove()
                this.createModal()
            }, 300)
        }, 2000)
    }

    public destroy() {
        this.button?.remove()
        this.modal?.remove()
    }
}

export function init(options: WidgetOptions): FeedbackWidget {
    return new FeedbackWidget(options)
}
