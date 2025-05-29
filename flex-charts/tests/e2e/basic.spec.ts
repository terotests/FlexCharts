import { test, expect } from "@playwright/test";

test.describe("Basic App Test", () => {
  test("should load the application", async ({ page }) => {
    await page.goto("/");
    await expect(page).toHaveTitle(/FlexCharts/);
  });
});
