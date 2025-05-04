import { defineConfig } from 'vite'
import { viteStaticCopy } from 'vite-plugin-static-copy'
import path from 'path'

export default defineConfig({
  base: '/vivoX200Ultra-webgi/',
  resolve: {
    alias: {
      '@': path.resolve(__dirname, 'src') 
    }
  },
  build: {
    outDir: 'docs',
    rollupOptions: {
      input: {
        main: path.resolve(__dirname, 'index.html'),
        app: path.resolve(__dirname, 'src/main.ts') 
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