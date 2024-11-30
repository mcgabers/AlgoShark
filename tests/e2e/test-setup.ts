import { test as base, expect } from '@playwright/test';
import { AxeBuilder } from '@axe-core/playwright';

// Extend base test with accessibility testing
export const test = base.extend({
  // Add accessibility testing to each page
  page: async ({ page }, use) => {
    // Add accessibility testing methods
    page.accessibility = {
      async analyze() {
        const results = await new AxeBuilder({ page }).analyze();
        return results;
      },
    };

    // Add custom navigation methods
    page.navigation = {
      async goToDiscover() {
        await page.goto('/discover');
      },
      async goToProject(id: string) {
        await page.goto(`/discover/${id}`);
      },
    };

    await use(page);
  },
});

export { expect }; 