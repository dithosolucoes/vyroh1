import { defineConfig, devices } from '@playwright/test';

const PORT = process.env.PORT ?? '3000';
const baseURL = `http://localhost:${PORT}`;

/**
 * E2E do Vyroh — precisa de DATABASE_URL real apontando pra um Postgres vivo
 * (Marco 1/8 do roadmap). Sem isso os testes sobem o servidor mas os fluxos que
 * tocam banco vão falhar — comportamento esperado, não é bug deste config.
 * See https://playwright.dev/docs/test-configuration.
 */
export default defineConfig({
  testDir: './tests/e2e',
  testMatch: '*.@(integ|e2e).?(c|m)[jt]s?(x)',
  timeout: 30 * 1000,
  forbidOnly: !!process.env.CI,
  reporter: process.env.CI ? 'github' : 'list',

  expect: {
    timeout: 15 * 1000,
  },

  webServer: {
    command: 'npm run build && npm run start',
    url: baseURL,
    timeout: 120 * 1000,
    reuseExistingServer: !process.env.CI,
  },

  use: {
    baseURL,
    trace: process.env.CI ? 'on' : 'retain-on-failure',
  },

  projects: [
    {
      name: 'chromium',
      use: { ...devices['Desktop Chrome'] },
    },
  ],
});
