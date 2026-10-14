import { createNavigation } from 'next-intl/navigation'
import { routing } from './routing'

/** @public The full next-intl navigation API, kept whole even where a helper is unused. */
export const { Link, redirect, usePathname, useRouter, getPathname } =
  createNavigation(routing)
