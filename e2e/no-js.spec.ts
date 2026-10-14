import { expect, test } from '@playwright/test'
import { visibleTextStats } from './helpers'

test.use({ javaScriptEnabled: false })

type Case = {
  path: string
  // visible text blocks in <main> measured on 2026-10-14; raise them when a phase fixes a page
  floor: { desktop: number; mobile: number }
  // V6 roadmap phase that should make every block visible without JavaScript
  fixedBy: string
}

const CASES: Case[] = [
  { path: '/fr', floor: { desktop: 10, mobile: 13 }, fixedBy: 'phase 15' },
  { path: '/fr/projects', floor: { desktop: 3, mobile: 3 }, fixedBy: 'phase 12' },
  { path: '/fr/projects/personal/alpine-route', floor: { desktop: 7, mobile: 2 }, fixedBy: 'phase 08' },
  { path: '/fr/contact', floor: { desktop: 0, mobile: 0 }, fixedBy: 'phase 11' },
  { path: '/fr/about', floor: { desktop: 15, mobile: 10 }, fixedBy: 'phase 13' },
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

  test(`no-JS all text visible ${path}`, async ({ page }) => {
    test.info().annotations.push({ type: 'issue', description: `expected to fail until ${fixedBy}` })
    test.fail()
    const s = await stats(page, path)
    expect(s.hidden).toEqual([])
  })
}
