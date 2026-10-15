import { VITAL_NAMES } from '@/lib/vitals'

// Field Web Vitals endpoint (phase 13, P13-D1): validates one beacon and writes
// it as a JSON line to the worker logs, read back with Workers Observability.
// Nothing else is kept: no IP, no user agent, no identifier.
const MAX_BYTES = 1024
const RATINGS = ['good', 'needs-improvement', 'poor']
const SCREENS = ['desktop', 'mobile']

const isPath = (value: unknown): value is string =>
  typeof value === 'string' && value.startsWith('/') && value.length <= 200

const short = (value: unknown, max: number) =>
  typeof value === 'string' && value.length <= max ? value : undefined

export async function POST(request: Request) {
  const text = await request.text()
  if (text.length > MAX_BYTES) return new Response(null, { status: 413 })

  let data: Record<string, unknown>
  try {
    data = JSON.parse(text)
  } catch {
    return new Response(null, { status: 400 })
  }
  if (
    !data ||
    typeof data !== 'object' ||
    typeof data.name !== 'string' ||
    !VITAL_NAMES.includes(data.name) ||
    typeof data.value !== 'number' ||
    !Number.isFinite(data.value) ||
    data.value < 0 ||
    !isPath(data.path) ||
    !isPath(data.landing)
  ) {
    return new Response(null, { status: 400 })
  }

  console.log(
    JSON.stringify({
      evt: 'web-vital',
      name: data.name,
      value: data.value,
      rating: RATINGS.includes(data.rating as string) ? data.rating : undefined,
      navigationType: short(data.navigationType, 20),
      landing: data.landing,
      path: data.path,
      screen: SCREENS.includes(data.screen as string) ? data.screen : undefined,
      v: short(data.v, 12),
    }),
  )
  return new Response(null, { status: 204 })
}
