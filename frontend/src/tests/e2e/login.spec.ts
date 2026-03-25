/**
 * E2E Test 1 — Login Flow
 *
 * Covers:
 *  - Unauthenticated users are redirected to /login
 *  - Validation errors show on empty submit
 *  - Wrong credentials show an API error
 *  - Valid credentials log in and redirect to /dashboard
 *  - Logout returns user to /login
 */
import { test, expect } from '@playwright/test'

// ── Shared test credentials ───────────────────────────────────────────────────
// Change these to match a real account in your local MongoDB
const TEST_EMAIL    = 'test@example.com'
const TEST_PASSWORD = 'password123'

test.describe('Login flow', () => {

  test('redirects unauthenticated user from / to /login', async ({ page }) => {
    await page.goto('/')
    await expect(page).toHaveURL(/\/login/)
  })

  test('shows validation errors when form is submitted empty', async ({ page }) => {
    await page.goto('/login')

    // Submit without filling anything
    await page.getByRole('button', { name: /sign in/i }).click()

    await expect(page.getByText('Email is required')).toBeVisible()
    await expect(page.getByText('Password is required')).toBeVisible()
  })

  test('shows error for invalid email format', async ({ page }) => {
    await page.goto('/login')

    await page.getByLabel(/email address/i).fill('not-an-email')
    await page.getByLabel(/password/i).fill('password123')
    await page.getByRole('button', { name: /sign in/i }).click()

    await expect(page.getByText('Enter a valid email')).toBeVisible()
  })

  test('shows API error for wrong credentials', async ({ page }) => {
    await page.goto('/login')

    await page.getByLabel(/email address/i).fill('wrong@example.com')
    await page.getByLabel(/password/i).fill('wrongpassword')
    await page.getByRole('button', { name: /sign in/i }).click()

    // Wait for the API response error message
    await expect(page.getByText(/invalid credentials|login failed/i)).toBeVisible({ timeout: 8000 })
  })

  test('logs in with valid credentials and lands on dashboard', async ({ page }) => {
    await page.goto('/login')

    await page.getByLabel(/email address/i).fill(TEST_EMAIL)
    await page.getByLabel(/password/i).fill(TEST_PASSWORD)
    await page.getByRole('button', { name: /sign in/i }).click()

    // Should redirect to dashboard
    await expect(page).toHaveURL(/\/dashboard/, { timeout: 8000 })
    await expect(page.getByText(/overview/i)).toBeVisible()
  })

  test('logout returns user to login page', async ({ page }) => {
    // Log in first
    await page.goto('/login')
    await page.getByLabel(/email address/i).fill(TEST_EMAIL)
    await page.getByLabel(/password/i).fill(TEST_PASSWORD)
    await page.getByRole('button', { name: /sign in/i }).click()
    await expect(page).toHaveURL(/\/dashboard/, { timeout: 8000 })

    // Click logout
    await page.getByRole('button', { name: /logout|sign out/i }).click()
    await expect(page).toHaveURL(/\/login/)
  })

})
