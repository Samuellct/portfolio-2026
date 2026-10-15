import type { ComponentPropsWithoutRef, ReactNode } from 'react'
import { cn } from '@/lib/cn'

/**
 * Projects-listing filter toggle (AUDIT-047). Actions use `Pill` (V6-COD-14);
 * the unused primary, secondary, ghost and link variants were removed (V6-MORT-09).
 */
export type ButtonProps = {
  children: ReactNode
  className?: string
  active?: boolean
} & Omit<ComponentPropsWithoutRef<'button'>, 'className'>

export function Button({ children, className, active = false, type = 'button', ...rest }: ButtonProps) {
  return (
    <button
      type={type}
      className={cn(
        // One 44 px height whether or not the label carries a category plate (V6-LST-02)
        'inline-flex h-11 items-center px-6 text-xs tracking-caps-wide uppercase border transition-all duration-300',
        active
          ? 'bg-white text-black border-white'
          : 'bg-transparent text-muted border-white/35 hover:border-white hover:text-white',
        className,
      )}
      {...rest}
    >
      {children}
    </button>
  )
}
