import type { ComponentPropsWithoutRef, ReactNode } from 'react'
import TransitionLink from '@/components/navigation/TransitionLink'
import { ExternalLink } from '@/components/ui/ExternalLink'
import { cn } from '@/lib/cn'

/**
 * The one call-to-action pill (V6-COD-14, P11-D1): one height, one weight, one
 * border per scheme. The pink pill turns to ink on paper and to white on the
 * night hero (owner's choice). Icons go in `children`, marked `aria-hidden`.
 * `external` opens a new tab and announces it (ExternalLink).
 */
type PillTone = 'primary' | 'outline'
type PillScheme = 'paper' | 'night'

const BASE =
  'inline-flex items-center justify-center gap-2 px-6 lg:px-7 py-3.5 rounded-full border-[1.5px] text-xs lg:text-sm font-bold whitespace-nowrap transition-colors duration-200'

const LOOK: Record<PillScheme, Record<PillTone, string>> = {
  paper: {
    primary: 'border-transparent bg-riso-pink text-primary hover:bg-riso-ink hover:text-riso-paper',
    outline: 'border-riso-ink text-riso-ink hover:bg-riso-ink hover:text-riso-paper',
  },
  night: {
    primary: 'border-transparent bg-riso-pink text-primary hover:bg-snow',
    outline: 'border-riso-paper text-riso-paper hover:bg-riso-paper hover:text-primary',
  },
}

type Rendering =
  | ({ as?: 'button' } & Omit<ComponentPropsWithoutRef<'button'>, 'className'>)
  | ({ as: 'a' | 'link' | 'external'; href: string } & Omit<ComponentPropsWithoutRef<'a'>, 'className' | 'href'>)

export type PillProps = {
  children: ReactNode
  tone?: PillTone
  scheme?: PillScheme
  /** Uppercase spaced label; off for content such as an e-mail address. */
  caps?: boolean
  /** Layout only (width, flex, group): never colours or padding. */
  className?: string
} & Rendering

function pillClasses({
  tone = 'primary',
  scheme = 'paper',
  caps = true,
  className,
}: Pick<PillProps, 'tone' | 'scheme' | 'caps' | 'className'>) {
  return cn(BASE, caps && 'uppercase tracking-caps', LOOK[scheme][tone], className)
}

export function Pill(props: PillProps) {
  const { children, tone, scheme, caps, className, as, ...rest } = props
  const classes = pillClasses({ tone, scheme, caps, className })

  if (as === 'link') {
    const { href, ...anchor } = rest as { href: string } & Omit<ComponentPropsWithoutRef<'a'>, 'href'>
    return (
      <TransitionLink href={href} className={classes} {...anchor}>
        {children}
      </TransitionLink>
    )
  }
  if (as === 'external') {
    const { href, ...anchor } = rest as { href: string } & Omit<ComponentPropsWithoutRef<'a'>, 'href'>
    return (
      <ExternalLink href={href} className={classes} {...anchor}>
        {children}
      </ExternalLink>
    )
  }
  if (as === 'a') {
    return (
      <a className={classes} {...(rest as ComponentPropsWithoutRef<'a'>)}>
        {children}
      </a>
    )
  }
  const { type = 'button', ...button } = rest as ComponentPropsWithoutRef<'button'>
  return (
    <button type={type} className={classes} {...button}>
      {children}
    </button>
  )
}
