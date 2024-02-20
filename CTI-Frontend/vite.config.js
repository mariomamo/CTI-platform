import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import {nodePolyfills} from "vite-plugin-node-polyfills";

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [
    react(),
    nodePolyfills()
  ],
  optimizeDeps: {
    exclude: ['js-big-decimal']
  },
  esbuild: {
    supported: {
      'top-level-await': true //browsers can handle top-level-await features
    },
  },
  build: {
    rollupOptions: {
      output: {
        assetFileNames: (assetInfo) => {
          let extType = assetInfo.name.split('.').at(1);
          if (/png|jpe?g|svg|gif|tiff|bmp|ico/i.test(extType)) {
            extType = 'img';
          }
          return `CTI/assets/${extType}/[name]-[hash][extname]`;
        },
        chunkFileNames: 'CTI/assets/js/[name]-[hash].js',
        entryFileNames: 'CTI/assets/js/[name]-[hash].js',
      },
    },
  }
})
