import { test, expect } from "@playwright/test";

test.describe("TimeLineChart Component - Mobile (480px)", () => {
  test.use({ viewport: { width: 480, height: 800 } });

  test.beforeEach(async ({ page }) => {
    await page.goto("/");
    // Wait for React to render
    await page.waitForTimeout(1000);
  });
  test("should render TimeLineChart component on mobile", async ({ page }) => {
    // Check if the main chart container exists using data-test-id
    const chartContainer = page.locator('[data-test-id="timeline-chart"]');
    await expect(chartContainer).toBeVisible();
  });

  test("should display timeline bars on mobile", async ({ page }) => {
    // Wait for the component to load
    await page.waitForSelector('[data-test-id="timeline-chart"]', {
      timeout: 10000,
    });

    // Check if timeline bars are rendered using data-test-id
    const bars = page.locator('[data-test-id^="bar-"]');
    await expect(bars.first()).toBeVisible();

    const barCount = await bars.count();
    expect(barCount).toBeGreaterThan(0);
  });

  test("should display time slots on mobile", async ({ page }) => {
    await page.waitForSelector('[data-test-id="timeline-chart"]', {
      timeout: 10000,
    });

    // Get all time slots using data-test-id
    const timeSlots = page.locator('[data-test-id^="time-slot-"]');
    await expect(timeSlots.first()).toBeVisible();

    const slotCount = await timeSlots.count();
    expect(slotCount).toBeGreaterThan(0);
  });

  test("should have proper mobile structure", async ({ page }) => {
    await page.waitForSelector('[data-test-id="timeline-chart"]', {
      timeout: 10000,
    });

    const chartContainer = page.locator('[data-test-id="timeline-chart"]');
    await expect(chartContainer).toBeVisible();

    // Check if container adapts to mobile dimensions
    const boundingBox = await chartContainer.boundingBox();
    expect(boundingBox?.width).toBeGreaterThan(0);
    expect(boundingBox?.width).toBeLessThanOrEqual(480);
    expect(boundingBox?.height).toBeGreaterThan(0);
  });

  test("should have proper accessibility attributes on mobile", async ({
    page,
  }) => {
    await page.waitForSelector('[data-test-id="timeline-chart"]', {
      timeout: 10000,
    });

    // Check first bar has proper accessibility attributes
    const firstBar = page.locator('[data-test-id^="bar-"]').first();
    await expect(firstBar).toHaveAttribute("aria-label");
    await expect(firstBar).toHaveAttribute("title");
    await expect(firstBar).toHaveAttribute("role", "img");
  });

  test("should show Turbo C bar (bar-1) as visible on mobile viewport", async ({
    page,
  }) => {
    await page.waitForSelector('[data-test-id="timeline-chart"]', {
      timeout: 10000,
    });

    // Bar-1 corresponds to "Turbo C" from customBars data (id: 1)
    // It should be visible on mobile as it's one of the early/prominent bars
    const turboCBar = page.locator('[data-test-id="bar-1"]');

    // Check that the bar exists and is visible
    await expect(turboCBar).toBeVisible();

    // Verify it has the correct title attribute
    await expect(turboCBar).toHaveAttribute("title", "Turbo C");

    // Also check that it's actually within the mobile viewport
    const boundingBox = await turboCBar.boundingBox();
    const viewportSize = page.viewportSize();

    if (boundingBox && viewportSize) {
      // Check if the element is within the visible area of the mobile screen
      const isWithinViewport =
        boundingBox.x >= 0 &&
        boundingBox.y >= 0 &&
        boundingBox.x + boundingBox.width <= viewportSize.width &&
        boundingBox.y + boundingBox.height <= viewportSize.height;

      // On mobile, Turbo C should be visible and within viewport
      expect(isWithinViewport).toBe(true);
    }
  });

  test("should not show bar-12 (Nginx) initially on mobile viewport", async ({
    page,
  }) => {
    await page.waitForSelector('[data-test-id="timeline-chart"]', {
      timeout: 10000,
    });

    // Bar-12 corresponds to "Nginx" from customBars data (id: 12)
    // It should not be visible in the mobile viewport due to screen constraints
    const nginxBar = page.locator('[data-test-id="bar-12"]');

    // Check if the bar exists in DOM
    const barExists = await nginxBar.count();
    if (barExists > 0) {
      // If bar exists, check if it's actually visible in the viewport
      const isInViewport = await nginxBar.isVisible();

      // Also check if the element is within the viewport boundaries
      const boundingBox = await nginxBar.boundingBox();
      const viewportSize = page.viewportSize();

      let isWithinViewport = false;
      if (boundingBox && viewportSize) {
        // Check if the element is within the visible area of the screen
        isWithinViewport =
          boundingBox.x >= 0 &&
          boundingBox.y >= 0 &&
          boundingBox.x + boundingBox.width <= viewportSize.width &&
          boundingBox.y + boundingBox.height <= viewportSize.height;
      }

      // On mobile, bar-12 should either not be visible or not be within viewport
      expect(isInViewport && isWithinViewport).toBe(false);
    } else {
      // If bar doesn't exist at all, that's also acceptable for mobile
      expect(barExists).toBe(0);
    }
  });
});

