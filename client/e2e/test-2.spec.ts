import { test, expect } from '@playwright/test';

test.only('login success', async ({ page }) => {
  await page.goto('/');
  await page.keyboard.press('Tab');
  await page.locator('[data-test="sign-in-username-input"]').fill('test');
  await page.keyboard.press('Tab');

  await page.locator('[data-test="sign-in-password-input"]').fill('100secretwords');
  await page.getByText('Sign In', { exact: true }).click();
  await expect(page.getByRole('link', { name: 'Home' })).toBeVisible();
  await page.goto('/pastvisits');

  // click the select
  // await page.getByTestId('choose clinic').click();
  await expect(page.getByLabel('Choose a clinic')).toBeVisible();
  // ('dropdown').click();
  // await expect(page.getByRole('dropdown', { name: 'Home' })).toBeVisible();
});