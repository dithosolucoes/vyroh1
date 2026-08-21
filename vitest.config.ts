import react from '@vitejs/plugin-react';
import { defineConfig } from 'vitest/config';
import path from 'path';

export default defineConfig({
  plugins: [react()],
  resolve: {
    alias: {
      '@': path.resolve(__dirname, './'),
    },
  },
  test: {
    environment: 'jsdom',
    include: ['src/**/*.test.{ts,tsx}', 'app/**/*.test.{ts,tsx}'],
    coverage: {
      include: ['src/**/*.{ts,tsx}', 'app/**/*.{ts,tsx}'],
      exclude: ['src/**/*.stories.{ts,tsx}', '**/*.test.{ts,tsx}'],
    },
  },
});
