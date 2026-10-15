import { expect, test } from '@playwright/test'
import { PAGES } from './helpers'

for (const path of PAGES) {
  test(`smoke ${path}`, async ({ page }) => {
    const errors: string[] = []
    page.on('console', (msg) => {
      if (msg.type() === 'error') errors.push(msg.text())
    })
    page.on('pageerror', (err) => errors.push(err.message))

    const response = await page.goto(path, { waitUntil: 'networkidle' })
    expect(response?.status()).toBe(200)
    await expect(page.locator('html')).toHaveAttribute('lang', path.slice(1, 3))
    await expect(page.locator('main h1').first()).toBeAttached()

    const overflow = await page.evaluate(
      () => document.documentElement.scrollWidth - window.innerWidth,
    )
    expect(overflow, 'horizontal overflow in px').toBeLessThanOrEqual(0)
    expect(errors, 'console errors').toEqual([])
  })
}

test('field web vitals reach the endpoint', async ({ page }) => {
  // TTFB and FCP are sent soon after the load, without waiting for the page to hide
  const beacon = page.waitForResponse((r) => r.url().endsWith('/api/vitals') && r.request().method() === 'POST')
  await page.goto('/fr', { waitUntil: 'networkidle' })
  const response = await beacon
  expect(response.status()).toBe(204)
  const sent = JSON.parse(response.request().postData() ?? '{}')
  expect(sent).toMatchObject({ landing: '/fr', path: '/fr' })
  expect(Object.keys(sent).sort()).toEqual(
    ['landing', 'name', 'navigationType', 'path', 'rating', 'screen', 'v', 'value'],
  )
})

test('vitals endpoint rejects what it does not expect', async ({ request }) => {
  const post = (data: unknown) => request.post('/api/vitals', { data })
  expect((await post({ name: 'CLS', value: 0.01, path: '/fr', landing: '/fr' })).status()).toBe(204)
  expect((await post({ name: 'CPU', value: 1, path: '/fr', landing: '/fr' })).status()).toBe(400)
  expect((await post({ name: 'CLS', value: 0.01, path: 'https://x.test', landing: '/fr' })).status()).toBe(400)
  expect((await post({ name: 'CLS', value: 0.01, path: '/fr', landing: '/fr', pad: 'x'.repeat(2000) })).status()).toBe(413)
})

test('unknown page answers 404 without page errors', async ({ page }) => {
  const errors: string[] = []
  page.on('pageerror', (err) => errors.push(err.message))

  const response = await page.goto('/fr/nexiste-pas', { waitUntil: 'networkidle' })
  expect(response?.status()).toBe(404)
  await expect(page.locator('html')).toHaveAttribute('lang', 'fr')
  await expect(page.locator('meta[name="robots"]')).toHaveAttribute('content', /noindex/)
  expect(errors, 'page errors').toEqual([])
})
