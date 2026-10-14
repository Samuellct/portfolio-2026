'use client'

import { useEffect, useState } from 'react'

// Set once the first page has hydrated. Pages mounted after that come from a
// client-side navigation, where an entry animation is safe to play.
let appHydrated = false

export function useMarkAppHydrated() {
  useEffect(() => {
    appHydrated = true
  }, [])
}

// False on the server-rendered page (content served visible, so it reads
// without JavaScript and does not blink at hydration), true when the page
// mounts on the client. Read once, at the component's first render.
export function useEntryAnimation() {
  const [animate] = useState(() => appHydrated)
  return animate
}
