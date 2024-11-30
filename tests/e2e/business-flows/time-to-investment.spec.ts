import { test, expect } from '@playwright/test';

interface TimingMetrics {
  initialLoad: number;
  navigationTime: number;
  walletPrompt: number;
  totalTime: number;
}

test.describe('Time to First Investment Flow', () => {
  let metrics: TimingMetrics;

  test.beforeEach(async () => {
    metrics = {
      initialLoad: 0,
      navigationTime: 0,
      walletPrompt: 0,
      totalTime: 0
    };
  });

  test('measure optimal path to first investment', async ({ page }) => {
    const startTime = Date.now();
    
    // Step 1: Landing Page - Initial Load
    await page.goto('http://localhost:3002');
    await expect(page.getByRole('heading', { name: /Welcome to AlgoShark/i })).toBeVisible();
    metrics.initialLoad = Date.now() - startTime;
    console.log(`Initial page load time: ${metrics.initialLoad}ms`);
    
    // Step 2: Project Discovery
    const browseTime = Date.now();
    await page.locator('nav').getByRole('link', { name: 'Discover' }).click();
    await expect(page).toHaveURL(/.*discover/);
    metrics.navigationTime = Date.now() - browseTime;
    console.log(`Time to reach discover page: ${metrics.navigationTime}ms`);
    
    // Step 3: Wallet Connection
    const walletTime = Date.now();
    const connectButton = page.locator('.flex-shrink-0.bg-white.shadow button:has-text("Connect Wallet")').first();
    await expect(connectButton).toBeVisible();
    await connectButton.click();
    metrics.walletPrompt = Date.now() - walletTime;
    console.log(`Time to wallet prompt: ${metrics.walletPrompt}ms`);
    
    // Simulate successful wallet connection
    await page.evaluate(() => {
      localStorage.setItem('walletConnected', 'true');
      localStorage.setItem('walletAddress', '0x123...abc');
    });
    await page.reload();
    
    metrics.totalTime = Date.now() - startTime + 5000; // Including wallet interaction
    console.log(`Total time to investment readiness: ${metrics.totalTime}ms`);
    
    // Performance assertions
    expect(metrics.initialLoad).toBeLessThan(3000); // 3s initial load
    expect(metrics.navigationTime).toBeLessThan(1000); // 1s navigation
    expect(metrics.walletPrompt).toBeLessThan(800); // 800ms wallet prompt
    expect(metrics.totalTime).toBeLessThan(30000); // 30s total flow
  });

  test('verify critical UI elements for quick investment', async ({ page }) => {
    await page.goto('http://localhost:3002');
    
    // Check immediate visibility of key actions with timing
    const visibilityStart = Date.now();
    await expect(page.locator('nav')).toBeVisible();
    const headerWalletButton = page.locator('.flex-shrink-0.bg-white.shadow button:has-text("Connect Wallet")');
    await expect(headerWalletButton.first()).toBeVisible();
    console.log(`Time to critical UI visibility: ${Date.now() - visibilityStart}ms`);
    
    // Verify clear CTA in hero section
    const getStartedSection = page.locator('.border-blue-100');
    await expect(getStartedSection).toBeVisible();
    await expect(getStartedSection.getByRole('link', { name: /Browse Projects/i })).toBeVisible();
  });

  test('mobile optimization for quick investment', async ({ page }) => {
    // Test on mobile viewport
    await page.setViewportSize({ width: 375, height: 667 });
    await page.goto('http://localhost:3002');
    
    // Define minimum touch target size (44x44 pixels per WCAG guidelines)
    const MIN_TOUCH_TARGET = 44;
    const MIN_SPACING = 8;
    
    // Test all interactive elements
    const interactiveElements = [
      { selector: '.flex-shrink-0.bg-white.shadow button', name: 'Wallet Button' },
      { selector: 'nav a', name: 'Navigation Links' },
      { selector: '.border-blue-100 a', name: 'CTA Buttons' }
    ];
    
    for (const element of interactiveElements) {
      const elements = page.locator(element.selector);
      const count = await elements.count();
      
      for (let i = 0; i < count; i++) {
        const el = elements.nth(i);
        const box = await el.boundingBox();
        
        if (box) {
          const message = `${element.name} (${i + 1}/${count}): ${box.width}x${box.height}px`;
          console.log(message);
          
          // Assert minimum touch target size
          expect(box.width, `${element.name} width too small`).toBeGreaterThanOrEqual(MIN_TOUCH_TARGET);
          expect(box.height, `${element.name} height too small`).toBeGreaterThanOrEqual(MIN_TOUCH_TARGET);
          
          // Check for sufficient spacing between elements
          if (i > 0) {
            const prevBox = await elements.nth(i - 1).boundingBox();
            if (prevBox) {
              // For vertical layouts, only check vertical spacing
              const verticalGap = box.y - (prevBox.y + prevBox.height);
              expect(verticalGap, `${element.name} vertical spacing too small`).toBeGreaterThanOrEqual(MIN_SPACING);
            }
          }
        }
      }
    }
  });
}); 