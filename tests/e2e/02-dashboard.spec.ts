import { test, expect } from '@playwright/test'
import { screenshot } from './helpers'

/**
 * DASHBOARD + NAVIGATION TEST PACK
 * Tests layout, sidebar navigation, and stat cards.
 * All tests run as unauthenticated to verify public-facing behaviour (redirect to login).
 * Authenticated tests require a live Supabase test account.
 */

test.describe('Dashboard — Unauthenticated redirect', () => {
  test('redirects /dashboard to /login', async ({ page }) => {
    await page.goto('/dashboard')
    await page.waitForURL(/login/, { timeout: 10000 })
    await screenshot(page, 'dashboard-redirect')
    await expect(page).toHaveURL(/login/)
  })
})

test.describe('Dashboard — Login page as gateway', () => {
  test('login page loads without network errors', async ({ page }) => {
    const networkErrors: string[] = []
    page.on('requestfailed', req => networkErrors.push(req.url()))

    await page.goto('/login')
    await page.waitForLoadState('networkidle')

    // Filter expected failures (favicon, etc.)
    const critical = networkErrors.filter(u => !u.includes('favicon'))
    expect(critical).toHaveLength(0)
  })

  test('login page renders BidWriteIt branding', async ({ page }) => {
    await page.goto('/login')
    await page.waitForLoadState('networkidle')
    await screenshot(page, 'login-page')

    const pageText = await page.textContent('body')
    expect(pageText?.toLowerCase()).toMatch(/bidwrite|bid write|sign in|log in/)
  })

  test('sidebar is NOT visible on login page', async ({ page }) => {
    await page.goto('/login')
    await page.waitForLoadState('networkidle')

    // Sidebar nav links should not be present on auth pages
    const navLinks = page.locator('nav a[href="/dashboard"], a:has-text("Dashboard")').first()
    await expect(navLinks).not.toBeVisible()
  })
})

test.describe('Navigation — Link structure', () => {
  test('all protected routes redirect to login when unauthenticated', async ({ page }) => {
    const protectedRoutes = [
      '/dashboard',
      '/tenders',
      '/tenders/new',
      '/evidence',
      '/bid-library',
      '/previous-bids',
      '/discover',
      '/company-profile',
    ]

    for (const route of protectedRoutes) {
      await page.goto(route)
      await page.waitForURL(/login/, { timeout: 10000 })
      expect(page.url()).toContain('/login')
    }
  })
})
