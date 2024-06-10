import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react-swc'
import { nxViteTsPaths } from '@nx/vite/plugins/nx-tsconfig-paths.plugin'
import mkcert from 'vite-plugin-mkcert'
import tsconfigPaths from 'vite-tsconfig-paths'

export default defineConfig({
  cacheDir: '../../node_modules/.vite/frontend',

  server: {
    port: 4200,
    host: 'localhost',
  },

  preview: {
    port: 4300,
    host: 'localhost',
    https: true,
  },

  build: {
    sourcemap: true,
    cssMinify: true,
  },

  plugins: [tsconfigPaths(), react(), nxViteTsPaths(), mkcert()],
})
