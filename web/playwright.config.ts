import { defineConfig, devices } from "@playwright/test";

const port = 3100;

export default defineConfig({
  testDir: "./e2e",
  // CI では、うっかり残した test.only でテストが減らないようにする
  forbidOnly: !!process.env.CI,
  use: {
    baseURL: `http://localhost:${port}`,
  },
  projects: [{ name: "chromium", use: { ...devices["Desktop Chrome"] } }],
  // テストの前に、本番用にビルドしたアプリを起動する
  webServer: {
    command: `pnpm build && pnpm start --port ${port}`,
    url: `http://localhost:${port}`,
    reuseExistingServer: !process.env.CI,
    timeout: 120_000,
  },
});
