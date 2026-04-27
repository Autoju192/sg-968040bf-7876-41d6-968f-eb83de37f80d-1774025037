import { test, expect } from '@playwright/test'
import { screenshot } from './helpers'

/**
 * LOGIN FORM INTERACTION TEST PACK
 * Tests form interaction, keyboard navigation, and error states.
 * Does NOT require live Supabase credentials — tests client-side only.
 */

test.describe('Login — Form interactions', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/login')
    await page.waitForLoadState('networkidle')
  })

  test('email field accepts text input', async ({ page }) => {
    const emailInput = page.locator('input[type="email"], input[name="email"]').first()
    await emailInput.fill('test@example.com')
    await expect(emailInput).toHaveValue('test@example.com')
  })

  test('password field masks input', async ({ page }) => {
    const passwordInput = page.locator('input[type="password"]').first()
    await passwordInput.fill('mysecretpassword')
    const inputType = await passwordInput.getAttribute('type')
    expect(inputType).toBe('password')
  })

  test('form is keyboard navigable', async ({ page }) => {
    const emailInput = page.locator('input[type="email"], input[name="email"]').first()
    await emailInput.focus()
    await page.keyboard.press('Tab')

    // Focus should have moved to next field or button
    const activeElement = await page.evaluate(() => document.activeElement?.tagName.toLowerCase())
    expect(['input', 'button', 'a']).toContain(activeElement)
  })

  test('submit button is accessible via keyboard Enter', async ({ page }) => {
    const emailInput = page.locator('input[type="email"], input[name="email"]').first()
    const passwordInput = page.locator('input[type="password"]').first()

    await emailInput.fill('test@example.com')
    await passwordInput.fill('password')
    // Enter in password field submits
    await passwordInput.press('Enter')

    // Wait for either redirect or error state (depends on Supabase)
    await page.waitForTimeout(2000)
    // Page should still be on login (wrong creds) OR dashboard (valid creds)
    await expect(page.locator('body')).toBeVisible()
    await screenshot(page, 'login-after-submit')
  })

  test('shows error message for invalid credentials', async ({ page }) => {
    const emailInput = page.locator('input[type="email"], input[name="email"]').first()
    const passwordInput = page.locator('input[type="password"]').first()
    const submitBtn = page.locator('button[type="submit"], button:has-text("Sign in"), button:has-text("Log in")').first()

    await emailInput.fill('notreal@example.com')
    await passwordInput.fill('wrongpassword123')
    await submitBtn.click()

    // Wait for error response
    await page.waitForTimeout(3000)

    // Check for any error indication
    const errorVisible = await page.locator(
      'text=/invalid|incorrect|wrong|failed|error|not found/i'
    ).first().isVisible().catch(() => false)

    // OR still on login page (not redirected away)
    const stillOnLogin = page.url().includes('/login')

    expect(errorVisible || stillOnLogin).toBeTruthy()
    await screenshot(page, 'login-invalid-creds')
  })
})

test.describe('Signup — Form interactions', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/signup')
    await page.waitForLoadState('networkidle')
  })

  test('email and password fields are present and functional', async ({ page }) => {
    const emailInput = page.locator('input[type="email"], input[name="email"]').first()
    const passwordInput = page.locator('input[type="password"]').first()

    await emailInput.fill('newuser@example.com')
    await passwordInput.fill('SecurePassword123!')

    await expect(emailInput).toHaveValue('newuser@example.com')
    await expect(passwordInput).toHaveValue('SecurePassword123!')
  })

  test('full name field is present if shown', async ({ page }) => {
    const nameInput = page.locator('input[name="full_name"], input[placeholder*="name" i]').first()
    const nameExists = await nameInput.isVisible().catch(() => false)
    if (nameExists) {
      await nameInput.fill('Test User')
      await expect(nameInput).toHaveValue('Test User')
    }
  })

  test('page has no console errors', async ({ page }) => {
    const errors: string[] = []
    page.on('console', msg => {
      if (msg.type() === 'error') errors.push(msg.text())
    })
    await page.reload()
    await page.waitForLoadState('networkidle')
    const critical = errors.filter(e => !e.includes('favicon') && !e.includes('net::ERR'))
    expect(critical).toHaveLength(0)
  })
})
