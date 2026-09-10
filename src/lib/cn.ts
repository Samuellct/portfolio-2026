/**
 * Minimal className joiner. Filters out falsy values and joins with a space.
 * No tailwind-merge: callers must not pass utilities that conflict with a
 * component's base classes (compose additively instead).
 */
export function cn(...parts: Array<string | false | null | undefined>): string {
  return parts.filter(Boolean).join(' ')
}
