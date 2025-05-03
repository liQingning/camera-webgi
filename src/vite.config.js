import {defineConfig, normalizePath} from 'vite'
import { viteStaticCopy } from 'vite-plugin-static-copy'
import path from 'path'

export default defineConfig({
    base: '/vivoX200Ultra-webgi/',
    server: {
        headers: {
          'Content-Type': 'text/javascript'
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
