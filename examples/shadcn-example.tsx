/**
 * Example: Headless Feedback with ShadCN UI
 *
 * This example shows how to integrate the headless useFeedback hook
 * with ShadCN components for a polished, accessible UI.
 *
 * Prerequisites:
 * - Install ShadCN Dialog: npx shadcn-ui@latest add dialog
 * - Install ShadCN Button: npx shadcn-ui@latest add button
 * - Install ShadCN Textarea: npx shadcn-ui@latest add textarea
 * - Install ShadCN Input: npx shadcn-ui@latest add input
 */

import { useState } from 'react'
import { FeedbackProvider, useFeedback } from '@pullreque.st/button/react/headless'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog'
import { Button } from '@/components/ui/button'
import { Textarea } from '@/components/ui/textarea'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Alert, AlertDescription } from '@/components/ui/alert'
import { MessageSquare, Loader2, AlertCircle } from 'lucide-react'

function ShadcnFeedbackDialog() {
  const { submit, isSubmitting, error, reset } = useFeedback({
    onSuccess: () => {
      setOpen(false)
      setMessage('')
      setEmail('')
      // Optional: Use your toast library
      // toast.success('Thanks for your feedback!')
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
    })
  }

  const handleOpenChange = (newOpen: boolean) => {
    setOpen(newOpen)
    if (!newOpen) {
      reset()
    }
  }

  return (
    <Dialog open={open} onOpenChange={handleOpenChange}>
      <DialogTrigger asChild>
        <Button
          variant="outline"
          size="lg"
          className="fixed bottom-4 right-4 shadow-lg"
        >
          <MessageSquare className="mr-2 h-4 w-4" />
          Feedback
        </Button>
      </DialogTrigger>

      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Send Feedback</DialogTitle>
          <DialogDescription>
            Help us improve by sharing your thoughts, ideas, or reporting issues.
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-4">
          {/* Message Field */}
          <div className="space-y-2">
            <Label htmlFor="feedback-message">
              Message <span className="text-destructive">*</span>
            </Label>
            <Textarea
              id="feedback-message"
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              placeholder="Tell us what you think..."
              disabled={isSubmitting}
              className="min-h-32 resize-none"
              required
            />
          </div>

          {/* Email Field */}
          <div className="space-y-2">
            <Label htmlFor="feedback-email">Email (optional)</Label>
            <Input
              id="feedback-email"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="your@email.com"
              disabled={isSubmitting}
            />
          </div>

          {/* Error Alert */}
          {error && (
            <Alert variant="destructive">
              <AlertCircle className="h-4 w-4" />
              <AlertDescription>{error.message}</AlertDescription>
            </Alert>
          )}

          {/* Actions */}
          <div className="flex gap-2 justify-end">
            <Button
              type="button"
              variant="outline"
              onClick={() => setOpen(false)}
              disabled={isSubmitting}
            >
              Cancel
            </Button>
            <Button type="submit" disabled={isSubmitting || !message.trim()}>
              {isSubmitting ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Submitting...
                </>
              ) : (
                'Submit Feedback'
              )}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  )
}

// App wrapper with provider
export default function App() {
  return (
    <FeedbackProvider projectKey="prj_pk_YOUR_PROJECT_KEY">
      <ShadcnFeedbackDialog />
    </FeedbackProvider>
  )
}
