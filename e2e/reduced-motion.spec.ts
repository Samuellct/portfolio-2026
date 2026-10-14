import { expect, test, type Page } from '@playwright/test'

// Reduced motion switched on while the page is open (V6-BKL-75), and the
// V5 Phase 15 check 8 (V6-BKL-76): no pins, every animated part at its final state.
const ABOUT_SECTIONS = ['about-intro', 'about-experience', 'about-stack', 'about-education', 'about-interests']
const ABOUT_SCOPE = ABOUT_SECTIONS.map((id) => `#${id}`).join(', ')

function aboutState(page: Page) {
  return page.$$eval(ABOUT_SCOPE, (sections) => {
    const effectiveOpacity = (el: Element) => {
      let opacity = 1
      for (let a: Element | null = el; a; a = a.parentElement) opacity *= Number(getComputedStyle(a).opacity)
      return opacity
    }
    const blocks = sections.flatMap((s) => [...s.querySelectorAll('h2, h3, p, li')])
    const styled = sections.flatMap((s) => [...s.querySelectorAll<HTMLElement>('[style]')])
    return {
      pins: document.querySelectorAll('.pin-spacer').length,
      hiddenBlocks: blocks.filter((el) => effectiveOpacity(el) < 0.99).length,
      blocks: blocks.length,
      // progress-driven translateX/Y in px left above 0 (layout translates use %)
      offset: styled.filter((el) => /translate[XY]\(-?(?!0px\))[\d.]+px\)/.test(el.style.transform)).length,
      lineHeight: document.querySelector<HTMLElement>('#about-education [style*="height"]')?.style.height ?? null,
    }
  })
}

test('About: reduced motion switched on mid-page drops pins and shows final state', async ({ page }, info) => {
  test.setTimeout(60_000)
  await page.goto('/fr/about', { waitUntil: 'networkidle' })
  await page.mouse.move(info.project.name === 'mobile' ? 195 : 720, 400)
  for (let i = 0; i < 8; i++) {
    await page.mouse.wheel(0, 150)
    await page.waitForTimeout(120)
  }

  const before = await aboutState(page)
  if (info.project.name === 'desktop') expect(before.pins, 'pins before the switch').toBeGreaterThan(0)
  expect(before.hiddenBlocks, 'content still to play before the switch').toBeGreaterThan(0)

  await page.emulateMedia({ reducedMotion: 'reduce' })
  await page.waitForTimeout(500)

  const after = await aboutState(page)
  expect(after.pins, 'pins after the switch').toBe(0)
  expect(after.hiddenBlocks, `hidden blocks out of ${after.blocks}`).toBe(0)
  expect(after.offset, 'elements still offset by an animation').toBe(0)
  expect(after.lineHeight, 'education timeline').toBe('100%')
})

test('Projects listing: reduced motion switched on mid-page stops the parallax', async ({ page }, info) => {
  await page.goto('/fr/projects', { waitUntil: 'networkidle' })
  await page.mouse.move(info.project.name === 'mobile' ? 195 : 720, 400)
  for (let i = 0; i < 6; i++) {
    await page.mouse.wheel(0, 200)
    await page.waitForTimeout(120)
  }
  // horizontal parallax offset (the Tailwind -translate-y-1/2 stays)
  const shiftX = () =>
    page.$eval('[data-watermark]', (el) => new DOMMatrixReadOnly(getComputedStyle(el).transform).m41)
  expect(Math.abs(await shiftX()), 'parallax offset before the switch').toBeGreaterThan(1)

  await page.emulateMedia({ reducedMotion: 'reduce' })
  await page.waitForTimeout(500)

  expect(await shiftX(), 'parallax offset after the switch').toBe(0)
  const title = page.locator('main h1').first()
  await expect(title).toHaveCSS('opacity', '1')
  await expect(title).toHaveCSS('transform', /^(none|matrix\(1, 0, 0, 1, 0, 0\))$/)
})
