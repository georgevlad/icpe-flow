import { defineConfig } from '@playwright/test';
import developmentConfig from './playwright.config';

export default defineConfig({
  ...developmentConfig,
  use: { ...developmentConfig.use, baseURL: 'http://127.0.0.1:5175' },
});
