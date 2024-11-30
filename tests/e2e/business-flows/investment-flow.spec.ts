import { test, expect } from '../test-setup';

test.describe('Business Flow - Investment & Conversion', () => {
  test.beforeEach(async ({ page, context }) => {
    // Set up storage state before navigation
    await context.addInitScript(() => {
      window.localStorage.setItem('walletConnected', 'true');
      window.localStorage.setItem('walletAddress', '0x123...abc');
      window.localStorage.setItem('authToken', 'test-token');
    });
  });

  test('complete investment flow', async ({ page }) => {
    await page.goto('/discover');
    
    // Select a project
    const projectCard = page.locator('[data-testid="project-card"]').first();
    await expect(projectCard).toBeVisible({ timeout: 10000 });
    await projectCard.click();
    
    // Check investment components
    await expect(page.getByRole('button', { name: /Invest/i })).toBeVisible();
    await expect(page.getByText(/Minimum Investment/i)).toBeVisible();
    
    // Start investment process
    await page.getByRole('button', { name: /Invest/i }).click();
    
    // Fill investment details
    await page.getByLabel(/Investment Amount/i).fill('1000');
    
    // Review investment
    await page.getByRole('button', { name: /Review Investment/i }).click();
    
    // Check summary
    await expect(page.getByText(/Investment Summary/i)).toBeVisible();
    await expect(page.getByText(/Transaction Fee/i)).toBeVisible();
    
    // Confirm investment
    await page.getByRole('button', { name: /Confirm Investment/i }).click();
    
    // Verify success
    await expect(page.getByText(/Investment Successful/i)).toBeVisible();
  });

  test('investment limits and validation', async ({ page }) => {
    await page.goto('/discover');
    
    const projectCard = page.locator('[data-testid="project-card"]').first();
    await expect(projectCard).toBeVisible({ timeout: 10000 });
    await projectCard.click();
    
    // Try investing below minimum
    await page.getByRole('button', { name: /Invest/i }).click();
    await page.getByLabel(/Investment Amount/i).fill('1');
    
    // Check validation
    await expect(page.getByText(/Minimum investment required/i)).toBeVisible();
    
    // Try investing above maximum
    await page.getByLabel(/Investment Amount/i).fill('1000000000');
    await expect(page.getByText(/Maximum investment limit/i)).toBeVisible();
  });

  test('investment analytics tracking', async ({ page }) => {
    await page.goto('/discover');
    
    const projectCard = page.locator('[data-testid="project-card"]').first();
    await expect(projectCard).toBeVisible({ timeout: 10000 });
    await projectCard.click();
    
    // Check analytics components
    await expect(page.getByText(/Total Invested/i)).toBeVisible();
    await expect(page.getByText(/Number of Investors/i)).toBeVisible();
    await expect(page.getByText(/Investment Trend/i)).toBeVisible();
  });

  test('post-investment actions', async ({ page }) => {
    await page.goto('/portfolio');
    
    // Check investment tracking
    await expect(page.getByText(/Recent Investments/i)).toBeVisible({ timeout: 10000 });
    await expect(page.getByText(/Investment Performance/i)).toBeVisible();
    
    // Verify transaction history
    await expect(page.getByText(/Transaction History/i)).toBeVisible();
  });

  test('investment notifications', async ({ page }) => {
    await page.goto('/settings');
    
    // Check notification preferences
    await expect(page.getByText(/Investment Notifications/i)).toBeVisible({ timeout: 10000 });
    
    // Toggle notifications
    await page.getByLabel(/Email Notifications/i).click();
    await page.getByLabel(/Investment Updates/i).click();
    
    // Save preferences
    await page.getByRole('button', { name: /Save Preferences/i }).click();
    
    // Verify save confirmation
    await expect(page.getByText(/Preferences saved/i)).toBeVisible();
  });

  test('investment documentation', async ({ page }) => {
    await page.goto('/discover');
    
    const projectCard = page.locator('[data-testid="project-card"]').first();
    await expect(projectCard).toBeVisible({ timeout: 10000 });
    await projectCard.click();
    
    // Check for investment documentation
    await expect(page.getByText(/Investment Terms/i)).toBeVisible();
    await expect(page.getByText(/Risk Disclosure/i)).toBeVisible();
    
    // Verify document downloads
    await expect(page.getByRole('link', { name: /Download Agreement/i })).toBeVisible();
  });
}); 