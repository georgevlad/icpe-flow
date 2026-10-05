import { defineConfig, loadEnv } from 'vite';
import react from '@vitejs/plugin-react';
export default defineConfig(({ mode }) => {
  const env = loadEnv(mode, '.', '');
  const apiTarget = `http://127.0.0.1:${env.API_PORT ?? 3101}`;
  return {
    plugins: [react()],
    server: { host: '127.0.0.1', port: Number(env.WEB_PORT ?? 5173), strictPort: true, proxy: { '/api': apiTarget } },
    preview: { port: 4173, proxy: { '/api': apiTarget } }
  };
});
