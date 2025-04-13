import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

export default defineConfig({
  base: './', // 👈 ESTA LÍNEA ES LA CLAVE
  plugins: [react()],
  resolve: {
    alias: {
      '@': '/src',
    },
  },
});