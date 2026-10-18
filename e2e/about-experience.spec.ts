import { expect, test } from '@playwright/test'

// V6-ABT-05, V6-ABT-06: the other work experience opens from the keyboard,
// keeps the focus and never hides what the section already revealed.
test('About experience: the disclosure opens from the keyboard', async ({ page }) => {
  await page.goto('/fr/about')
  const section = page.locator('#about-experience')
  const others = section.locator('details li')
  await expect(others.first()).toBeHidden()

  const summary = section.locator('summary')
  await summary.focus()
  await page.keyboard.press('Enter')

  await expect(section.locator('details')).toHaveAttribute('open', '')
  await expect(others).toHaveCount(4)
  await expect(others.first()).toBeVisible()
  await expect(summary).toBeFocused()
  // Opening plays the section: every card is shown at its final state
  for (const card of await section.locator('[data-experience]').all()) {
    await expect(card).toHaveCSS('opacity', '1')
  }
})
