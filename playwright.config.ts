import { defineConfig } from "@playwright/test";
export default defineConfig({
  testDir: "./tests",
  timeout: 90000,
  workers: 1,
  use: {
    baseURL:
      process.env.SPATIAL_TEST_URL ||
      "http://127.0.0.1:4173/Catalogo_espacial/",
    headless: true,
  },
  reporter: "list",
});
