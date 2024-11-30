import { test, expect } from '@playwright/test';

test.describe('Basic Navigation Tests', () => {
  test('should load the homepage', async ({ page }) => {
    await page.goto('/');
    await expect(page).toHaveTitle(/AlgoShark/);
    
    // Check if main navigation elements are present
    await expect(page.getByRole('navigation')).toBeVisible();
  });

  test('should check for error states', async ({ page }) => {
    await page.goto('/');
    
    // Log console errors
    page.on('console', msg => {
      if (msg.type() === 'error') {
        console.error(`Page Error: ${msg.text()}`);
      }
    });

    // Log network errors
    page.on('pageerror', exception => {
      console.error(`Page Exception: ${exception.message}`);
    });

    // Wait for any potential dynamic content
    await page.waitForLoadState('networkidle');
  });
}); 