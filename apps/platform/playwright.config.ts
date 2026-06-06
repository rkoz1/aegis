import { defineConfig } from "@playwright/test";

/**
 * E2E config. Requires browser binaries — run `npx playwright install` once
 * before `pnpm --filter @aegis/platform e2e`. Not wired into `turbo test`
 * (which runs unit tests only) so CI without browsers stays green.
 */
export default defineConfig({
  testDir: "./e2e",
  use: { baseURL: "http://localhost:5179" },
  webServer: {
    command: "pnpm dev --port 5179",
    url: "http://localhost:5179",
    reuseExistingServer: true,
    timeout: 60_000,
  },
});
