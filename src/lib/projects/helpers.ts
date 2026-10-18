import type { Locale } from 'next-intl'
import type { TechName } from '../technologies'

export type { Locale }
export type BilingualText = { en: string; fr: string }

export function getLocalizedField(
  field: BilingualText | string | undefined,
  locale: Locale
): string {
  if (!field) return ''
  if (typeof field === 'string') return unitSpacing(field)
  const text = unitSpacing(field[locale] || field.en)
  return locale === 'fr' && field.fr ? frenchSpacing(text) : text
}

// LaTeX ($...$, $$...$$) and inline code are left as written.
const VERBATIM = /(\$\$[\s\S]*?\$\$|\$[^$]*\$|`[^`]*`)/

function outsideVerbatim(text: string, fix: (prose: string) => string): string {
  return text
    .split(VERBATIM)
    .map((part, i) => (i % 2 ? part : fix(part)))
    .join('')
}

// French typography (V6-I18-01): a narrow no-break space before ; ? ! and a
// no-break space before :, replacing the plain space the text was typed with.
// "!" opening a Markdown image ("![") is not punctuation.
export function frenchSpacing(text: string): string {
  return outsideVerbatim(text, (prose) =>
    prose
      .replace(/[ \u00A0\u202F]+(?=[;?]|!(?!\[))/g, '\u202F')
      .replace(/[ \u00A0\u202F]+(?=:)/g, '\u00A0')
  )
}

// A number never ends a line apart from its unit or % sign (V6-I18-02).
const UNIT =
  /(\d) (?=(?:%|°C|km²|[kMGT]?eV|[kMGT]?Hz|[kmcµμn]?m|[mµμn]?s|min|h|kg|g|[kMGT]B|[kMGT]o|px|pb|fb|kW|W|V)(?![\p{L}\d]))/gu

export function unitSpacing(text: string): string {
  return outsideVerbatim(text, (prose) => prose.replace(UNIT, '$1\u00A0'))
}

// sessionStorage key: the listing's active filter, read back by a project page (UX-13)
export const PROJECTS_FILTER_KEY = 'projects-filter'

// sessionStorage key: the listing's view, tiles or list (P12-D2)
export const PROJECTS_VIEW_KEY = 'projects-view'

// Listing cards show only the years of a month-precise period (translated ones,
// e.g. "July - October 2026" -> "2026"); the project page keeps the full period.
export function getCardPeriod(period: BilingualText | string, locale: Locale): string {
  const full = getLocalizedField(period, locale)
  if (typeof period === 'string') return full
  const years = [...new Set(full.match(/\d{4}/g) ?? [])]
  return years.length ? years.join(' - ') : full
}

// Measures are written with a decimal point and a space between thousands;
// French reads a decimal comma and a narrow no-break space, English a comma.
export function formatMeasure(text: string, locale: Locale): string {
  const spaced = unitSpacing(text).replace(/(\d)[ \u00A0\u202F](?=\d{3}(?!\d))/g, locale === 'fr' ? '$1\u202F' : '$1,')
  return locale === 'fr' ? spaced.replace(/(\d)\.(\d)/g, '$1,$2') : spaced
}

export interface ProjectData {
  id: string
  title: BilingualText | string
  description: BilingualText | string
  subtitle?: BilingualText | string
  // Legacy free-form narrative, still the source for fiches not yet migrated to
  // `sections` (AUDIT-017, Phases 7-8). Once a fiche has `sections`, this field
  // is no longer rendered.
  detailedDescription?: BilingualText | string
  technologies: TechName[]
  keywords: string[]
  category: 'personal' | 'academic' | 'internship'
  status: 'completed' | 'in-progress' | 'planned' | 'paused'
  period: BilingualText | string
  location: BilingualText | string
  image: string
  imageAlt: BilingualText | string
  imageCredit?: string
  imageCreditUrl?: string
  gitHubUrl?: string
  visible?: boolean // default: true
  dateCreated: string
  // Start of the period, YYYY-MM: the listing's sort key (CONS-03). Defaults to dateCreated's month.
  periodStart?: string

  // Structured fiche fields (AUDIT-018). All optional: the 19 entries are
  // migrated fiche by fiche in Phases 7-8. `image` and `gitHubUrl` above stay
  // as derived shortcuts during the migration.
  // The first entry is the fiche's lead image. `frame: 'figure'` (charts,
  // diagrams) is shown whole at its native ratio and needs `width`/`height`
  // (the file's pixel size); every other frame keeps the 16:9 crop (A15).
  media?: Array<{
    src: string
    alt: BilingualText
    caption?: BilingualText
    credit?: { name: string; url?: string }
    frame: 'figure' | 'interface' | 'photo'
    width?: number
    height?: number
  }>
  // Measured results. Numbers are written with a decimal point and localised
  // at render time (`formatMeasure`). `uncertainty` and `baseline` are only
  // filled from values the fiche already states (AUDIT-089/090).
  results?: Array<{
    label: BilingualText
    value: string
    unit?: string
    uncertainty?: string
    baseline?: { value: string; label: BilingualText }
    note?: BilingualText
  }>
  limits?: BilingualText
  links?: Array<{ type: 'code' | 'demo' | 'docs' | 'report' | 'release'; url: string; label?: BilingualText | string }>

  // Named optional narrative sections (AUDIT-017). When present, these replace
  // `detailedDescription` in the fiche render. "Résultats" and "Limites" (the
  // last two sections of the template) are sourced from `results[]` and
  // `limits` above rather than duplicated here.
  sections?: {
    context?: BilingualText
    problem?: BilingualText
    approach?: BilingualText
    whatIBuilt?: BilingualText
  }

  // Structured research metadata (AUDIT-067), for research fiches.
  research?: { lab: BilingualText; collaboration?: string }
}

export const PROJECT_CATEGORIES = ['personal', 'academic', 'internship'] as const

// What the listing and the homepage cards read from a project: client
// components get these fields instead of whole projects (V6-COD-08)
export type ProjectSummary = Pick<
  ProjectData,
  'id' | 'category' | 'title' | 'subtitle' | 'period' | 'description' | 'image' | 'imageAlt' | 'status' | 'technologies' | 'keywords'
>
