import Image from 'next/image'
import type { ReactNode } from 'react'
import { cn } from '@/lib/cn'

/**
 * Framed image with optional caption and credit (AUDIT-047). Encapsulates the
 * "local asset -> next/image, remote URL -> plain img" switch that project
 * pages need, and renders the `media[]` entries of a fiche.
 *
 * Two framings (A15): `crop` keeps the uniform 16:9 crop used by the listing,
 * photos and interface captures (AUDIT-039); `whole` shows a result figure or
 * diagram at its native ratio, uncropped, on a white plate so axes stay legible.
 */
export type ImageCredit = { name: string; url?: string }

export function Figure({
  src,
  alt,
  priority = false,
  caption,
  credit,
  creditLabel,
  wrapper,
  frameClassName,
  framing = 'crop',
  width,
  height,
  sizes = '(min-width: 1024px) 66vw, 100vw',
}: {
  src: string
  alt: string
  priority?: boolean
  caption?: ReactNode
  credit?: ImageCredit
  /** Localised "Image credit" prefix. */
  creditLabel?: string
  /** Optional wrapping element class. When omitted, renders without a wrapper. */
  wrapper?: string
  frameClassName?: string
  framing?: 'crop' | 'whole'
  /** Intrinsic size of the file; sets the frame ratio when `framing="whole"`. */
  width?: number
  height?: number
  sizes?: string
}) {
  const isLocal = src.startsWith('/')
  const whole = framing === 'whole' && width !== undefined && height !== undefined
  const fit = whole ? 'object-contain' : 'object-cover'
  const body = (
    <>
      <div
        className={cn(
          'relative overflow-hidden rounded-sm',
          whole ? 'bg-snow border border-accent-line/30' : 'aspect-video',
          frameClassName
        )}
        style={whole ? { aspectRatio: `${width} / ${height}` } : undefined}
      >
        {isLocal ? (
          <Image src={src} alt={alt} fill sizes={sizes} className={fit} priority={priority} />
        ) : (
          // eslint-disable-next-line @next/next/no-img-element
          <img src={src} alt={alt} className={cn('w-full h-full', fit)} />
        )}
      </div>

      {caption && <p className="mt-3 font-fraunces italic text-sm text-muted">{caption}</p>}

      {credit && (
        <p className={cn('text-xs text-muted', caption ? 'mt-1' : 'mt-2')}>
          {creditLabel ? `${creditLabel}: ` : ''}
          {credit.url ? (
            <a
              href={credit.url}
              target="_blank"
              rel="noopener noreferrer"
              className="hover:text-white underline"
            >
              {credit.name}
            </a>
          ) : (
            credit.name
          )}
        </p>
      )}
    </>
  )
  return wrapper === undefined ? body : <div className={wrapper}>{body}</div>
}
