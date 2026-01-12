# Roadmap V5.0 — Portfolio Samuel Lecomte

## Vue d'ensemble

La version 5.0 se concentre sur trois axes majeurs :
1. **Fonctionnalité** : Formulaire de contact opérationnel (Formspree)
2. **Mesure** : Intégration analytics (Umami)
3. **Design** : Animation de collision scientifiquement réaliste

---

## 1. Intégration Formspree

### Objectif
Rendre le formulaire de contact fonctionnel avec validation côté client et retours utilisateur.

### Endpoint
```
https://formspree.io/f/xpwjbwkb
```

### Fichiers à modifier
- `src/app/contact/page.tsx` — Logique de soumission
- `src/lib/content.json` — Messages de succès/erreur (déjà présents)

### Implémentation prévue

```typescript
// Exemple de structure attendue
interface FormData {
  name: string
  email: string
  subject: string
  message: string
}

async function handleSubmit(data: FormData) {
  const response = await fetch('https://formspree.io/f/xpwjbwkb', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(data),
  })
  
  if (response.ok) {
    // Show success message
  } else {
    // Show error message
  }
}
```

### États du formulaire
1. `idle` — Formulaire vide
2. `submitting` — Envoi en cours (désactiver bouton, spinner)
3. `success` — Message envoyé (afficher confirmation)
4. `error` — Échec (afficher erreur + retry)

### Validation
- `name`: Required, min 2 chars
- `email`: Required, format email
- `subject`: Required, min 5 chars
- `message`: Required, min 20 chars

---

## 2. Intégration Umami Analytics

### Objectif
Mesurer le trafic de manière privacy-friendly, sans cookies, GDPR-compliant.

