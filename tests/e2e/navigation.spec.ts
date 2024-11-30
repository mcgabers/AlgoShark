import { test, expect } from './test-setup';

test.describe('Navigation Tests', () => {
  test('should verify dynamic project routes', async ({ page }) => {
    // Test a few project IDs
    const projectIds = ['1', '2', '3', 'test-project'];
    
    for (const id of projectIds) {
      await page.navigation.goToProject(id);
      await expect(page.getByText(`Project #${id}`)).toBeVisible();
      await expect(page.getByText('404')).not.toBeVisible();
    }
  });

  test('should show 404 for invalid project routes', async ({ page }) => {
    // Test invalid project routes
    const invalidRoutes = [
      '/discover/invalid/extra',  // Too many segments
      '/discover///',            // Multiple slashes
      '/discover/../../etc',     // Path traversal attempt
    ];

    for (const route of invalidRoutes) {
      await page.goto(route);
      await expect(page.getByText('404')).toBeVisible();
      await expect(page.getByText('Page Not Found')).toBeVisible();
    }
  });

  test('should handle navigation between projects', async ({ page }) => {
    // Start at project 1
    await page.navigation.goToProject('1');
    await expect(page.getByText('Project #1')).toBeVisible();

    // Navigate to project 2
    await page.navigation.goToProject('2');
    await expect(page.getByText('Project #2')).toBeVisible();

    // Go back
    await page.goBack();
    await expect(page.getByText('Project #1')).toBeVisible();
  });
}); 