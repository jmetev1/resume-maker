
import { test, expect } from '@playwright/test';
import { realJob } from '../src/test-data'
const url = 'http://jobs.polymer.co/violet-labs/28087'

test.skip('has title', async ({ page }) => {
  await page.goto('/create');
  await page.locator('[name="jdUrl"]').fill(url);
  await page.locator('[name="jobDescription"]').fill(realJob);
  await page.locator('[id="submit-job"]').click();

  // const text = await page.textContent('h1');
  // Expect a title "to contain" a substring.
  // await expect(page).toHaveTitle(/Playwright/);
});
