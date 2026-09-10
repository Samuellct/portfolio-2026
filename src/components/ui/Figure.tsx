import Image from 'next/image'
import type { ReactNode } from 'react'
import { cn } from '@/lib/cn'

/**
 * Framed image with optional caption and credit (AUDIT-047). Encapsulates the
 * "local asset -> next/image, remote URL -> plain img" switch that project
 * pages need, and is the target for the `media[]` field filled in Phases 7-8.
 * The current detail-page markup is preserved exactly.
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
}) {
  const isLocal = src.startsWith('/')
  const body = (
    <>
      <div className={cn('relative aspect-video overflow-hidden rounded-sm', frameClassName)}>
        {isLocal ? (
          <Image src={src} alt={alt} fill className="object-cover" priority={priority} />
        ) : (
          // eslint-disable-next-line @next/next/no-img-element
          <img src={src} alt={alt} className="w-full h-full object-cover" />
        )}
      </div>

      {caption && <p className="mt-2 text-xs text-white/50">{caption}</p>}

      {credit && (
        <p className="mt-2 text-xs text-muted">
          {creditLabel ? `${creditLabel}: ` : ''}
          {credit.url ? (
            <a
              href={credit.url}
              target="_blank"
              rel="noopener noreferrer"
              className="hover:text-white/50 underline"
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
