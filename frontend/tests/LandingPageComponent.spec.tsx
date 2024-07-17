import { test, expect } from '@playwright/test';

test('should work', async ({ page }) => {
  await page.goto('http://localhost:5000/')
  await expect(page.getByText('Mern')).toBeVisible()
  await expect(page.getByText('Login')).toBeVisible()
  await expect(page.getByText('Register')).toBeVisible()

  const btn = page.getByText('Login')
  await btn.click()
  await expect(page.getByText('Home')).toBeVisible()
});