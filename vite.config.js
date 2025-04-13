import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react'; // o '@vitejs/plugin-react-swc'

export default defineConfig({
  base: './',
  plugins: [react()],
  resolve: {
    alias: {
      '@': '/src',
    },
  },
});
