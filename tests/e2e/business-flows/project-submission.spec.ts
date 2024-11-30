import { test, expect } from '@playwright/test';

test.describe('Business Flow - Project Submission & Quality', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('http://localhost:3002');
    // Assume we have a test wallet connected
    await page.evaluate(() => {
      localStorage.setItem('walletConnected', 'true');
      localStorage.setItem('walletAddress', '0x123...abc');
    });
  });

  test('complete project submission flow', async ({ page }) => {
    // Navigate to submit page
    await page.locator('nav').getByRole('link', { name: 'Submit Project' }).click();
    
    // Fill out project details
    await page.getByLabel(/Project Name/i).fill('Test AI Project');
    await page.getByLabel(/Description/i).fill('An AI-powered solution for algorithmic trading');
    await page.getByLabel(/GitHub URL/i).fill('https://github.com/test/project');
    
    // Technical details
    await page.getByLabel(/Smart Contract Address/i).fill('0x456...def');
    await page.getByLabel(/Token Symbol/i).fill('TAI');
    
    // Team information
    await page.getByRole('button', { name: /Add Team Member/i }).click();
    await page.getByLabel(/Member Name/i).fill('John Doe');
    await page.getByLabel(/Role/i).fill('Lead Developer');
    
    // Submit project
    await page.getByRole('button', { name: /Submit for Review/i }).click();
    
    // Verify submission confirmation
    await expect(page.getByText(/Project submitted successfully/i)).toBeVisible();
  });

  test('project validation requirements', async ({ page }) => {
    await page.locator('nav').getByRole('link', { name: 'Submit Project' }).click();
    
    // Try to submit empty form
    await page.getByRole('button', { name: /Submit for Review/i }).click();
    
    // Check validation messages
    await expect(page.getByText(/Project name is required/i)).toBeVisible();
    await expect(page.getByText(/Description is required/i)).toBeVisible();
    await expect(page.getByText(/GitHub URL is required/i)).toBeVisible();
  });

  test('project documentation requirements', async ({ page }) => {
    await page.locator('nav').getByRole('link', { name: 'Submit Project' }).click();
    
    // Check for documentation requirements
    await expect(page.getByText(/Technical Documentation/i)).toBeVisible();
    await expect(page.getByText(/Whitepaper/i)).toBeVisible();
    
    // Verify file upload functionality
    const fileInput = page.locator('input[type="file"]');
    // await fileInput.setInputFiles('path/to/test/doc.pdf');
    
    // Check file size limits
    await expect(page.getByText(/Maximum file size/i)).toBeVisible();
  });

  test('project review status tracking', async ({ page }) => {
    // Navigate to submitted project
    await page.locator('nav').getByRole('link', { name: 'Submit Project' }).click();
    
    // Check status indicators
    await expect(page.getByText(/Review Status/i)).toBeVisible();
    await expect(page.getByText(/Pending Review/i)).toBeVisible();
    
    // Verify review timeline
    await expect(page.getByText(/Estimated Review Time/i)).toBeVisible();
  });

  test('project updates and communication', async ({ page }) => {
    await page.locator('nav').getByRole('link', { name: 'Submit Project' }).click();
    
    // Check communication channels
    await expect(page.getByText(/Project Updates/i)).toBeVisible();
    await expect(page.getByRole('button', { name: /Post Update/i })).toBeVisible();
    
    // Test update posting
    await page.getByRole('button', { name: /Post Update/i }).click();
    await page.getByLabel(/Update Message/i).fill('Development milestone reached');
    await page.getByRole('button', { name: /Submit Update/i }).click();
    
    // Verify update visibility
    await expect(page.getByText(/Development milestone reached/i)).toBeVisible();
  });
}); 