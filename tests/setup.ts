// Test setup file for Vitest
import { beforeAll, afterEach } from 'vitest'
import { cleanup } from '@testing-library/react'

// Cleanup after each test
afterEach(() => {
  cleanup()
})

// Mock window.location if needed
beforeAll(() => {
  if (typeof window !== 'undefined') {
    Object.defineProperty(window, 'location', {
      value: {
        href: 'http://localhost:3000/test',
        origin: 'http://localhost:3000',
      },
      writable: true,
    })
  }
})
