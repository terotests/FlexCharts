import { test, expect } from "@playwright/test";

test.describe("TimeLineChart Component", () => {
  test.beforeEach(async ({ page }) => {
    await page.goto("/");
    // Wait for React to render
    await page.waitForTimeout(1000);
  });

  test("should render TimeLineChart component", async ({ page }) => {
    // Check if the main chart container exists
    const chartContainer = page.locator(".timeline-chart");
    await expect(chartContainer).toBeVisible();
  });

  test("should display timeline bars", async ({ page }) => {
    // Wait for the component to load
    await page.waitForSelector(".timeline-chart", { timeout: 10000 });

    // Check if timeline bars are rendered (use .bar, not .timeline-bar)
    const bars = page.locator(".bar");
    await expect(bars.first()).toBeVisible();

    const barCount = await bars.count();
    expect(barCount).toBeGreaterThan(0);
  });

  test("should display time slots", async ({ page }) => {
    await page.waitForSelector(".timeline-chart", { timeout: 10000 });

    // Get all time slots
    const timeSlots = page.locator(".time-slot");
    await expect(timeSlots.first()).toBeVisible();

    const slotCount = await timeSlots.count();
    expect(slotCount).toBeGreaterThan(0);
  });

  test("should have proper structure", async ({ page }) => {
    await page.waitForSelector(".timeline-chart", { timeout: 10000 });

    const chartContainer = page.locator(".timeline-chart");
    await expect(chartContainer).toBeVisible();

    // Check if container has proper dimensions
    const boundingBox = await chartContainer.boundingBox();
    expect(boundingBox?.width).toBeGreaterThan(0);
    expect(boundingBox?.height).toBeGreaterThan(0);
  });
});
