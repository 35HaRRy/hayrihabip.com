import { defineConfig, loadEnv } from 'vite';
import { reactRouter } from '@react-router/dev/vite';
import tailwindcss from '@tailwindcss/vite';

// https://vite.dev/config/
export default defineConfig(({ mode }) => {
  const { API_URL } = loadEnv(mode, process.cwd(), 'API_URL');
  if (API_URL && !process.env.API_URL) process.env.API_URL = API_URL;
  return {
  plugins: [tailwindcss(), reactRouter()],
  server: {
    host: '127.0.0.1',
    port: 3000,
  },
  };
});
