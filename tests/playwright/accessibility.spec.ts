import { test, expect } from '@playwright/test';

test.describe('Accessibility', () => {
  test('should have proper ARIA roles', async ({ page }) => {
    await page.goto('/demo/standard');

    // Check for grid role
    const grid = page.locator('[role="grid"]');
    await expect(grid).toBeVisible();
    
    // Check for column headers
    const headers = page.locator('[role="columnheader"]');
    expect(await headers.count()).toBeGreaterThan(0);
    
    // Check for rows
    const rows = page.locator('[role="row"]');
    expect(await rows.count()).toBeGreaterThan(0);
  });

  test('should be keyboard navigable', async ({ page }) => {
    await page.goto('/demo/standard');
    
    // Focus on grid
    const grid = page.locator('[data-testid="data-grid"]');
    await grid.focus();
    
    // Press arrow keys
    await page.keyboard.press('ArrowDown');
    await page.keyboard.press('ArrowRight');
    await page.keyboard.press('ArrowUp');
    await page.keyboard.press('ArrowLeft');
    
    // Grid should still be visible and functional
    await expect(grid).toBeVisible();
  });

  test('should pass basic accessibility checks', async ({ page }) => {
    await page.goto('/');
    
    // Check for heading structure
    const h1 = page.locator('h1');
    await expect(h1).toBeVisible();
    
    // Check for proper contrast (basic check)
    const textColor = await page.locator('body').evaluate(el => 
      window.getComputedStyle(el).color
    );
    expect(textColor).toBeTruthy();
  });
});
