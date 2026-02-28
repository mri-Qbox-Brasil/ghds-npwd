import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import path from 'path';
// @ts-ignore
import { fileURLToPath, URL } from 'node:url';
import topLevelAwait from 'vite-plugin-top-level-await';
import federation from '@originjs/vite-plugin-federation';

const __dirname = fileURLToPath(new URL('.', import.meta.url));

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [
    react(),
    federation({
      remotes: { dummyRemote: 'dummyRemote.js' },
      shared: ['react', 'react-dom', 'react-router-dom', 'fivem-nui-react-lib'],
      exposes: {
        './Input': './src/ui/components/Input.tsx',
      },
    }),
    topLevelAwait({
      // The export name of top-level await promise for each chunk module
      promiseExportName: '__tla',
      // The function to generate import names of top-level await promise in each chunk module
      promiseImportName: (i) => `__tla_${i}`,
    }),
  ],
  server: {
    port: 3000,
  },
  resolve: {
    alias: {
      '@os': path.resolve(__dirname, './src/os/'),
      '@ui': path.resolve(__dirname, './src/ui/'),
      '@common': path.resolve(__dirname, './src/common/'),
      '@utils': path.resolve(__dirname, './src/utils/'),
      '@apps': path.resolve(__dirname, './src/apps/'),
      '@typings': path.resolve(__dirname, '../../typings/'),
      '@shared': path.resolve(__dirname, '../../shared'),
    },
  },
  define: {
    'process.env': {},
  },
  base: './',
  build: {
    emptyOutDir: true,
    outDir: '../../../html',
    rollupOptions: {
      output: {
        entryFileNames: 'assets/js/script.js',
        chunkFileNames: 'assets/js/[name].js',
        assetFileNames: (assetInfo: any) => {
          let extType = assetInfo.name.split('.').at(-1);
          if (/png|jpe?g|svg|gif|tiff|bmp|ico|webp/i.test(extType)) {
            return `media/[name].[ext]`;
          }
          if (extType === 'css') {
            return 'assets/css/styles.css';
          }
          return `assets/${extType}/[name].[ext]`;
        },
      },
      input: {
        index: path.resolve(__dirname, 'index.html'),
      },
    },
  },
});
