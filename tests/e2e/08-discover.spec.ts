import { test, expect } from '@playwright/test'
import { screenshot } from './helpers'

/**
 * DISCOVER TENDERS TEST PACK
 */

test.describe('Discover Tenders — Auth guard', () => {
  test('redirects /discover to login when unauthenticated', async ({ page }) => {
    await page.goto('/discover')
    await page.waitForURL(/login/, { timeout: 10000 })
    await screenshot(page, 'discover-redirect')
    await expect(page).toHaveURL(/login/)
  })
})

test.describe('Discover API — Response structure', () => {
  test('GET /api/discover returns 401 without auth', async ({ page }) => {
    const response = await page.request.get('/api/discover?keyword=care')
    expect(response.status()).toBe(401)
    const body = await response.json()
    expect(body).toHaveProperty('error')
  })
})
