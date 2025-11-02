# Headless Feedback SDK

This document explains the headless implementation of the Pullreque.st feedback button.

## Overview

The feedback button SDK now supports **two modes**:

1. **Headless Mode** (new) - Complete UI control for developers
2. **Widget Mode** (existing) - Pre-styled, opinionated UI

## Requirements

- **React Headless Mode:** React 16.8 or later (hooks support required)
- **Vanilla JS Headless Mode:** No dependencies required

## Architecture

```
┌─────────────────────────────────────┐
│     User's Custom UI/Components     │
│  (Tailwind, ShadCN, CSS Modules...) │
└──────────────┬──────────────────────┘
               │
┌──────────────▼──────────────────────┐
│      Headless React Hooks           │
│  • FeedbackProvider (Context)       │
│  • useFeedback (Hook)               │
└──────────────┬──────────────────────┘
               │
┌──────────────▼──────────────────────┐
│      Core Headless SDK              │
│  • submitFeedback()                 │
│  • createFeedbackClient()           │
└──────────────┬──────────────────────┘
               │
┌──────────────▼──────────────────────┐
│      API (POST /api/feedback)       │
└─────────────────────────────────────┘
```

## Key Benefits

### For Developers

- ✅ **Complete styling control** - Use any CSS framework
- ✅ **Framework agnostic core** - Works everywhere
- ✅ **Type-safe** - Full TypeScript support
- ✅ **Smaller bundles** - No UI code when headless
- ✅ **Easy integration** - Hooks for React, imperative API for vanilla JS

### For End Users

- ✅ **Consistent UX** - Matches your app's design system
- ✅ **Better performance** - Less JavaScript when using headless
- ✅ **Accessibility** - You control ARIA attributes and keyboard navigation

## File Structure

```
packages/button/
├── src/
│   ├── index.ts              # Core headless SDK
│   ├── react/
│   │   ├── context.tsx       # FeedbackProvider
│   │   ├── hooks.tsx         # useFeedback hook
│   │   └── index.ts          # Exports
│   ├── react.tsx             # Pre-styled widget (backward compat)
│   ├── widget.ts             # Pre-styled widget (vanilla JS)
│   └── umd.ts                # CDN bundle (supports both modes)
├── examples/
│   ├── tailwind-example.tsx  # Tailwind + headless
│   ├── shadcn-example.tsx    # ShadCN + headless
│   └── cdn-headless.html     # Vanilla JS headless
└── README.md                 # Full documentation
```

## Usage Patterns

### React Headless (Recommended)

```tsx
import { FeedbackProvider, useFeedback } from '@pullreque.st/button/react/headless'

// 1. Wrap app with provider
<FeedbackProvider projectKey="prj_pk_...">
  <App />
</FeedbackProvider>

// 2. Use hook in any component
function MyComponent() {
  const { submit, isSubmitting, error } = useFeedback()

  return (
    <form onSubmit={(e) => {
      e.preventDefault()
      submit({ message: '...' })
    }}>
      {/* Your custom UI */}
    </form>
  )
}
```

### CDN Headless

```html
<script src="https://pullreque.st/cdn/button.js"></script>
<script>
  const client = PullrequeStButton.createFeedbackClient({
    projectKey: 'prj_pk_...'
  })

  await client.submit({ message: '...' })
</script>
```

### Widget Mode (Backward Compatible)

```html
<script src="https://pullreque.st/cdn/button.js"></script>
<script>
  PullrequeStButton.init({
    projectKey: 'prj_pk_...',
    position: 'bottom-right'
  })
</script>
```

## Package Exports

```json
{
  ".": "Core headless SDK",
  "./react": "Pre-styled React widget (old)",
  "./react/headless": "Headless React hooks (new)"
}
```

## API Reference

### FeedbackProvider

Context provider for headless React usage.

**Props:**
- `projectKey: string` - Required
- `endpoint?: string` - Optional custom endpoint
- `children: ReactNode` - Your app

### useFeedback(options?)

React hook for feedback submission with state management.

**Options:**
- `onBeforeSubmit?: (data) => data | Promise<data>`
- `onSuccess?: (response) => void`
- `onError?: (error) => void`
- `autoCaptureUrl?: boolean` (default: true)

**Returns:**
- `submit: (options) => Promise<void>`
- `isSubmitting: boolean`
- `error: Error | null`
- `data: FeedbackResponse | null`
- `reset: () => void`

### createFeedbackClient(config)

Factory for creating a headless client (vanilla JS or React).

**Config:**
- `projectKey: string` - Required
- `endpoint?: string` - Optional

**Returns:**
- `submit(options): Promise<FeedbackResponse>`

## Design Decisions

### Why Context + Hook Pattern?

1. **Centralized config** - ProjectKey defined once
2. **State management** - Built-in loading/error states
3. **React best practices** - Follows hooks conventions
4. **Flexibility** - Multiple components can submit feedback

### Why Separate `react/headless` Export?

1. **Backward compatibility** - Existing widget users unaffected
2. **Clear intent** - Explicit opt-in to headless mode
3. **Bundle optimization** - Tree-shaking removes unused code

### Why Keep Widget?

1. **Quick start** - Not everyone wants to build UI
2. **Demos** - Fast prototyping
3. **Migration path** - Users can upgrade incrementally

## Examples

See the `examples/` directory for:

1. **Tailwind CSS** - Custom gradient UI with animations
2. **ShadCN UI** - Integration with component library
3. **Vanilla HTML/CSS** - No framework, pure JavaScript

## Migration Guide

### From Widget to Headless (React)

**Before:**
```tsx
import { FeedbackButton } from '@pullreque.st/button/react'
<FeedbackButton projectKey="..." />
```

**After:**
```tsx
import { FeedbackProvider, useFeedback } from '@pullreque.st/button/react/headless'

<FeedbackProvider projectKey="...">
  <YourCustomButton />
</FeedbackProvider>
```

### From Direct API to Headless

**Before:**
```tsx
import { submitFeedback } from '@pullreque.st/button'

const handleSubmit = async () => {
  await submitFeedback({
    projectKey: '...',
    message: '...'
  })
}
```

**After:**
```tsx
import { useFeedback } from '@pullreque.st/button/react/headless'

const { submit } = useFeedback()
const handleSubmit = async () => {
  await submit({ message: '...' })
}
```

## Testing

The package builds successfully with TypeScript type checking:

```bash
npm run build
# ✅ ESM, CJS, UMD bundles generated
# ✅ TypeScript declarations (.d.ts) generated
# ✅ No type errors
```

## Next Steps (Future Enhancements)

- [ ] Asset upload helper for headless mode
- [ ] Validation hooks (`useFormValidation`)
- [ ] Vue/Svelte adapters
- [ ] Form state persistence
- [ ] Rate limit feedback to user
- [ ] Optimistic UI updates
- [ ] Retry logic for failed submissions

---

**Ready to use!** See the main [README.md](./README.md) for full documentation.
