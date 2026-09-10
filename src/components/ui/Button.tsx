'use client'

import type { ComponentPropsWithoutRef, ReactNode } from 'react'
import TransitionLink from '@/components/navigation/TransitionLink'
import { cn } from '@/lib/cn'

/**
 * Design-system button primitive (AUDIT-047).
 *
 * `filter` reproduces the projects-listing toggle exactly (byte-for-byte class
 * string) and is the only variant wired in during Phase 4. The `primary` /
 * `secondary` / `ghost` / `link` variants define the canonical, sharp-edged
 * look for Phases 5 to 12 to adopt as they rework each surface; the historical
 * one-off CTAs (shine sweep, submit spinner, rounded pills) are migrated there,
 * not here.
 */
export type ButtonVariant = 'primary' | 'secondary' | 'ghost' | 'link' | 'filter'
export type ButtonSize = 'sm' | 'md' | 'lg'

const VARIANT: Record<Exclude<ButtonVariant, 'filter'>, string> = {
  primary:
    'inline-flex items-center gap-3 font-medium uppercase tracking-caps transition-all bg-accent-cyan text-black hover:bg-white',
  secondary:
    'inline-flex items-center gap-3 font-medium uppercase tracking-caps transition-all bg-white/5 border border-white/15 hover:border-white/30',
  ghost:
    'inline-flex items-center gap-3 font-medium uppercase tracking-caps transition-all border border-white/10 hover:border-white/30',
  link: 'inline-flex items-center gap-2 text-white/50 transition-colors hover:text-white group',
}

const SIZE: Record<ButtonSize, string> = {
  sm: 'px-6 py-2 text-xs',
  md: 'px-6 py-3 text-sm',
  lg: 'px-8 py-4 text-sm',
}

type Rendering =
  | ({ as?: 'button' } & Omit<ComponentPropsWithoutRef<'button'>, 'className'>)
  | ({ as: 'a' | 'link'; href: string } & Omit<ComponentPropsWithoutRef<'a'>, 'className' | 'href'>)

export type ButtonProps = {
  children: ReactNode
  className?: string
  variant?: ButtonVariant
  size?: ButtonSize
  /** Only meaningful for `variant="filter"`. */
  active?: boolean
} & Rendering

function classesFor({ variant = 'primary', size = 'md', active = false, className }: ButtonProps) {
  if (variant === 'filter') {
    return cn(
      'px-6 py-2.5 text-xs tracking-caps-wide uppercase border transition-all duration-300',
      active
        ? 'bg-white text-black border-white'
        : 'bg-transparent text-white/60 border-white/20 hover:border-white/50 hover:text-white',
      className,
    )
  }
  return cn(VARIANT[variant], variant !== 'link' && SIZE[size], className)
}

export function Button(props: ButtonProps) {
  const className = classesFor(props)
  const rest: Record<string, unknown> = { ...props }
  delete rest.children
  delete rest.className
  delete rest.variant
  delete rest.size
  delete rest.active
  delete rest.as

  if (props.as === 'link') {
    const { href, ...anchorRest } = rest as { href: string }
    return (
      <TransitionLink href={href} className={className} {...anchorRest}>
        {props.children}
      </TransitionLink>
    )
  }
  if (props.as === 'a') {
    const { href, ...anchorRest } = rest as { href: string }
    return (
      <a href={href} className={className} {...anchorRest}>
        {props.children}
      </a>
    )
  }
  return (
    <button className={className} {...(rest as ComponentPropsWithoutRef<'button'>)}>
      {props.children}
    </button>
  )
}
