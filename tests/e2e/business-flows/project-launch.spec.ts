import { test, expect } from '@playwright/test';
import { readFileSync } from 'fs';
import path from 'path';

test.describe('Business Flow - Complete Project Launch Cycle', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('http://localhost:3002');
    // Setup test wallet and authentication
    await page.evaluate(() => {
      localStorage.setItem('walletConnected', 'true');
      localStorage.setItem('walletAddress', '0x123...abc');
      localStorage.setItem('authToken', 'test-token');
    });
  });

  test('complete project launch cycle', async ({ page }) => {
    // Step 1: Initial Project Submission
    await page.locator('nav').getByRole('link', { name: 'Submit Project' }).click();
    
    // Basic Information
    await page.getByLabel(/Project Name/i).fill('AlgoTrader Pro');
    await page.getByLabel(/Description/i).fill('Advanced algorithmic trading platform powered by AI');
    await page.getByLabel(/GitHub URL/i).fill('https://github.com/algotrader/pro');
    
    // Technical Details
    await page.getByLabel(/Smart Contract Address/i).fill('0x456...def');
    await page.getByLabel(/Token Symbol/i).fill('ATP');
    await page.getByLabel(/Initial Supply/i).fill('1000000');
    await page.getByLabel(/Token Decimals/i).fill('6');
    
    // Team Information
    await page.getByRole('button', { name: /Add Team Member/i }).click();
    await page.getByLabel(/Member Name/i).fill('Jane Smith');
    await page.getByLabel(/Role/i).fill('Lead Developer');
    await page.getByLabel(/LinkedIn/i).fill('https://linkedin.com/in/janesmith');
    
    // Upload Documentation
    const testDocPath = path.join(__dirname, '../../../test-assets/whitepaper.pdf');
    await page.setInputFiles('input[type="file"]', testDocPath);
    
    // Submit for Review
    await page.getByRole('button', { name: /Submit for Review/i }).click();
    await expect(page.getByText(/Project submitted successfully/i)).toBeVisible();
    
    // Step 2: Contract Deployment
    await page.getByRole('button', { name: /Deploy Contract/i }).click();
    await page.getByLabel(/Network/i).selectOption('testnet');
    await page.getByRole('button', { name: /Confirm Deployment/i }).click();
    await expect(page.getByText(/Contract deployed successfully/i)).toBeVisible();
    
    // Step 3: KYC/AML Verification
    await page.getByRole('link', { name: /Complete KYC/i }).click();
    await page.getByLabel(/Full Name/i).fill('Jane Smith');
    await page.getByLabel(/Date of Birth/i).fill('1990-01-01');
    await page.getByLabel(/Country/i).selectOption('United States');
    await page.getByRole('button', { name: /Submit KYC/i }).click();
    await expect(page.getByText(/KYC verification pending/i)).toBeVisible();
    
    // Step 4: Token Configuration
    await page.getByRole('button', { name: /Configure Token/i }).click();
    await page.getByLabel(/Vesting Schedule/i).fill('12 months');
    await page.getByLabel(/Initial Unlock/i).fill('10');
    await page.getByRole('button', { name: /Save Configuration/i }).click();
    
    // Step 5: Launch Preparation
    await page.getByRole('button', { name: /Prepare Launch/i }).click();
    await page.getByLabel(/Initial Liquidity/i).fill('100000');
    await page.getByLabel(/Starting Price/i).fill('0.1');
    await page.getByRole('button', { name: /Set Parameters/i }).click();
    
    // Step 6: Final Launch
    await page.getByRole('button', { name: /Launch Project/i }).click();
    await page.getByRole('button', { name: /Confirm Launch/i }).click();
    
    // Verify Launch Success
    await expect(page.getByText(/Project successfully launched/i)).toBeVisible();
    await expect(page.getByText(/Trading now available/i)).toBeVisible();
    
    // Verify Token Metrics
    await expect(page.getByText(/Market Cap/i)).toBeVisible();
    await expect(page.getByText(/Liquidity/i)).toBeVisible();
    await expect(page.getByText(/Holders/i)).toBeVisible();
  });

  test('launch requirements validation', async ({ page }) => {
    await page.locator('nav').getByRole('link', { name: 'Submit Project' }).click();
    
    // Try to launch without completing requirements
    await page.getByRole('button', { name: /Launch Project/i }).click();
    
    // Verify requirement checks
    await expect(page.getByText(/Complete project submission required/i)).toBeVisible();
    await expect(page.getByText(/Smart contract deployment required/i)).toBeVisible();
    await expect(page.getByText(/KYC verification required/i)).toBeVisible();
    await expect(page.getByText(/Token configuration required/i)).toBeVisible();
  });

  test('launch phase monitoring', async ({ page }) => {
    // Navigate to launched project
    await page.goto('http://localhost:3002/projects/algotrader-pro');
    
    // Check launch metrics
    await expect(page.getByText(/Launch Progress/i)).toBeVisible();
    await expect(page.getByText(/Token Distribution/i)).toBeVisible();
    await expect(page.getByText(/Trading Volume/i)).toBeVisible();
    
    // Verify investor access
    await expect(page.getByRole('button', { name: /Invest Now/i })).toBeVisible();
    await expect(page.getByText(/Investment Terms/i)).toBeVisible();
  });
}); 