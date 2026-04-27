import { test, expect } from '@playwright/test'
import { screenshot } from './helpers'

/**
 * PREVIOUS BIDS TEST PACK
 */

test.describe('Previous Bids — Auth guard', () => {
  test('redirects /previous-bids to login when unauthenticated', async ({ page }) => {
    await page.goto('/previous-bids')
    await page.waitForURL(/login/, { timeout: 10000 })
    await screenshot(page, 'previous-bids-redirect')
    await expect(page).toHaveURL(/login/)
  })
})
