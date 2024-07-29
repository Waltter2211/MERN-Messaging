import { test, expect } from '@playwright/test';

test('Loading landing page works', async ({ page }) => {
  await page.goto('http://localhost:5000/')
  await expect(page.getByText('Mern')).toBeVisible()
  await expect(page.getByText('Login')).toBeVisible()
  await expect(page.getByText('Register')).toBeVisible()
});

test('Landing page navigation to login page works', async ({ page }) => {
  await page.goto('http://localhost:5000/')
  const btn = page.getByText('Login')
  await btn.click()
  await expect(page.getByTestId('test-login-header')).toBeVisible()
  await expect(page.getByText('Email')).toBeVisible()
  await expect(page.getByText('Password')).toBeVisible()
  await expect(page.getByTestId('test-login-btn')).toBeVisible()
  await expect(page.getByText('Home')).toBeVisible()
  const homeBtn = page.getByText('Home')
  await homeBtn.click()
  await expect(page.getByText('Mern')).toBeVisible()
})

test('Landing page navigation to register page works', async ({ page }) => {
  await page.goto('http://localhost:5000/')
  const btn = page.getByText('Register')
  await btn.click()
  await expect(page.getByTestId('test-register-header')).toBeVisible()
  await expect(page.getByText('Name')).toBeVisible()
  await expect(page.getByText('Email')).toBeVisible()
  await expect(page.getByText('Password')).toBeVisible()
  await expect(page.getByTestId('test-register-btn')).toBeVisible()
  await expect(page.getByText('Home')).toBeVisible()
  const homeBtn = page.getByText('Home')
  await homeBtn.click()
  await expect(page.getByText('Mern')).toBeVisible()
})