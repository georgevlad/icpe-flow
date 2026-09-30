import { defineConfig } from '@playwright/test';
import developmentConfig from './playwright.config';

export default defineConfig({
  ...developmentConfig,
  webServer: {
    command: 'npm start',
    url: 'http://127.0.0.1:5173',
    env: { PORT: '5173' },
    reuseExistingServer: false,
    timeout: 30000,
  },
});
