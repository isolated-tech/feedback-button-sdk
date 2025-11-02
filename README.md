# Pullreque.st Feedback Button

A lightweight, customizable feedback SDK for collecting user feedback on any website.

**Choose your integration style:**
- 🎨 **Headless** - Complete UI control with React hooks or vanilla JS
- 🚀 **Pre-styled Widget** - Ready-to-use feedback button with modal
- 📦 **CDN or NPM** - Deploy however you prefer

---

## Requirements

- **React Integration:** React 16.8 or later (hooks support required)
- **Vanilla JS/CDN:** No dependencies required

---

## Table of Contents

- [Headless React (Recommended)](#headless-react)
- [Headless CDN](#headless-cdn)
- [Pre-styled Widget (CDN)](#pre-styled-widget-cdn)
- [Pre-styled Widget (React)](#pre-styled-widget-react)
- [Examples](#examples)

---

## Headless React

**Full control over UI with React hooks. Use any styling: Tailwind, ShadCN, CSS Modules, etc.**

### Installation

```bash
npm install @pullreque.st/button
```

### Usage

```tsx
import { FeedbackProvider, useFeedback } from '@pullreque.st/button/react/headless'

function App() {
  return (
    <FeedbackProvider projectKey="prj_pk_YOUR_PROJECT_KEY">
      <MyCustomFeedbackButton />
    </FeedbackProvider>
  )
}

function MyCustomFeedbackButton() {
  const { submit, isSubmitting, error } = useFeedback({
    onSuccess: () => console.log('Feedback submitted!'),
    onError: (err) => console.error(err)
  })

  const [message, setMessage] = useState('')

  return (
    <form onSubmit={(e) => {
      e.preventDefault()
      submit({ message })
    }}>
      {/* Use your own components and styles */}
      <textarea
        value={message}
        onChange={(e) => setMessage(e.target.value)}
        className="your-custom-styles" // Tailwind, CSS, whatever you want
      />
      <button disabled={isSubmitting}>
        {isSubmitting ? 'Sending...' : 'Send Feedback'}
      </button>
      {error && <p>{error.message}</p>}
    </form>
  )
}
```

### API Reference

#### `<FeedbackProvider>`

Wrap your app to provide feedback context.

**Props:**
- `projectKey` (string, required) - Your project's public key
- `endpoint` (string, optional) - Custom API endpoint

#### `useFeedback(options?)`

Hook for submitting feedback with full state management.

**Options:**
- `onBeforeSubmit?: (data) => data | Promise<data>` - Transform/validate before submit
- `onSuccess?: (response) => void` - Called after successful submission
- `onError?: (error) => void` - Called on submission failure
- `autoCaptureUrl?: boolean` - Auto-capture page URL (default: true)

**Returns:**
- `submit: (options) => Promise<void>` - Submit feedback
  - `message: string` (required)
  - `userEmail?: string`
  - `pageUrl?: string`
  - `meta?: Record<string, unknown>`
  - `captchaToken?: string`
  - `assets?: Array<{kind, url, size}>`
- `isSubmitting: boolean` - Submission in progress
- `error: Error | null` - Last error (null if none)
- `data: FeedbackResponse | null` - Last successful response
- `reset: () => void` - Clear error and data

---

## Headless CDN

**Full control over UI with vanilla JavaScript. No framework needed.**

```html
<script src="https://pullreque.st/cdn/button.js"></script>

<!-- Your custom HTML -->
<button id="my-feedback-btn">Send Feedback</button>
<textarea id="feedback-message"></textarea>

<script>
  // Create headless client
  const client = PullrequeStButton.createFeedbackClient({
    projectKey: 'prj_pk_YOUR_PROJECT_KEY'
  })

  // Wire up your own UI
  document.getElementById('my-feedback-btn').addEventListener('click', async () => {
    const message = document.getElementById('feedback-message').value

    try {
      await client.submit({ message })
      alert('Feedback submitted!')
    } catch (error) {
      alert('Failed: ' + error.message)
    }
  })
</script>
```

### API Reference

#### `PullrequeStButton.createFeedbackClient(config)`

Creates a headless feedback client.

**Config:**
- `projectKey: string` (required)
- `endpoint?: string` (optional)

**Returns client with:**
- `submit(options): Promise<FeedbackResponse>`

#### `PullrequeStButton.submitFeedback(options)`

Direct function for one-off submissions (no client needed).

---

## Pre-styled Widget (CDN)

**Drop-in widget with built-in UI. Limited customization.**

```html
<script src="https://pullreque.st/cdn/button.js"></script>
<script>
  PullrequeStButton.init({
    projectKey: 'prj_pk_YOUR_PROJECT_KEY',
    position: 'bottom-right',        // 'bottom-right', 'bottom-left', 'top-right', 'top-left'
    buttonText: 'Feedback',
    primaryColor: '#000000'
  })
</script>
```

---

## Pre-styled Widget (React)

**Drop-in React component with built-in UI. Limited customization.**

```bash
npm install @pullreque.st/button
```

```tsx
import { FeedbackButton } from '@pullreque.st/button/react'

function App() {
  return (
    <FeedbackButton
      projectKey="prj_pk_YOUR_PROJECT_KEY"
      buttonText="Feedback"
      className="your-custom-class"
      onSuccess={() => console.log('Success!')}
      onError={(error) => console.error(error)}
    />
  )
}
```

---

## Examples

### Tailwind CSS + Headless React

See [`examples/tailwind-example.tsx`](./examples/tailwind-example.tsx) for a fully styled example with:
- Custom gradient button
- Animated modal
- Form validation
- Loading states
- Error handling

### ShadCN UI + Headless React

See [`examples/shadcn-example.tsx`](./examples/shadcn-example.tsx) for integration with ShadCN components:
- Dialog component
- Button, Textarea, Input
- Alert for errors
- Proper accessibility

### Vanilla JS + Custom HTML/CSS

See [`examples/cdn-headless.html`](./examples/cdn-headless.html) for a standalone HTML example with:
- Custom form styling
- No framework dependencies
- Progressive enhancement
- Loading states and error handling

---

## Migration from Widget to Headless

If you're currently using the pre-styled widget and want full control:

**Before (Widget):**
```tsx
<FeedbackButton projectKey="..." buttonText="Feedback" />
```

**After (Headless):**
```tsx
<FeedbackProvider projectKey="...">
  <YourCustomButton /> {/* Full control over UI */}
</FeedbackProvider>
```

The headless approach gives you:
- ✅ Complete styling control (Tailwind, ShadCN, etc.)
- ✅ Custom layouts and positioning
- ✅ Integration with your design system
- ✅ Smaller bundle (only core logic, no UI code)

---

## VitePress Integration

Add to `.vitepress/config.js` or `.vitepress/config.ts`:

```js
import { defineConfig } from 'vitepress'

export default defineConfig({
  // ... other config
  head: [
    [
      'script',
      { src: 'https://pullreque.st/cdn/button.js' }
    ],
    [
      'script',
      {},
      `PullrequeStButton.init({
        projectKey: 'prj_pk_YOUR_PROJECT_KEY'
      })`
    ]
  ]
})
```

## Development

### Build

```bash
npm run build
```

This creates:
- `dist/umd.js` - CDN/browser bundle
- `dist/index.js` - CommonJS module
- `dist/index.mjs` - ES module
- `dist/react.js` - React component

### Test

Run the test suite:

```bash
npm test              # Run all tests once
npm run test:watch    # Run tests in watch mode
npm run test:ui       # Run tests with UI
npm run test:coverage # Run tests with coverage report
```

**Test Suite:**
- Core SDK functionality (submitFeedback, createFeedbackClient)
- React headless hooks (useFeedback, FeedbackProvider)
- Package exports verification
- React component rendering
- Loading states and error handling

**React Compatibility Testing:** Every push to the repository triggers GitHub Actions to test the package with 8 different React versions (16.8.0, 16.14.0, 17.0.0, 17.0.2, 18.0.0, 18.3.1, 19.0.0, 19.2.0), ensuring compatibility across the entire React 16.8+ range.

### Upload to CDN

```bash
npm run upload-cdn
```

Requires `BLOB_READ_WRITE_TOKEN` in `.env.local`

### Test Locally

Open `test.html` in your browser to test the widget.

## Features

- ✅ Zero dependencies in browser bundle
- ✅ Automatic modal with form
- ✅ Screenshot support (coming soon)
- ✅ Email capture (optional)
- ✅ Fully customizable styling
- ✅ TypeScript support
- ✅ Works with any website or framework

## License

MIT
