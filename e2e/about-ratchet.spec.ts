import { expect, test, type Page } from '@playwright/test'

// AUDIT-079: on desktop the About sections are pinned and play once; content
// already revealed never fades back, even when scrolling up.
const SECTIONS = ['about-experience', 'about-stack', 'about-education', 'about-interests']
const BLOCKS = SECTIONS.map((id) => `#${id} :is(h2, h3, p, li)`).join(', ')
const TOLERANCE = 0.02

function opacities(page: Page) {
  return page.$$eval(BLOCKS, (nodes) =>
    nodes.map((el) => {
      let opacity = 1
      for (let a: Element | null = el; a; a = a.parentElement) {
        opacity *= Number(getComputedStyle(a).opacity)
      }
      return opacity
    }),
  )
}

test('About ratchet: revealed content never fades back', async ({ page }, info) => {
  test.skip(info.project.name !== 'desktop', 'pins only run on desktop')
  test.setTimeout(120_000)

  await page.goto('/fr/about', { waitUntil: 'networkidle' })
  await page.mouse.move(720, 450)

  const max = await opacities(page)
  const start = [...max]
  const drops: string[] = []

  const step = async (dy: number, label: string) => {
    await page.mouse.wheel(0, dy)
    await page.waitForTimeout(120)
    const now = await opacities(page)
    expect(now.length, 'block count is stable').toBe(max.length)
    now.forEach((o, i) => {
      if (o < max[i] - TOLERANCE) drops.push(`${label}: block ${i} ${max[i].toFixed(2)} -> ${o.toFixed(2)}`)
      max[i] = Math.max(max[i], o)
    })
  }

  // down through the first pins, back up, then down again and up to the top
  for (let i = 0; i < 25; i++) await step(150, `down ${i}`)
  for (let i = 0; i < 12; i++) await step(-150, `up ${i}`)
  for (let i = 0; i < 40; i++) await step(150, `down again ${i}`)
  for (let i = 0; i < 40; i++) await step(-200, `up again ${i}`)

  // the test must have seen something play, or it proves nothing
  expect(start.some((o) => o < 0.5), 'some content starts hidden').toBe(true)
  expect(max.filter((o) => o > 0.98).length, 'content got revealed').toBeGreaterThan(5)
  expect(drops, 'opacity drops').toEqual([])
})
