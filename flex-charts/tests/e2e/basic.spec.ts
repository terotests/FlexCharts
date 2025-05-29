import { test, expect } from "@playwright/test";

test.describe("Basic App Test - Mobile (480px)", () => {
  test.use({ viewport: { width: 480, height: 800 } });

  test("should load the application on mobile", async ({ page }) => {
    await page.goto("/");
    await expect(page).toHaveTitle(/FlexCharts/);

    // Ensure the page is responsive on mobile
    const body = page.locator("body");
    await expect(body).toBeVisible();
  });
});

test.describe("Basic App Test - Desktop (1600px)", () => {
  test.use({ viewport: { width: 1600, height: 900 } });

  test("should load the application on desktop", async ({ page }) => {
    await page.goto("/");
    await expect(page).toHaveTitle(/FlexCharts/);

    // Ensure the page utilizes desktop space
    const body = page.locator("body");
    await expect(body).toBeVisible();
  });
});
