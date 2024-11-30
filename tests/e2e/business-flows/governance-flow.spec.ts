import { test, expect } from '@playwright/test';

test.describe('Business Flow - Governance & Voting', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('http://localhost:3002');
    // Setup test wallet
    await page.evaluate(() => {
      localStorage.setItem('walletConnected', 'true');
      localStorage.setItem('walletAddress', '0x123...abc');
    });
  });

  test('complete voting flow', async ({ page }) => {
    // Navigate to governance
    await page.locator('nav').getByRole('link', { name: 'Governance' }).click();
    
    // Check active proposals
    await expect(page.getByText(/Active Proposals/i)).toBeVisible();
    
    // Select a proposal
    await page.locator('[data-testid="proposal-card"]').first().click();
    
    // Review proposal details
    await expect(page.getByText(/Proposal Details/i)).toBeVisible();
    await expect(page.getByText(/Voting Power/i)).toBeVisible();
    
    // Cast vote
    await page.getByRole('button', { name: /Vote For/i }).click();
    await page.getByRole('button', { name: /Confirm Vote/i }).click();
    
    // Verify vote recorded
    await expect(page.getByText(/Vote Recorded/i)).toBeVisible();
  });

  test('delegation flow', async ({ page }) => {
    // Navigate to delegation
    await page.locator('nav').getByRole('link', { name: 'Governance' }).click();
    await page.getByRole('link', { name: 'Delegates' }).click();
    
    // Check delegate list
    await expect(page.getByText(/Top Delegates/i)).toBeVisible();
    
    // Select delegate
    await page.locator('[data-testid="delegate-card"]').first().click();
    
    // Review delegate profile
    await expect(page.getByText(/Delegate Profile/i)).toBeVisible();
    await expect(page.getByText(/Voting History/i)).toBeVisible();
    
    // Delegate voting power
    await page.getByRole('button', { name: /Delegate Votes/i }).click();
    await page.getByRole('button', { name: /Confirm Delegation/i }).click();
    
    // Verify delegation
    await expect(page.getByText(/Successfully Delegated/i)).toBeVisible();
  });

  test('proposal creation flow', async ({ page }) => {
    // Navigate to governance
    await page.locator('nav').getByRole('link', { name: 'Governance' }).click();
    
    // Start proposal creation
    await page.getByRole('button', { name: /Create Proposal/i }).click();
    
    // Fill proposal details
    await page.getByLabel(/Title/i).fill('Improve Platform Security');
    await page.getByLabel(/Description/i).fill('Implement additional security measures');
    await page.getByLabel(/Voting Period/i).fill('7');
    
    // Add actions
    await page.getByRole('button', { name: /Add Action/i }).click();
    await page.getByLabel(/Contract Address/i).fill('0x789...ghi');
    await page.getByLabel(/Function/i).fill('upgradeSecurityModule');
    
    // Submit proposal
    await page.getByRole('button', { name: /Submit Proposal/i }).click();
    
    // Verify submission
    await expect(page.getByText(/Proposal Created/i)).toBeVisible();
  });

  test('voting history and analytics', async ({ page }) => {
    // Navigate to voting history
    await page.locator('nav').getByRole('link', { name: 'Governance' }).click();
    await page.getByRole('link', { name: 'My Votes' }).click();
    
    // Check voting history
    await expect(page.getByText(/Past Votes/i)).toBeVisible();
    await expect(page.getByText(/Voting Power History/i)).toBeVisible();
    
    // Check analytics
    await expect(page.getByText(/Participation Rate/i)).toBeVisible();
    await expect(page.getByText(/Voting Impact/i)).toBeVisible();
  });
}); 