### Options d'hébergement
1. **Umami Cloud** (gratuit jusqu'à 10k events/mois)
2. **Self-hosted** sur ton serveur Proxmox

### Fichiers à créer/modifier

#### Option A : Script externe (recommandé)
```typescript
// src/app/layout.tsx
import Script from 'next/script'

export default function RootLayout({ children }) {
  return (
    <html>
      <head>
        <Script
          src="https://analytics.samuel-lecomte.fr/script.js"
          data-website-id="YOUR_WEBSITE_ID"
          strategy="afterInteractive"
        />
      </head>
      <body>{children}</body>
    </html>
  )
}
```

#### Option B : Composant dédié
```typescript
// src/components/analytics/UmamiAnalytics.tsx
'use client'

import Script from 'next/script'

const UMAMI_URL = process.env.NEXT_PUBLIC_UMAMI_URL
const WEBSITE_ID = process.env.NEXT_PUBLIC_UMAMI_WEBSITE_ID

export default function UmamiAnalytics() {
  if (!UMAMI_URL || !WEBSITE_ID) return null
  
  return (
    <Script
      src={`${UMAMI_URL}/script.js`}
      data-website-id={WEBSITE_ID}
      strategy="afterInteractive"
    />
  )
}
```

### Variables d'environnement à ajouter
```env
# .env.local
NEXT_PUBLIC_UMAMI_URL=https://analytics.samuel-lecomte.fr
NEXT_PUBLIC_UMAMI_WEBSITE_ID=xxxxxxxx-xxxx-xxxx-xxxx-xxxxxxxxxxxx
```

### Événements custom (optionnel)
```typescript
// Track custom events
declare global {
  interface Window {
    umami?: {
      track: (event: string, data?: Record<string, unknown>) => void
    }
  }
}

// Usage
window.umami?.track('contact_form_submitted')
window.umami?.track('project_viewed', { project: 'higgs-analysis' })
```

---

## 3. Animation de Collision Réaliste

### Objectif
Remplacer l'animation aléatoire par une banque d'événements physiques réels.

### Fichiers à créer

#### `src/lib/collisionData.ts`
Banque de données contenant 15-20 événements de collision :
- H → γγ (découverte Higgs)
- H → ZZ* → 4ℓ
- Z → μ⁺μ⁻
- Z → e⁺e⁻
- W → μν
- tt̄ (paires top)
- Drell-Yan
- π⁺ → μ⁺ν (désintégration pion)
- B → J/ψ K
- LLP (particules longue durée de vie)
- etc.

#### `src/lib/particleLegend.ts`
Définition des couleurs et symboles par type de particule :
```typescript
export const particleLegend = {
  electron: { name: 'Électron', color: '#ff4444', symbol: 'e⁻' },
  muon: { name: 'Muon', color: '#00ff88', symbol: 'μ' },
  photon: { name: 'Photon', color: '#ffd700', symbol: 'γ' },
  jet: { name: 'Jet hadronique', color: '#4a90d9', symbol: 'jet' },
  // ...
}
```

### Fichiers à modifier

#### `src/components/effects/ParticleCollision.tsx`
- Importer la banque de données
- Remplacer `generateTracks()` par lecture depuis `CollisionEvent`
- Ajouter état pour l'événement courant
- Ajouter affichage du nom du processus
- Ajouter légende au hover

#### `src/lib/content.json`
Ajouter les clés pour la légende :
```json
{
  "contact": {
    "collision": {
      "newCollision": "New collision",
      "eventDisplay": "Event Display",
      "legend": "Particles",
      "particles": {
        "electron": "Electron",
        "muon": "Muon",
        "photon": "Photon",
        "jet": "Hadronic jet"
      }
    }
  }
}
```

### UI/UX

```
┌─────────────────────────────────────┐
│                                     │
│        [Animation Canvas]           │
│                                     │
│  ┌─────────────┐                    │
│  │ Legend      │ (hover)            │
│  │ ─ e⁻       │                    │
│  │ ─ μ        │                    │
│  │ ─ γ        │                    │
│  └─────────────┘                    │
│                                     │
│  H → γγ (ATLAS, 2012)    [🔄]      │
└─────────────────────────────────────┘
```

---

## 4. Améliorations techniques bonus

### OG Image (Audit #5)
Créer `/public/og-image.jpg` ou utiliser l'API Next.js :
```typescript
// src/app/opengraph-image.tsx
import { ImageResponse } from 'next/og'

export default async function Image() {
  return new ImageResponse(
    <div style={{ /* ... */ }}>
      Samuel Lecomte — Particle Physicist
    </div>,
    { width: 1200, height: 630 }
  )
}
```

### SSG pour pages projet
```typescript
// src/app/projects/[category]/[id]/page.tsx
export async function generateStaticParams() {
  return getAllProjectParams()
}
```

---

## Planning estimé

| Tâche | Complexité | Temps estimé | Status |
|-------|------------|--------------|--------|
| Formspree integration | Faible | 1-2h | ✅ V4.8.1 |
| OG Image dynamique | Faible | 1h | ✅ V4.8.1 |
| JSON-LD Structured Data | Faible | 30min | ✅ V4.8.1 |
| Umami setup | Faible | 1h | 🔲 Pending |
| Collision data bank | Moyenne | 3-4h | 🔲 Pending |
| Collision component refactor | Moyenne | 3-4h | 🔲 Pending |
| Collision UI (legend, label) | Moyenne | 2-3h | 🔲 Pending |
| Tests & polish | - | 2h | 🔲 Pending |
| **Total restant** | | **~11-15h** |

---

## Checklist V5.0

- [x] Formspree : formulaire fonctionnel (V4.8.1)
- [x] Formspree : validation client (V4.8.1)
- [x] Formspree : états loading/success/error (V4.8.1)
- [ ] Umami : script intégré
- [ ] Umami : variables env documentées
- [ ] Collision : banque de données créée
- [ ] Collision : légende des particules
- [ ] Collision : affichage nom processus
- [ ] Collision : hover legend
- [x] OG Image : fichier généré dynamiquement (V4.8.1)
- [x] JSON-LD : Structured Data ajoutés (V4.8.1)
- [ ] Documentation mise à jour
- [ ] README mis à jour

---

*Roadmap créée pour Portfolio V5.0 — En attente du fichier Formspree pour compléter*
