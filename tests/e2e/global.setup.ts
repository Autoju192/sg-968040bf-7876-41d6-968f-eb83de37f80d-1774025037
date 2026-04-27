import { test as setup } from '@playwright/test'

// Global setup: just verify the dev server is reachable
setup('dev server is up', async ({ page }) => {
  await page.goto('/')
  // Either redirected to /login (auth guard) or we're on login page
  await page.waitForURL(/\/(login|dashboard)/, { timeout: 30000 })
})
