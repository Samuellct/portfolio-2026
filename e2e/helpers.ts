import type { Page } from '@playwright/test'

export const PAGES = [
  '/fr',
  '/fr/about',
  '/fr/projects',
  '/fr/contact',
  '/en',
  '/fr/projects/personal/alpine-route',
  '/en/projects/academic/data-analysis',
] as const

const TEXT_SELECTOR = 'main h1, main h2, main h3, main p, main li'

/**
 * Counts the text blocks inside <main> and how many a reader can see: laid out,
 * not `visibility: hidden`, and with an effective opacity (product over the
 * ancestors) above 0.05. Works with JavaScript disabled.
 */
export async function visibleTextStats(page: Page, selector = TEXT_SELECTOR) {
  return page.$$eval(selector, (nodes) => {
    const blocks = nodes.filter((n) => (n.textContent ?? '').trim().length > 0)
    const hidden: string[] = []
    for (const el of blocks) {
      const rect = el.getBoundingClientRect()
      let opacity = 1
      let invisible = getComputedStyle(el).visibility === 'hidden'
      for (let a: Element | null = el; a; a = a.parentElement) {
        const style = getComputedStyle(a)
        opacity *= Number(style.opacity)
        if (style.display === 'none') invisible = true
      }
      if (invisible || opacity <= 0.05 || rect.width === 0 || rect.height === 0) {
        hidden.push((el.textContent ?? '').trim().slice(0, 40))
      }
    }
    return { total: blocks.length, visible: blocks.length - hidden.length, hidden }
  })
}
