import { defineConfig, normalizePath } from 'vite';  // TS types
// import { viteStaticCopy } from 'vite-plugin-static-copy'; // file copying
import { resolve } from 'node:path'; 

// normalize path - via https://www.npmjs.com/package/vite-plugin-static-copy

export default defineConfig({
    build: {
        rollupOptions: {
            input: {
                main: normalizePath(resolve(__dirname, 'index.html')),
                nested: normalizePath(resolve(__dirname, 'nested/index.html')),
            },
        },
    },
    plugins: [
        // viteStaticCopy({
        //     targets: [
        //       {
        //         src: 'bin/example.wasm',
        //         dest: 'wasm-files'
        //       }
        //     ]
        //   })
    ],



})