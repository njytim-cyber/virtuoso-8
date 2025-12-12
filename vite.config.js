import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import path from 'path';

export default defineConfig({
    plugins: [react()],
    resolve: {
        alias: {
            '@data': path.resolve(__dirname, './src/data'),
            '@components': path.resolve(__dirname, './src/components'),
            '@views': path.resolve(__dirname, './src/views'),
            '@containers': path.resolve(__dirname, './src/containers'),
            '@config': path.resolve(__dirname, './src/config'),
            '@utils': path.resolve(__dirname, './src/utils')
        }
    },
    test: {
        globals: true,
        environment: 'jsdom',
        setupFiles: './tests/setup.js'
    }
});
