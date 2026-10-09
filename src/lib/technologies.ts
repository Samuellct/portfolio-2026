// Canonical technology dictionary: the single source of truth for the exact
// display name, brand colour, and Extended-Toolkit family of every technology
// referenced by the projects. `ProjectData.technologies` is typed on the keys
// of `TECHNOLOGIES`, so a mistyped or non-canonical name is a compile error.
//
// `family` is the curation switch of the About page inventory: a technology
// used by at least one project is shown under its family, `other` is a visible
// catch-all, and `null` hides it on purpose (single-use or overly specific
// libraries). Brand colours are only used by the About page skill bars.

export type TechFamily = 'languages' | 'frameworks' | 'dataAnalysis' | 'tools' | 'other'

interface TechEntry {
  color: string
  family: TechFamily | null
}

export const DEFAULT_TECH_COLOR = '#6b7280'
const D = DEFAULT_TECH_COLOR

export const TECHNOLOGIES = {
  // Languages & runtimes
  Python: { color: '#ffdd54', family: 'languages' },
  'C++': { color: '#00599c', family: 'languages' },
  TypeScript: { color: '#007accde', family: 'languages' },
  JavaScript: { color: '#f7df1e', family: 'languages' },
  Bash: { color: '#4eaa25', family: 'languages' },
  'C#': { color: D, family: 'languages' },
  Kotlin: { color: D, family: 'languages' },
  '.NET': { color: D, family: 'frameworks' },
  Arduino: { color: '#00979d', family: 'languages' },

  // Web frameworks & libraries
  React: { color: '#61dafb', family: null },
  'Next.js': { color: '#ffffff', family: 'frameworks' },
  Astro: { color: D, family: null },
  'Tailwind CSS': { color: '#38b2ac', family: null },
  'Framer Motion': { color: '#bb4b96', family: null },
  WebGL: { color: D, family: null },
  GSAP: { color: '#0ae348', family: null },
  Vite: { color: '#646cff', family: 'frameworks' },
  FastAPI: { color: D, family: 'frameworks' },
  'Jetpack Compose': { color: D, family: null },

  // Scientific computing & high-energy physics
  ROOT: { color: '#6bc0dc', family: 'dataAnalysis' },
  NumPy: { color: '#013243', family: 'dataAnalysis' },
  Pandas: { color: '#150458', family: 'dataAnalysis' },
  Matplotlib: { color: '#e5e5e6', family: 'dataAnalysis' },
  SciPy: { color: D, family: 'dataAnalysis' },
  SymPy: { color: D, family: null },
  'scikit-learn': { color: '#f7931e', family: 'dataAnalysis' },
  TensorFlow: { color: D, family: 'dataAnalysis' },
  PyTorch: { color: '#ee4c2c', family: null },
  Qiskit: { color: D, family: null },
  Cirq: { color: '#ff8209', family: null },
  MadGraph5: { color: '#eeaa89', family: null },
  Pythia8: { color: '#eba047', family: null },
  Rivet: { color: D, family: null },
  pvlib: { color: D, family: null },
  thermofeel: { color: D, family: null },
  gpxpy: { color: D, family: null },
  Meteostat: { color: D, family: null },

  // Geospatial & data visualisation
  NetworkX: { color: D, family: null },
  Rasterio: { color: D, family: 'dataAnalysis' },
  GDAL: { color: D, family: null },
  GeoPandas: { color: D, family: 'dataAnalysis' },
  'scikit-image': { color: D, family: null },
  OSMnx: { color: D, family: null },
  'MapLibre GL JS': { color: D, family: null },
  Leaflet: { color: D, family: null },
  Recharts: { color: D, family: null },
  'Terra Draw': { color: D, family: null },
  Valhalla: { color: D, family: null },

  // Tooling, infrastructure & services
  Git: { color: '#f05033', family: 'tools' },
  Docker: { color: '#0db7ed', family: 'tools' },
  Linux: { color: '#fcc624', family: 'tools' },
  LaTeX: { color: '#008080', family: 'tools' },
  Jupyter: { color: '#f37626', family: 'tools' },
  'VS Code': { color: '#007acc', family: 'tools' },
  LabVIEW: { color: '#ffdb00', family: null },
  Proxmox: { color: '#e57000', family: 'tools' },
  TrueNAS: { color: '#0095d5', family: null },
  'GitHub Actions': { color: D, family: 'tools' },
  'semantic-release': { color: D, family: null },
  uv: { color: D, family: null },
  PySide6: { color: D, family: null },
  SQLite: { color: D, family: 'tools' },
  Room: { color: D, family: null },
  'ML Kit': { color: D, family: null },
  Nextcloud: { color: D, family: null },
  Jellyfin: { color: D, family: null },
  'Nginx Proxy Manager': { color: D, family: 'tools' },
  'Cloudflare Workers': { color: D, family: 'tools' },
  'Cloudflare D1': { color: D, family: null },
  PostgreSQL: { color: D, family: 'tools' },
  Umami: { color: D, family: null },
} as const satisfies Record<string, TechEntry>

export type TechName = keyof typeof TECHNOLOGIES

const DICT = TECHNOLOGIES as Record<string, TechEntry>

export function getTechColor(tech: string): string {
  return DICT[tech]?.color ?? DEFAULT_TECH_COLOR
}

// Family labels are translated (`about.stack.families.<id>`).
const FAMILY_META: Record<TechFamily, { color: string }> = {
  languages: { color: '#3178c6' },
  frameworks: { color: '#61dafb' },
  dataAnalysis: { color: '#f89939' },
  tools: { color: '#f05032' },
  other: { color: DEFAULT_TECH_COLOR },
}

// Extended Toolkit families, derived from the dictionary.
export const techFamilies: Record<string, { color: string; techs: string[] }> =
  Object.fromEntries(
    (Object.keys(FAMILY_META) as TechFamily[]).map((id) => [
      id,
      {
        ...FAMILY_META[id],
        techs: (Object.keys(TECHNOLOGIES) as TechName[]).filter((t) => DICT[t].family === id),
      },
    ])
  )
