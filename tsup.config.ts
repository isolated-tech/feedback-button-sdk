import { defineConfig } from 'tsup'

export default defineConfig({
  external: ['react', 'react-dom'],
  dts: true,
  format: ['cjs', 'esm'],
  clean: true,
})
