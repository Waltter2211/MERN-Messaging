import { test, expect } from '@playwright/test';

test('Logging in works', async ({ page }) => {
  await page.goto('http://localhost:5000/login')

  await expect(page.getByTestId('test-login-header')).toBeVisible()
  await expect(page.getByText('Email')).toBeVisible()
  await expect(page.getByText('Password')).toBeVisible()
  await expect(page.getByText('Log in')).toBeVisible()
  await expect(page.getByText('Home')).toBeVisible()

  await page.getByTestId('test-login-email-input').fill('testuser@gmail.com')
  await page.getByTestId('test-login-password-input').fill('testpass')
  await page.getByTestId('test-login-btn').click()

  await expect(page.getByText('No current active chatrooms')).toBeVisible()
  await page.getByTestId('test-logout-btn').click()
});