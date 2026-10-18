import type { BilingualText } from './projects/helpers'

// Work experience shown on About besides the research internships, which stay
// read from the project data (V6-ABT-04). Texts validated by the owner (P14-D13).
export interface ExperienceEntry {
  id: string
  // 1: shown as a card, 2: in the "other work experience" disclosure
  level: 1 | 2
  // Student jobs are grouped under their own heading inside the disclosure
  student?: boolean
  role: BilingualText
  organisation: string
  place?: string
  period: BilingualText
  summary: BilingualText
  project?: { category: string; id: string; name: string }
}

// Most recent first within each level
export const experiences: ExperienceEntry[] = [
  {
    id: 'cnp',
    level: 1,
    role: { fr: 'Data Analyst', en: 'Data Analyst' },
    organisation: 'CNP Assurances',
    place: 'Angers',
    period: { fr: 'Janvier - mars 2026', en: 'January - March 2026' },
    summary: {
      fr: "Contrôles qualité et analyses exploratoires sur les données de l'assurance emprunteur (sinistres, assurés, souscriptions), et tableaux de bord pour les actuaires.",
      en: 'Quality checks and exploratory analysis on borrower insurance data (claims, policyholders, policies), and dashboards for the actuaries.',
    },
  },
  {
    id: 'teaching',
    level: 1,
    role: { fr: 'Enseignant contractuel en physique-chimie', en: 'Contract teacher, physics and chemistry' },
    organisation: "Académie d'Orléans-Tours",
    period: { fr: 'Septembre - novembre 2025', en: 'September - November 2025' },
    summary: {
      fr: 'Cours de physique-chimie en classes de seconde et de première : préparation des cours, accompagnement des élèves et évaluation des acquis.',
      en: 'Physics and chemistry lessons for Seconde and Première classes: lesson planning, student support and assessment of progress.',
    },
  },
  {
    id: 'center-parcs',
    level: 2,
    role: { fr: 'Manager Retail', en: 'Retail manager' },
    organisation: 'Center Parcs France',
    period: { fr: 'Mai - octobre 2026', en: 'May - October 2026' },
    summary: {
      fr: "Encadrement des équipes de vente (livraison, supermarché, vente à emporter) et pilotage de l'activité quotidienne. J'y ai développé l'application Delivr pour préparer les tournées de livraison.",
      en: 'Led the sales teams (delivery, supermarket, takeaway) and ran the day-to-day activity. I developed the Delivr app there to plan the delivery rounds.',
    },
    project: { category: 'personal', id: 'delivr', name: 'Delivr' },
  },
  {
    id: 'vineyard',
    level: 2,
    student: true,
    role: { fr: 'Employé viticole', en: 'Vineyard worker' },
    organisation: 'Domaine Charles Joguet',
    place: 'Sazilly',
    period: { fr: 'Juillet 2024 et septembre 2025', en: 'July 2024 and September 2025' },
    summary: { fr: 'Entretien des vignes, vendanges, mise en fûts.', en: 'Vine maintenance, harvest, barrelling.' },
  },
  {
    id: 'supermarket',
    level: 2,
    student: true,
    role: { fr: 'Employé commercial', en: 'Sales assistant' },
    organisation: 'Super U',
    place: 'Chinon',
    period: { fr: 'Juillet - août 2022 et juin - août 2023', en: 'July - August 2022 and June - August 2023' },
    summary: { fr: 'Mise en rayon, stocks, relation client.', en: 'Shelf stocking, stock, customer service.' },
  },
  {
    id: 'factory',
    level: 2,
    student: true,
    role: { fr: 'Opérateur de fabrication', en: 'Production operator' },
    organisation: 'Reitzel Briand',
    place: 'Bourré',
    period: { fr: 'Juillet - août 2021', en: 'July - August 2021' },
    summary: { fr: 'Ligne de production, cadences, hygiène et procédures.', en: 'Production line, output rates, hygiene and procedures.' },
  },
]
