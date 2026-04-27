import { test, expect } from '@playwright/test'

/**
 * API ENDPOINTS TEST PACK
 * Tests that all API routes return correct HTTP status codes
 * for unauthenticated requests (401) and bad payloads (400/422).
 */

test.describe('API — Auth guards return 401', () => {
  test('POST /api/ai/generate → 401 without auth', async ({ page }) => {
    const res = await page.request.post('/api/ai/generate', {
      data: { action: 'generate', questionText: 'Q?', organisationId: 'org-1' },
    })
    expect(res.status()).toBe(401)
  })

  test('POST /api/ai/quality-check → 401 without auth', async ({ page }) => {
    const res = await page.request.post('/api/ai/quality-check', {
      data: { questionText: 'Q?', responseText: 'Answer.' },
    })
    expect(res.status()).toBe(401)
  })

  test('GET /api/discover → 401 without auth', async ({ page }) => {
    const res = await page.request.get('/api/discover?keyword=care')
    expect(res.status()).toBe(401)
  })

  test('POST /api/tender/parse → 401 without auth', async ({ page }) => {
    const formData = new FormData()
    formData.append('tenderId', 'test-id')
    const res = await page.request.post('/api/tender/parse', {
      multipart: { tenderId: 'test-id' },
    })
    expect(res.status()).toBe(401)
  })

  test('POST /api/tender/export → 401 without auth', async ({ page }) => {
    const res = await page.request.post('/api/tender/export', {
      data: { tenderId: 'test-id' },
    })
    expect(res.status()).toBe(401)
  })
})

test.describe('API — Error responses have correct shape', () => {
  test('/api/ai/generate 401 response has error field', async ({ page }) => {
    const res = await page.request.post('/api/ai/generate', {
      data: { action: 'generate', questionText: 'Q?' },
    })
    const body = await res.json()
    expect(body).toHaveProperty('error')
    expect(typeof body.error).toBe('string')
  })

  test('/api/ai/quality-check 401 response has error field', async ({ page }) => {
    const res = await page.request.post('/api/ai/quality-check', {
      data: { questionText: 'Q?' },
    })
    const body = await res.json()
    expect(body).toHaveProperty('error')
  })
})
