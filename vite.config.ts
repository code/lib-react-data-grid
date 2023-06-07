import linaria from '@linaria/rollup';
import react from '@vitejs/plugin-react';
import postcssNested from 'postcss-nested';
import { defineConfig } from 'vite';

const isCI = process.env.CI === 'true';
const isTest = process.env.NODE_ENV === 'test';

export default defineConfig({
  root: 'website',
  base: isCI ? '/react-data-grid/' : '/',
  build: {
    outDir: '../dist',
    emptyOutDir: true,
    sourcemap: true
  },
  resolve: {
    alias: {
      lodash: isTest ? 'lodash' : 'lodash-es',
      'lodash-es': isTest ? 'lodash' : 'lodash-es'
    }
  },
  plugins: [
    !isTest &&
      react({
        babel: {
          babelrc: false,
          configFile: false,
          plugins: [['optimize-clsx', { functionNames: ['getCellClassname'] }]]
        }
      }),
    linaria({ preprocessor: 'none' })
  ],
  css: {
    postcss: {
      plugins: [postcssNested]
    }
  },
  server: {
    open: true
  },
  test: {
    root: '.',
    globals: true,
    coverage: {
      provider: 'v8',
      enabled: isCI,
      include: ['src/**/*.{ts,tsx}', '!src/types.ts'],
      all: true,
      reporter: ['text', 'json']
    },
    useAtomics: true,
    setupFiles: ['test/setup.ts'],
    browser: {
      enabled: true,
      name: 'chromium',
      provider: 'playwright'
    },
    restoreMocks: true,
    sequence: {
      shuffle: true
    }
  }
});
