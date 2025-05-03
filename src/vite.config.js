import {defineConfig, normalizePath} from 'vite'
import { viteStaticCopy } from 'vite-plugin-static-copy'
import path from 'path'

export default defineConfig({
    base: '/vivoX200Ultra-webgi/',
    resolve: {
        alias: {
          '@': resolve(__dirname, 'src')
        }
      },
      build: {
        outDir: 'docs',
        rollupOptions: {
          input: {
            main: resolve(__dirname, 'index.html'),
            app: resolve(__dirname, 'src/intex.ts')
          },
          output: {
            entryFileNames: 'src/[name].[hash].js',
            chunkFileNames: 'src/[name].[hash].js',
            assetFileNames: 'assets/[name].[hash][extname]'
          }
        }
      },
      server: {
        port: 3000,
        strictPort: true,
        headers: {
          'Content-Type': 'text/javascript' // 强制TS文件MIME类型
        }
      },
    plugins: [
        viteStaticCopy({
            targets: [
                {
                    src: normalizePath(path.resolve(__dirname, './assets') + '/[!.]*'), // 1️⃣
                    dest: normalizePath('./assets'), // 2️⃣
                },
            ],
        }),
    ]
})
