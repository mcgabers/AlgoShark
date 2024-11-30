import { test, expect } from '@playwright/test';

test.describe('Business Flow - User Engagement & Retention', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('http://localhost:3002');
    // Setup test wallet
    await page.evaluate(() => {
      localStorage.setItem('walletConnected', 'true');
      localStorage.setItem('walletAddress', '0x123...abc');
    });
  });

  test('user onboarding completion', async ({ page }) => {
    // Check welcome elements
    await expect(page.getByText(/Welcome to AlgoShark/i)).toBeVisible();
    
    // Complete onboarding steps
    await page.getByRole('button', { name: /Get Started/i }).click();
    
    // Step 1: Profile Setup
    await page.getByLabel(/Display Name/i).fill('Test User');
    await page.getByRole('button', { name: /Next/i }).click();
    
    // Step 2: Investment Preferences
    await page.getByLabel(/Investment Style/i).selectOption('growth');
    await page.getByRole('button', { name: /Next/i }).click();
    
    // Step 3: Risk Assessment
    await page.getByLabel(/Risk Tolerance/i).selectOption('moderate');
    await page.getByRole('button', { name: /Complete/i }).click();
    
    // Verify completion
    await expect(page.getByText(/Onboarding Complete/i)).toBeVisible();
  });

  test('personalized dashboard experience', async ({ page }) => {
    // Check personalized elements
    await expect(page.getByText(/Recommended for You/i)).toBeVisible();
    await expect(page.getByText(/Based on Your Preferences/i)).toBeVisible();
    
    // Verify personalized project cards
    const recommendedProjects = page.locator('[data-testid="recommended-project"]');
    await expect(recommendedProjects).toHaveCount(4);
  });

  test('engagement features', async ({ page }) => {
    // Navigate to a project
    await page.locator('nav').getByRole('link', { name: 'Discover' }).click();
    await page.locator('[data-testid="project-card"]').first().click();
    
    // Test engagement features
    await page.getByRole('button', { name: /Follow Project/i }).click();
    await page.getByRole('button', { name: /Like/i }).click();
    
    // Add comment
    await page.getByLabel(/Comment/i).fill('Great project!');
    await page.getByRole('button', { name: /Post Comment/i }).click();
    
    // Verify engagement
    await expect(page.getByText(/Following/i)).toBeVisible();
    await expect(page.getByText(/Liked/i)).toBeVisible();
    await expect(page.getByText(/Great project!/i)).toBeVisible();
  });

  test('notification system', async ({ page }) => {
    // Check notification center
    await page.getByRole('button', { name: /Notifications/i }).click();
    
    // Verify notification types
    await expect(page.getByText(/Investment Updates/i)).toBeVisible();
    await expect(page.getByText(/Project News/i)).toBeVisible();
    await expect(page.getByText(/Community Activity/i)).toBeVisible();
    
    // Test notification interaction
    await page.locator('[data-testid="notification"]').first().click();
    await expect(page.getByText(/Mark as Read/i)).toBeVisible();
  });

  test('community features', async ({ page }) => {
    // Navigate to community section
    await page.getByRole('link', { name: /Community/i }).click();
    
    // Check community features
    await expect(page.getByText(/Discussion Forums/i)).toBeVisible();
    await expect(page.getByText(/Top Contributors/i)).toBeVisible();
    
    // Create discussion
    await page.getByRole('button', { name: /New Discussion/i }).click();
    await page.getByLabel(/Title/i).fill('Discussion about AI projects');
    await page.getByLabel(/Content/i).fill('What are your thoughts on AI integration?');
    await page.getByRole('button', { name: /Post Discussion/i }).click();
    
    // Verify post
    await expect(page.getByText(/Discussion about AI projects/i)).toBeVisible();
  });

  test('rewards and incentives', async ({ page }) => {
    // Check rewards section
    await page.getByRole('link', { name: /Rewards/i }).click();
    
    // Verify reward elements
    await expect(page.getByText(/Your Points/i)).toBeVisible();
    await expect(page.getByText(/Achievement Badges/i)).toBeVisible();
    await expect(page.getByText(/Leaderboard/i)).toBeVisible();
    
    // Check available rewards
    await expect(page.getByText(/Available Rewards/i)).toBeVisible();
    await expect(page.getByRole('button', { name: /Claim Reward/i })).toBeVisible();
  });

  test('user milestone tracking', async ({ page }) => {
    // Navigate to profile
    await page.getByRole('link', { name: /Profile/i }).click();
    
    // Check milestone tracking
    await expect(page.getByText(/Investment Milestones/i)).toBeVisible();
    await expect(page.getByText(/Activity Achievements/i)).toBeVisible();
    
    // View milestone details
    await page.getByText(/View All Milestones/i).click();
    await expect(page.getByText(/Milestone Progress/i)).toBeVisible();
  });
}); 