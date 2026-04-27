import { test, expect } from '@playwright/test'
import { screenshot } from './helpers'

/**
 * AUTH FLOW TEST PACK
 * Tests: login page render, signup page render, form validation,
 * auth guards (redirect unauthenticated users), navigation between pages.
 * NOTE: Actual Supabase sign-in requires a live test account.
 * These tests verify UI/UX and client-side validation without credentials.
 */

test.describe('Auth — Login page', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/login')
    await page.waitForLoadState('networkidle')
  })

  test('renders login page with correct elements', async ({ page }) => {
    await screenshot(page, 'auth-login')

    // Check heading or brand text
    await expect(page.locator('h1, h2').first()).toBeVisible()

    // Email input
    const emailInput = page.locator('input[type="email"], input[name="email"], input[placeholder*="email" i]').first()
    await expect(emailInput).toBeVisible()

    // Password input
    const passwordInput = page.locator('input[type="password"]').first()
    await expect(passwordInput).toBeVisible()

    // Submit button
    const submitBtn = page.locator('button[type="submit"], button:has-text("Sign in"), button:has-text("Log in")').first()
    await expect(submitBtn).toBeVisible()
  })

  test('shows validation feedback for empty form submission', async ({ page }) => {
    const submitBtn = page.locator('button[type="submit"], button:has-text("Sign in"), button:has-text("Log in")').first()
    await submitBtn.click()

    // Either browser native validation or custom error message
    const emailInput = page.locator('input[type="email"], input[name="email"]').first()
    const isInvalid = await emailInput.evaluate(el =>
      (el as HTMLInputElement).validity?.valueMissing || el.getAttribute('aria-invalid') === 'true'
    )
    // Browser should flag email as required or we show an error
    expect(isInvalid || await page.locator('text=/required|invalid|error/i').first().isVisible()).toBeTruthy()
  })

  test('has link to signup page', async ({ page }) => {
    const signupLink = page.locator('a[href*="signup"], a:has-text("sign up"), a:has-text("create account"), a:has-text("register")').first()
    await expect(signupLink).toBeVisible()
    await signupLink.click()
    await page.waitForURL(/signup/)
    await expect(page).toHaveURL(/signup/)
  })

  test('page title includes BidWrite or Login', async ({ page }) => {
    const title = await page.title()
    expect(title.toLowerCase()).toMatch(/bidwrite|login|sign in/)
  })

  test('has no console errors on load', async ({ page }) => {
    const errors: string[] = []
    page.on('console', msg => {
      if (msg.type() === 'error') errors.push(msg.text())
    })
    await page.reload()
    await page.waitForLoadState('networkidle')
    // Filter known non-critical errors
    const critical = errors.filter(e =>
      !e.includes('favicon') &&
      !e.includes('NEXT_REDIRECT') &&
      !e.includes('net::ERR')
    )
    expect(critical).toHaveLength(0)
  })
})

test.describe('Auth — Signup page', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/signup')
    await page.waitForLoadState('networkidle')
  })

  test('renders signup page with form fields', async ({ page }) => {
    await screenshot(page, 'auth-signup')

    // Email
    const emailInput = page.locator('input[type="email"], input[name="email"], input[placeholder*="email" i]').first()
    await expect(emailInput).toBeVisible()

    // Password
    const passwordInput = page.locator('input[type="password"]').first()
    await expect(passwordInput).toBeVisible()

    // Submit
    const submitBtn = page.locator('button[type="submit"], button:has-text("Sign up"), button:has-text("Create account")').first()
    await expect(submitBtn).toBeVisible()
  })

  test('has link back to login page', async ({ page }) => {
    const loginLink = page.locator('a[href*="login"], a:has-text("sign in"), a:has-text("log in")').first()
    await expect(loginLink).toBeVisible()
  })
})

test.describe('Auth — Route protection', () => {
  test('redirects unauthenticated users from / to /login', async ({ page }) => {
    await page.goto('/')
    await page.waitForURL(/login/, { timeout: 10000 })
    await expect(page).toHaveURL(/login/)
  })

  test('redirects unauthenticated users from /dashboard to /login', async ({ page }) => {
    await page.goto('/dashboard')
    await page.waitForURL(/login/, { timeout: 10000 })
    await expect(page).toHaveURL(/login/)
  })

  test('redirects unauthenticated users from /tenders to /login', async ({ page }) => {
    await page.goto('/tenders')
    await page.waitForURL(/login/, { timeout: 10000 })
    await expect(page).toHaveURL(/login/)
  })

  test('redirects unauthenticated users from /evidence to /login', async ({ page }) => {
    await page.goto('/evidence')
    await page.waitForURL(/login/, { timeout: 10000 })
    await expect(page).toHaveURL(/login/)
  })

  test('redirects unauthenticated users from /company-profile to /login', async ({ page }) => {
    await page.goto('/company-profile')
    await page.waitForURL(/login/, { timeout: 10000 })
    await expect(page).toHaveURL(/login/)
  })

  test('redirects unauthenticated users from /bid-library to /login', async ({ page }) => {
    await page.goto('/bid-library')
    await page.waitForURL(/login/, { timeout: 10000 })
    await expect(page).toHaveURL(/login/)
  })

  test('redirects unauthenticated users from /previous-bids to /login', async ({ page }) => {
    await page.goto('/previous-bids')
    await page.waitForURL(/login/, { timeout: 10000 })
    await expect(page).toHaveURL(/login/)
  })

  test('redirects unauthenticated users from /discover to /login', async ({ page }) => {
    await page.goto('/discover')
    await page.waitForURL(/login/, { timeout: 10000 })
    await expect(page).toHaveURL(/login/)
  })
})
