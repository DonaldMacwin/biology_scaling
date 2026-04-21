import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vite.dev/config/
export default defineConfig(({ command }) => ({
  // Use the deployed public path only for production builds.
  base: command === 'build' ? '/biology_scaling/dist/' : '/',
  plugins: [react()],
  server: {
    proxy: {
      '/__asset_proxy__': {
        target: 'https://cf268321.cloudfree.jp',
        changeOrigin: true,
        rewrite: (path) => path.replace(/^\/__asset_proxy__/, ''),
      },
    },
  },
  build: {
    // disable css code-splitting so all css goes into one file
    cssCodeSplit: false,
    rollupOptions: {
      output: {
        // produce a single JS file named biology_scaling.js
        entryFileNames: 'biology_scaling.js',
        // make chunks (if any) use the same filename to avoid hashed names
        chunkFileNames: 'biology_scaling.js',
        // force inline dynamic imports to keep a single bundle when possible
        inlineDynamicImports: true,
        // produce a single CSS asset named biology_scaling.css
        assetFileNames: (assetInfo: any) => {
          if (assetInfo.name && assetInfo.name.endsWith('.css')) {
            return 'biology_scaling.css'
          }
          // default for other assets
          const ext = assetInfo.name?.split('.').pop() || '[ext]'
          return `assets/[name].${ext}`
        },
      },
    },
  },
}))
