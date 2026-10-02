import { fileURLToPath } from 'node:url'
import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'
import tailwindcss from '@tailwindcss/vite'
import heroPreloadPlugin from './scripts/heroPreloadPlugin.js'

const generatedContent = fileURLToPath(new URL('./src/data/siteContent.generated.json', import.meta.url))

// https://vite.dev/config/
export default defineConfig({
  plugins: [vue(), tailwindcss(), heroPreloadPlugin({ file: generatedContent })],
})
