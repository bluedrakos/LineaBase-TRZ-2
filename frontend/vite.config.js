import tailwindcss from '@tailwindcss/vite';
import react from '@vitejs/plugin-react';
import path from 'path';
import { defineConfig } from 'vite';

export default defineConfig({
    resolve: {
        alias: {
            '@': path.resolve(__dirname, 'src'),
            '@components': path.resolve(__dirname, 'src/Components'),
        },
    },
    plugins: [
        tailwindcss(),
        react(),
    ],
    server: {
        port: 5173,
        proxy: {
            '/api': 'http://localhost:8000',
            '/sanctum': 'http://localhost:8000',
        }
    },
    build: {
        // Salida al directorio public de Laravel para que @vite lo sirva directamente
        outDir: '../public/build',
        emptyOutDir: true,
        manifest: true,
        // Aumenta el límite para evitar falsos errores en CI por chunks grandes
        chunkSizeWarningLimit: 1000,
        rollupOptions: {
            input: path.resolve(__dirname, 'src/app.jsx'),
        }
    }
});
