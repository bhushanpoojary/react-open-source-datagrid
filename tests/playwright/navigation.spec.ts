import { test, expect } from '@playwright/test';

test.describe('Navigation and Basic Functionality', () => {
  test('should load home page', async ({ page }) => {
    await page.goto('/');
    await expect(page.getByRole('heading', { name: 'React DataGrid', exact: true })).toBeVisible();
  });

  test('should navigate to different demos', async ({ page }) => {
    await page.goto('/');

    // Navigate to Virtual Scrolling (use the sidebar menu button)
    await page.getByRole('button', { name: /Virtual Scrolling/i }).click();
    await expect(page.getByText('Virtual Scrolling Demo')).toBeVisible();

    // Navigate to Cell Renderers
    await page.getByRole('button', { name: /Cell Renderers/i }).click();
    await expect(page.getByText('Cell Renderer Framework Demo')).toBeVisible();
  });

  test('should search for features', async ({ page }) => {
    await page.goto('/');
    const searchInput = page.getByPlaceholder(/Search/i);
    
    // Search for "scroll" which should match both Virtual Scrolling and Infinite Scroll
    await searchInput.fill('scroll');
    await expect(page.getByRole('button', { name: /Virtual Scrolling/i })).toBeVisible();
    await expect(page.getByRole('button', { name: /Infinite Scroll/i })).toBeVisible();
  });
});
