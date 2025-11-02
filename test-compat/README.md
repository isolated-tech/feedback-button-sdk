# React Version Compatibility Testing

The @pullreque.st/button package uses Vitest for testing React compatibility across versions 16.8.0 through 19.x.

## Running Tests

```bash
# From packages/button directory

# Run all tests with current React version (19.x)
npm test

# Run tests in watch mode
npm run test:watch

# Run tests with UI
npm run test:ui

# Run tests with coverage
npm run test:coverage
```

## Test Coverage

The test suite verifies:
- ✅ Core SDK functions (submitFeedback, createFeedbackClient)
- ✅ React headless hooks (useFeedback, FeedbackProvider)
- ✅ Package exports and TypeScript types
- ✅ Component rendering and state management
- ✅ Loading states and error handling
- ✅ Compatibility with React 16.8+

## Automated CI Testing

Every push triggers GitHub Actions to run the full test suite against 8 different React versions:
- React 16.8.0 (minimum supported)
- React 16.14.0 (last of React 16)
- React 17.0.0
- React 17.0.2 (last of React 17)
- React 18.0.0
- React 18.3.1 (latest React 18)
- React 19.0.0
- React 19.2.0 (latest React 19)

See `.github/workflows/button-react-compat.yml` for the CI configuration.

## Manual Testing with Specific React Versions

To test locally with a specific React version:

```bash
# Install a specific React version
npm install --save-dev react@16.8.0 react-dom@16.8.0

# Run the tests
npm test

# Restore React 19 when done
npm install --save-dev react@^19.2.0 react-dom@^19.2.0
```
