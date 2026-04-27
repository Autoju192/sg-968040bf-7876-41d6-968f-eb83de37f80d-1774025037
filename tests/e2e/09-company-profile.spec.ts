import { test, expect } from '@playwright/test'
import { screenshot } from './helpers'

/**
 * COMPANY PROFILE TEST PACK
 */

test.describe('Company Profile — Auth guard', () => {
  test('redirects /company-profile to login when unauthenticated', async ({ page }) => {
    await page.goto('/company-profile')
    await page.waitForURL(/login/, { timeout: 10000 })
    await screenshot(page, 'company-profile-redirect')
    await expect(page).toHaveURL(/login/)
  })
})
