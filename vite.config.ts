import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

// https://vitejs.dev/config/
export default defineConfig({
  base: './', // ✅ This is the fix for blank screen on Render
  plugins: [react()],
  optimizeDeps: {
    exclude: ['lucide-react'],
  },
});

