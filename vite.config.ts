import { copyFileSync } from 'node:fs'
import path from 'node:path'
import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// Project site: https://ruizdurazo.github.io/ui-design-library/
const pagesBase = '/ui-design-library/'

export default defineConfig(({ command, isPreview }) => ({
  base: command === 'build' || isPreview ? pagesBase : '/',
  plugins: [
    react(),
    {
      name: 'github-pages-spa-fallback',
      apply: 'build',
      closeBundle() {
        const dist = path.resolve(__dirname, 'dist')
        copyFileSync(path.join(dist, 'index.html'), path.join(dist, '404.html'))
      },
    },
  ],
  resolve: {
    alias: {
      '@': path.resolve(__dirname, 'src'),
    },
    // Keep TypeScript sources ahead of .js so a stray emit cannot split a module in two.
    extensions: ['.mjs', '.mts', '.ts', '.tsx', '.jsx', '.js', '.json'],
  },
  css: {
    modules: {
      localsConvention: 'camelCaseOnly',
    },
  },
  server: {
    port: 5178,
  },
}))
