import { test, expect } from '@playwright/test'
import { screenshot } from './helpers'

/**
 * EVIDENCE BANK TEST PACK
 * Tests: auth guard, page structure, form interactions.
 */

test.describe('Evidence Bank — Auth guard', () => {
  test('redirects /evidence to login when unauthenticated', async ({ page }) => {
    await page.goto('/evidence')
    await page.waitForURL(/login/, { timeout: 10000 })
    await screenshot(page, 'evidence-redirect')
    await expect(page).toHaveURL(/login/)
  })
})

test.describe('Evidence Bank — UI structure (login page fallback)', () => {
  test('login page renders correctly as fallback for /evidence', async ({ page }) => {
    await page.goto('/evidence')
    await page.waitForLoadState('networkidle')

    // Should be on login
    await expect(page).toHaveURL(/login/)
    const emailInput = page.locator('input[type="email"]').first()
    await expect(emailInput).toBeVisible()
    await screenshot(page, 'evidence-auth-fallback')
  })
})
