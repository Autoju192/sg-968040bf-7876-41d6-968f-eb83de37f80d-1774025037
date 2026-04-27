import { test, expect } from '@playwright/test'
import { screenshot } from './helpers'

/**
 * BID LIBRARY TEST PACK
 */

test.describe('Bid Library — Auth guard', () => {
  test('redirects /bid-library to login when unauthenticated', async ({ page }) => {
    await page.goto('/bid-library')
    await page.waitForURL(/login/, { timeout: 10000 })
    await screenshot(page, 'bid-library-redirect')
    await expect(page).toHaveURL(/login/)
  })
})
