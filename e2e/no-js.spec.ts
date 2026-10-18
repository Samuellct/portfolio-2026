import { expect, test } from '@playwright/test'
import { visibleTextStats } from './helpers'

test.use({ javaScriptEnabled: false })

type Case = {
  path: string
  // visible text blocks in <main> measured on 2026-10-14; raise them when a phase fixes a page
  floor: { desktop: number; mobile: number }
  // V6 roadmap phase that should make every block visible without JavaScript ('done' once it has)
  fixedBy: string
}

const CASES: Case[] = [
  { path: '/fr', floor: { desktop: 10, mobile: 13 }, fixedBy: 'done' },
  { path: '/fr/projects', floor: { desktop: 34, mobile: 34 }, fixedBy: 'done' },
  { path: '/fr/projects/personal/alpine-route', floor: { desktop: 25, mobile: 20 }, fixedBy: 'done' },
  { path: '/fr/contact', floor: { desktop: 6, mobile: 6 }, fixedBy: 'done' },
  { path: '/fr/about', floor: { desktop: 15, mobile: 10 }, fixedBy: 'V7' },
]

async function stats(page: import('@playwright/test').Page, path: string) {
  await page.goto(path, { waitUntil: 'load' })
  // let the 250 ms CSS page fade settle
  await page.waitForTimeout(600)
  return visibleTextStats(page)
}

for (const { path, floor, fixedBy } of CASES) {
  test(`no-JS floor ${path}`, async ({ page }, info) => {
    const s = await stats(page, path)
    const min = info.project.name === 'mobile' ? floor.mobile : floor.desktop
    expect(s.total).toBeGreaterThan(0)
    expect(s.visible, `visible text blocks (hidden: ${s.hidden.join(' | ')})`).toBeGreaterThanOrEqual(min)
  })

  // Without JavaScript, nothing is hidden beyond the blocks the JS page also
  // leaves out with display:none (responsive duplicates)
  test(`no-JS all text visible ${path}`, async ({ page, browser }, info) => {
    if (fixedBy !== 'done') {
      test.info().annotations.push({ type: 'issue', description: `expected to fail until ${fixedBy}` })
      test.fail()
    }
    const s = await stats(page, path)
    const ctx = await browser.newContext({ ...info.project.use, javaScriptEnabled: true })
    const withJs = await stats(await ctx.newPage(), path)
    await ctx.close()
    expect(s.hidden.filter((text) => !withJs.undisplayed.includes(text))).toEqual([])
  })
}
