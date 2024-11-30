import { test, expect } from '@playwright/test';

test.describe('Business Flow - Help & Support', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('http://localhost:3002');
  });

  test('access documentation', async ({ page }) => {
    // Navigate to help center
    await page.getByRole('link', { name: /Help/i }).click();
    
    // Check documentation sections
    await expect(page.getByText(/Getting Started/i)).toBeVisible();
    await expect(page.getByText(/Platform Guide/i)).toBeVisible();
    await expect(page.getByText(/FAQs/i)).toBeVisible();
    
    // Navigate to specific guide
    await page.getByRole('link', { name: /Investment Guide/i }).click();
    await expect(page.getByText(/How to Invest/i)).toBeVisible();
  });

  test('support ticket flow', async ({ page }) => {
    // Navigate to support
    await page.getByRole('link', { name: /Support/i }).click();
    
    // Create ticket
    await page.getByRole('button', { name: /Create Ticket/i }).click();
    
    // Fill ticket details
    await page.getByLabel(/Subject/i).fill('Question about investment process');
    await page.getByLabel(/Description/i).fill('How do I track my investment after purchase?');
    await page.getByLabel(/Category/i).selectOption('Investment');
    
    // Submit ticket
    await page.getByRole('button', { name: /Submit Ticket/i }).click();
    
    // Verify submission
    await expect(page.getByText(/Ticket Created/i)).toBeVisible();
    await expect(page.getByText(/Ticket ID/i)).toBeVisible();
  });

  test('interactive help features', async ({ page }) => {
    // Check help widget
    await page.getByRole('button', { name: /Help Widget/i }).click();
    
    // Test search functionality
    await page.getByPlaceholder(/Search help articles/i).fill('wallet connection');
    await expect(page.getByText(/Related Articles/i)).toBeVisible();
    
    // Check interactive guides
    await page.getByRole('link', { name: /Interactive Guides/i }).click();
    await expect(page.getByText(/Platform Tutorial/i)).toBeVisible();
  });

  test('feedback system', async ({ page }) => {
    // Navigate to feedback
    await page.getByRole('link', { name: /Feedback/i }).click();
    
    // Submit feedback
    await page.getByLabel(/Rating/i).click({ position: { x: 4, y: 0 } }); // 4-star rating
    await page.getByLabel(/Comments/i).fill('Great platform, but could use more documentation');
    await page.getByRole('button', { name: /Submit Feedback/i }).click();
    
    // Verify submission
    await expect(page.getByText(/Thank you for your feedback/i)).toBeVisible();
  });
}); 