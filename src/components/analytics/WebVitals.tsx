'use client'

import { useCallback, useState } from 'react'
import { useReportWebVitals } from 'next/web-vitals'
import { VITAL_NAMES } from '@/lib/vitals'

// Field Web Vitals (phase 13, P13-D1): one beacon per metric to /api/vitals,
// which writes it to the worker logs. No identifier, no user agent: only the
// metric, the page and the screen class.
const BUILD = process.env.NEXT_PUBLIC_BUILD_SHA || 'local'
// same breakpoint as the About pins (AboutView DESKTOP_QUERY)
const DESKTOP_QUERY = '(min-width: 1024px)'

export default function WebVitals() {
  // CLS and INP are sent when the page is hidden and cover the client-side
  // navigations since the load: keep the page the visit started on
  const [landing] = useState(() => (typeof window === 'undefined' ? null : window.location.pathname))

  // stable: the hook subscribes again whenever its callback changes
  const report = useCallback<Parameters<typeof useReportWebVitals>[0]>((metric) => {
    // Next adds its own metrics (hydration, route change): not sent
    if (process.env.NODE_ENV !== 'production' || !VITAL_NAMES.includes(metric.name)) return
    const body = JSON.stringify({
      name: metric.name,
      value: metric.value,
      rating: metric.rating,
      navigationType: metric.navigationType,
      landing: landing ?? window.location.pathname,
      path: window.location.pathname,
      screen: window.matchMedia(DESKTOP_QUERY).matches ? 'desktop' : 'mobile',
      v: BUILD,
    })
    // plain string (text/plain): no CORS preflight, the endpoint reads the text
    navigator.sendBeacon?.('/api/vitals', body)
  }, [landing])
  useReportWebVitals(report)

  return null
}
