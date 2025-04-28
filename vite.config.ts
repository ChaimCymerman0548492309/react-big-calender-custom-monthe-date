import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

export default defineConfig({
  plugins: [react()],
  server: {
    host: "0.0.0.0",  // Allows external access
    port:  5173,  // Uses environment variable or defaults to 5173
    strictPort: false,  // Allows using any available port if the default is taken
  },  assetsInclude: ['**/*.shard1'], // כולל קבצים בינאריים
  //  plugins: [react()],
  // assetsInclude: ['**/*.shard1'],
  optimizeDeps: {
    exclude: ['face-api.js']
  }

})