test.describe("TimeLineChart Component - Desktop (1600px)", () => {
  test.use({ viewport: { width: 1600, height: 900 } });

  test.beforeEach(async ({ page }) => {
    await page.goto("/");
    // Wait for React to render
    await page.waitForTimeout(1000);
  });
  test("should render TimeLineChart component on desktop", async ({ page }) => {
    // Check if the main chart container exists using data-test-id
    const chartContainer = page.locator('[data-test-id="timeline-chart"]');
    await expect(chartContainer).toBeVisible();
  });

  test("should display timeline bars on desktop", async ({ page }) => {
    // Wait for the component to load
    await page.waitForSelector('[data-test-id="timeline-chart"]', {
      timeout: 10000,
    });

    // Check if timeline bars are rendered using data-test-id
    const bars = page.locator('[data-test-id^="bar-"]');
    await expect(bars.first()).toBeVisible();

    const barCount = await bars.count();
    expect(barCount).toBeGreaterThan(0);
  });

  test("should display time slots on desktop", async ({ page }) => {
    await page.waitForSelector('[data-test-id="timeline-chart"]', {
      timeout: 10000,
    });

    // Get all time slots using data-test-id
    const timeSlots = page.locator('[data-test-id^="time-slot-"]');
    await expect(timeSlots.first()).toBeVisible();

    const slotCount = await timeSlots.count();
    expect(slotCount).toBeGreaterThan(0);
  });

  test("should have proper desktop structure", async ({ page }) => {
    await page.waitForSelector('[data-test-id="timeline-chart"]', {
      timeout: 10000,
    });

    const chartContainer = page.locator('[data-test-id="timeline-chart"]');
    await expect(chartContainer).toBeVisible();

    // Check if container utilizes desktop dimensions
    const boundingBox = await chartContainer.boundingBox();
    expect(boundingBox?.width).toBeGreaterThan(480); // Should be wider than mobile
    expect(boundingBox?.height).toBeGreaterThan(0);
  });

  test("should display more content on desktop", async ({ page }) => {
    await page.waitForSelector('[data-test-id="timeline-chart"]', {
      timeout: 10000,
    });

    // Desktop should potentially show more bars or details
    const bars = page.locator('[data-test-id^="bar-"]');
    const barCount = await bars.count();
    expect(barCount).toBeGreaterThan(0);
  });

  test("should have proper accessibility attributes on desktop", async ({
    page,
  }) => {
    await page.waitForSelector('[data-test-id="timeline-chart"]', {
      timeout: 10000,
    });

    // Check first bar has proper accessibility attributes
    const firstBar = page.locator('[data-test-id^="bar-"]').first();
    await expect(firstBar).toHaveAttribute("aria-label");
    await expect(firstBar).toHaveAttribute("title");
    await expect(firstBar).toHaveAttribute("role", "img");

    // Check that the title matches the label
    const title = await firstBar.getAttribute("title");
    const ariaLabel = await firstBar.getAttribute("aria-label");
    expect(title).toBe(ariaLabel);
  });

  test("should have specific bar IDs for testing", async ({ page }) => {
    await page.waitForSelector('[data-test-id="timeline-chart"]', {
      timeout: 10000,
    });

    // Check that specific bars can be found by their IDs
    const turboCBar = page.locator('[data-test-id="bar-1"]');
    const pascalBar = page.locator('[data-test-id="bar-2"]');

    await expect(turboCBar).toBeVisible();
    await expect(pascalBar).toBeVisible();

    // Check their titles match expected labels from customBars.ts
    await expect(turboCBar).toHaveAttribute("title", "Turbo C");
    await expect(pascalBar).toHaveAttribute("title", "Pascal");
  });
});
