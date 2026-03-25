/**
 * E2E Test 3 — Edit & Delete Note Flow
 *
 * Covers:
 *  - Edit button opens modal pre-filled with existing note data
 *  - Updating the title and saving reflects the change in the list
 *  - Changing status to "Done" updates the badge
 *  - Delete button opens confirmation dialog
 *  - Confirming delete removes the note from the list
 */
import { test, expect } from '@playwright/test'

const TEST_EMAIL    = 'test@example.com'
const TEST_PASSWORD = 'password123'

// Helper — log in, go to notes, and create a fresh note; returns its title
async function createTestNote(page: import('@playwright/test').Page, title: string) {
  await page.goto('/login')
  await page.getByLabel(/email address/i).fill(TEST_EMAIL)
  await page.getByLabel(/password/i).fill(TEST_PASSWORD)
  await page.getByRole('button', { name: /sign in/i }).click()
  await expect(page).toHaveURL(/\/dashboard/, { timeout: 8000 })

  await page.goto('/notes')
  await page.getByRole('button', { name: /add note/i }).click()
  await page.getByLabel(/title/i).fill(title)
  await page.getByLabel(/due date/i).fill('2025-12-31')
  await page.getByRole('button', { name: /^add note$/i }).click()

  // Wait for the card to appear
  await expect(page.getByText(title)).toBeVisible({ timeout: 8000 })
}

test.describe('Edit note flow', () => {

  test('Edit button opens modal pre-filled with note title', async ({ page }) => {
    const title = `Edit Test ${Date.now()}`
    await createTestNote(page, title)

    // Click the Edit button on that card
    const card = page.locator(`text=${title}`).first().locator('../../..')
    await card.getByRole('button', { name: /edit/i }).click()

    // Modal should say "Edit Note" and title input should be pre-filled
    await expect(page.getByRole('heading', { name: /edit note/i })).toBeVisible()
    await expect(page.getByLabel(/title/i)).toHaveValue(title)
  })

  test('updating the title saves and reflects in the list', async ({ page }) => {
    const originalTitle = `Before Edit ${Date.now()}`
    const updatedTitle  = `After Edit ${Date.now()}`
    await createTestNote(page, originalTitle)

    const card = page.locator(`text=${originalTitle}`).first().locator('../../..')
    await card.getByRole('button', { name: /edit/i }).click()

    // Clear and type new title
    await page.getByLabel(/title/i).clear()
    await page.getByLabel(/title/i).fill(updatedTitle)
    await page.getByRole('button', { name: /save changes/i }).click()

    // Old title gone, new title visible
    await expect(page.getByText(originalTitle)).not.toBeVisible({ timeout: 8000 })
    await expect(page.getByText(updatedTitle)).toBeVisible()
  })

  test('changing status to Done updates the badge', async ({ page }) => {
    const title = `Status Edit ${Date.now()}`
    await createTestNote(page, title)

    const card = page.locator(`text=${title}`).first().locator('../../..')
    await card.getByRole('button', { name: /edit/i }).click()

    // Change status dropdown to "done"
    await page.getByLabel(/status/i).selectOption('done')
    await page.getByRole('button', { name: /save changes/i }).click()

    // Badge should now say "Done"
    await expect(card.getByText('Done')).toBeVisible({ timeout: 8000 })
  })

})

test.describe('Delete note flow', () => {

  test('Delete button shows confirmation dialog', async ({ page }) => {
    const title = `Delete Dialog ${Date.now()}`
    await createTestNote(page, title)

    const card = page.locator(`text=${title}`).first().locator('../../..')
    await card.getByRole('button', { name: /delete/i }).click()

    // Confirmation dialog should appear
    await expect(page.getByText(/delete note\?/i)).toBeVisible()
    await expect(page.getByText(/this action cannot be undone/i)).toBeVisible()
  })

  test('cancelling delete keeps the note in the list', async ({ page }) => {
    const title = `Cancel Delete ${Date.now()}`
    await createTestNote(page, title)

    const card = page.locator(`text=${title}`).first().locator('../../..')
    await card.getByRole('button', { name: /delete/i }).click()

    // Click Cancel
    await page.getByRole('button', { name: /cancel/i }).click()

    // Note should still be there
    await expect(page.getByText(title)).toBeVisible()
  })

  test('confirming delete removes the note from the list', async ({ page }) => {
    const title = `Confirm Delete ${Date.now()}`
    await createTestNote(page, title)

    const card = page.locator(`text=${title}`).first().locator('../../..')
    await card.getByRole('button', { name: /delete/i }).click()

    // Confirm deletion
    await page.getByRole('button', { name: /^delete$/i }).click()

    // Note should be gone
    await expect(page.getByText(title)).not.toBeVisible({ timeout: 8000 })
  })

})
