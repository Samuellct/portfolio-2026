import { expect, test } from '@playwright/test'
import { getTechColor } from '../src/lib/technologies'

// V6-DES-11: every Extended Toolkit tag shown on About fills with its brand
// colour on hover, none with the grey fallback.
const FALLBACK = '#6b7280'

test('About stack: every tag shown has a brand colour', async ({ page }) => {
  await page.goto('/fr/about')
  const names = await page.$$eval('[data-tech]', (nodes) => nodes.map((n) => n.getAttribute('data-tech') ?? ''))
  expect(names.length, 'tags are rendered').toBeGreaterThan(0)
  const grey = names.filter((n) => getTechColor(n) === FALLBACK)
  expect(grey, 'tags without a brand colour').toEqual([])
})
