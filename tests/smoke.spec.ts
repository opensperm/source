import { test, expect } from '@playwright/test';

test('home loads', async ({ page }) => {
  await page.goto('/');
  await expect(page).toHaveTitle(/Open/);
  await expect(page.getByRole('heading')).toBeVisible({ timeout: 5000 });
});

test('docs page loads', async ({ page }) => {
  await page.goto('/docs');
  await expect(page.getByText(/Docs|Documentation|Welcome/i)).toBeVisible({ timeout: 5000 });
});
