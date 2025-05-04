import { defineConfig } from 'vite'
import { viteStaticCopy } from 'vite-plugin-static-copy'
import path from 'path'

export default defineConfig({
  base: '/vivoX200Ultra-webgi/',
  resolve: {
    alias: {
      '@': path.resolve(__dirname, 'src') // 修正1: 使用 path.resolve
    }
  },
  build: {
    outDir: 'docs',
    rollupOptions: {
      input: {
        main: path.resolve(__dirname, 'index.html'),
        app: path.resolve(__dirname, 'src/main.ts') // 修正2: 修正拼写错误 intex.ts → index.ts
      },
      output: {
        // 修正3: 输出到 assets 目录而非 src
        entryFileNames: 'assets/[name].[hash].js',
        chunkFileNames: 'assets/[name].[hash].js',
        assetFileNames: 'assets/[name].[hash][extname]'
      }
    }
  },
  server: {
    port: 3000,
    strictPort: true,
    headers: {
      'Content-Type': 'text/javascript'
    }
  },
  plugins: [
    viteStaticCopy({
      targets: [
        {
          // 修正4: 使用正确的 glob 语法
          src: path.resolve(__dirname, 'assets/**/*').replace(/\\/g, '/'),
          dest: 'assets/'
        }
      ]
    })
  ]
})