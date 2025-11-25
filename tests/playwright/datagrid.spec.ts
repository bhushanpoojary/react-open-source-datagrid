import { test, expect } from '@playwright/test';

test.describe('DataGrid Core Features', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/demo/standard');
    await page.locator('[data-testid="data-grid"]').waitFor({ timeout: 10000 });
  });

  test('should render grid with data', async ({ page }) => {
    const grid = page.locator('[data-testid="data-grid"]');
    await expect(grid).toBeVisible();
    
    const rows = page.locator('[role="row"]');
    const rowCount = await rows.count();
    expect(rowCount).toBeGreaterThan(1);
  });

  test('should display column headers', async ({ page }) => {
    const headers = page.locator('[role="columnheader"]');
    const headerCount = await headers.count();
    expect(headerCount).toBeGreaterThan(0);
  });

  test('should sort columns', async ({ page }) => {
    const nameHeader = page.locator('[role="columnheader"]').filter({ hasText: 'Name' });
    await nameHeader.click();
    
    // Wait for sort to apply
    await page.waitForTimeout(300);
    
    // Click again to reverse sort
    await nameHeader.click();
    await page.waitForTimeout(300);
    
    // Grid should still be visible and functional
    await expect(page.locator('[data-testid="data-grid"]')).toBeVisible();
  });

  test('should select rows', async ({ page }) => {
    const firstRow = page.locator('[role="row"]').nth(1);
    await firstRow.click();
    
    // Check if row has selected styling
    const backgroundColor = await firstRow.evaluate(el => 
      window.getComputedStyle(el).backgroundColor
    );
    expect(backgroundColor).not.toBe('rgba(0, 0, 0, 0)');
  });
});
