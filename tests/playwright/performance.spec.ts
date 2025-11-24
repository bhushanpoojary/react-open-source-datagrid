import { test, expect } from '@playwright/test';

test.describe('Virtual Scrolling Performance', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/');
    await page.getByRole('button', { name: /Virtual Scrolling/i }).click();
  });

  test('should virtualize rows efficiently', async ({ page }) => {
    const rows = page.locator('[role="row"]');
    const rowCount = await rows.count();
    
    // Should render only viewport rows
    expect(rowCount).toBeLessThan(100);
  });

  test('should handle scrolling smoothly', async ({ page }) => {
    // Find the scrollable container (virtual scroller)
    const scrollContainer = page.locator('.virtual-scroller-container').first();
    
    // Get initial first data row text (skip header row)
    const dataRows = page.locator('[role="row"]').filter({ hasNotText: /^ID.*Name.*Email/ });
    const initialText = await dataRows.first().textContent();
    
    // Scroll down
    await scrollContainer.evaluate(el => el.scrollTop = 2000);
    await page.waitForTimeout(500);
    
    // First visible data row should be different after scrolling
    const newText = await dataRows.first().textContent();
    expect(newText).not.toBe(initialText);
  });

  test('should maintain performance with rapid scrolling', async ({ page }) => {
    // Find the scrollable container (virtual scroller)
    const scrollContainer = page.locator('.virtual-scroller-container').first();
    
    // Rapid scroll
    for (let i = 0; i < 10; i++) {
      await scrollContainer.evaluate((el, scrollTop) => el.scrollTop = scrollTop, i * 500);
      await page.waitForTimeout(50);
    }
    
    // Grid should still be responsive
    const grid = page.locator('[data-testid="data-grid"]');
    await expect(grid).toBeVisible();
    const rows = page.locator('[role="row"]');
    expect(await rows.count()).toBeGreaterThan(0);
  });
});
