import { Page, expect } from '@playwright/test'

/**
 * Navigate to login page and fill in credentials.
 * For E2E tests we use a real Supabase test account if env vars are set,
 * otherwise we just verify the form renders correctly.
 */
export async function navigateToLogin(page: Page) {
  await page.goto('/login')
  await page.waitForLoadState('networkidle')
}

/** Wait for a toast/sonner notification to appear */
export async function waitForToast(page: Page, text: string | RegExp) {
  await expect(page.locator('[data-sonner-toast]').filter({ hasText: text }))
    .toBeVisible({ timeout: 10000 })
}

/** Fill an input by its label text */
export async function fillByLabel(page: Page, labelText: string, value: string) {
  await page.getByLabel(labelText, { exact: false }).fill(value)
}

/** Check that the page title is correct */
export async function expectPageTitle(page: Page, title: string) {
  await expect(page).toHaveTitle(new RegExp(title, 'i'))
}

/** Take a screenshot and attach to test report */
export async function screenshot(page: Page, name: string) {
  await page.screenshot({ path: `tests/screenshots/${name}.png`, fullPage: true })
}
