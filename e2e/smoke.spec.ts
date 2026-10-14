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

test('unknown page answers 404 without page errors', async ({ page }) => {
  const errors: string[] = []
  page.on('pageerror', (err) => errors.push(err.message))

  const response = await page.goto('/fr/nexiste-pas', { waitUntil: 'networkidle' })
  expect(response?.status()).toBe(404)
  await expect(page.locator('html')).toHaveAttribute('lang', 'fr')
  await expect(page.locator('meta[name="robots"]')).toHaveAttribute('content', /noindex/)
  expect(errors, 'page errors').toEqual([])
})
