'use client'

import { useEffect, type RefObject } from 'react'

// Modal behaviour for a dialog (AUDIT-053): trap focus inside the panel, close
// on Escape, make the rest of the page inert, and return focus on close to
// `returnFocusRef` (falling back to the previously focused element, then to the
// first link of the bar, when that target is hidden or inert).
export function useModalFocusTrap(
  open: boolean,
  panelRef: RefObject<HTMLElement | null>,
  onClose: () => void,
  returnFocusRef: RefObject<HTMLElement | null>,
) {
  useEffect(() => {
    if (!open) return
    const panel = panelRef.current
    if (!panel) return

    const inertTargets = [
      document.getElementById('main-content'),
      document.querySelector('footer'),
    ].filter((el): el is HTMLElement => el !== null)
    inertTargets.forEach((el) => el.setAttribute('inert', ''))

    const focusable = () =>
      Array.from(
        panel.querySelectorAll<HTMLElement>(
          'a[href], button:not([disabled]), [tabindex]:not([tabindex="-1"])',
        ),
      ).filter((el) => el.getClientRects().length > 0)

    const previousActive = document.activeElement as HTMLElement | null
    const returnTarget = returnFocusRef.current
    focusable()[0]?.focus()

    const onKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        e.preventDefault()
        onClose()
        return
      }
      if (e.key !== 'Tab') return
      const items = focusable()
      if (items.length === 0) return
      const first = items[0]
      const last = items[items.length - 1]
      if (e.shiftKey && document.activeElement === first) {
        e.preventDefault()
        last.focus()
      } else if (!e.shiftKey && document.activeElement === last) {
        e.preventDefault()
        first.focus()
      }
    }
    document.addEventListener('keydown', onKeyDown)

    return () => {
      document.removeEventListener('keydown', onKeyDown)
      inertTargets.forEach((el) => el.removeAttribute('inert'))
      // Defer past React's re-render so the return target's `inert` state is
      // settled before we decide where focus lands.
      requestAnimationFrame(() => {
        const canFocus = (el: HTMLElement | null): el is HTMLElement =>
          !!el &&
          el !== document.body &&
          document.contains(el) &&
          !el.closest('[inert]') &&
          getComputedStyle(el).visibility !== 'hidden' &&
          el.tabIndex > -1
        const target = canFocus(returnTarget)
          ? returnTarget
          : canFocus(previousActive)
            ? previousActive
            : document.querySelector<HTMLElement>('#site-nav a')
        target?.focus()
      })
    }
    // onClose is a state setter wrapper; re-running on its identity would
    // re-trap focus on every render.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [open])
}
