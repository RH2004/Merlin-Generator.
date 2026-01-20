import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import path from 'path'

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
  resolve: {
    alias: {
      '@parser': path.resolve(__dirname, './src/parser'),
      '@ir': path.resolve(__dirname, './src/ir'),
      '@renderer': path.resolve(__dirname, './src/renderer'),
      '@app': path.resolve(__dirname, './src/app'),
    },
  },
})
