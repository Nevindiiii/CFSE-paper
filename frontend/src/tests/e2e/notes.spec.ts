/**
 * E2E Test 2 — Create Note Flow
 *
 * Covers:
 *  - Notes page loads and shows the Add Note button
 *  - Add Note modal opens with correct title
 *  - Validation errors show on empty submit
 *  - Filling the form and saving creates a new note card
 *  - New note appears in the list with correct title and status
 */
import { test, expect } from '@playwright/test'

const TEST_EMAIL    = 'test@example.com'
const TEST_PASSWORD = 'password123'

// Helper — log in and navigate to /notes
async function loginAndGoToNotes(page: import('@playwright/test').Page) {
  await page.goto('/login')
  await page.getByLabel(/email address/i).fill(TEST_EMAIL)
  await page.getByLabel(/password/i).fill(TEST_PASSWORD)
  await page.getByRole('button', { name: /sign in/i }).click()
  await expect(page).toHaveURL(/\/dashboard/, { timeout: 8000 })
  await page.goto('/notes')
  await expect(page.getByRole('button', { name: /add note/i })).toBeVisible()
}

test.describe('Create note flow', () => {

  test('notes page loads with Add Note button', async ({ page }) => {
    await loginAndGoToNotes(page)
    await expect(page.getByRole('button', { name: /add note/i })).toBeEnabled()
  })

  test('clicking Add Note opens the modal', async ({ page }) => {
    await loginAndGoToNotes(page)

    await page.getByRole('button', { name: /add note/i }).click()

    // Modal heading should say "Add Note"
    await expect(page.getByRole('heading', { name: /add note/i })).toBeVisible()
  })

  test('shows validation errors when modal is submitted empty', async ({ page }) => {
    await loginAndGoToNotes(page)

    await page.getByRole('button', { name: /add note/i }).click()

    // Submit without filling anything
    await page.getByRole('button', { name: /^add note$/i }).click()

    await expect(page.getByText('Title is required')).toBeVisible()
    await expect(page.getByText('Due date is required')).toBeVisible()
  })

  test('creates a new note and it appears in the list', async ({ page }) => {
    await loginAndGoToNotes(page)

    const noteTitle = `E2E Note ${Date.now()}`

    // Open modal
    await page.getByRole('button', { name: /add note/i }).click()

    // Fill form
    await page.getByLabel(/title/i).fill(noteTitle)
    await page.getByLabel(/description/i).fill('Created by Playwright E2E test')
    await page.getByLabel(/due date/i).fill('2025-12-31')

    // Save
    await page.getByRole('button', { name: /^add note$/i }).click()

    // Modal should close and note should appear in the grid
    await expect(page.getByRole('heading', { name: /add note/i })).not.toBeVisible()
    await expect(page.getByText(noteTitle)).toBeVisible({ timeout: 8000 })
  })

  test('new note shows correct Pending status badge', async ({ page }) => {
    await loginAndGoToNotes(page)

    const noteTitle = `Status Test ${Date.now()}`

    await page.getByRole('button', { name: /add note/i }).click()
    await page.getByLabel(/title/i).fill(noteTitle)
    await page.getByLabel(/due date/i).fill('2025-12-31')
    // Leave status as default (Pending)
    await page.getByRole('button', { name: /^add note$/i }).click()

    // Find the card and check its badge
    const card = page.locator('text=' + noteTitle).locator('../..')
    await expect(card.getByText('Pending')).toBeVisible({ timeout: 8000 })
  })

})
