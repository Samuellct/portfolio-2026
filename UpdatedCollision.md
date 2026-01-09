# UpdatedCollision.md — Amélioration de l'animation de collision

## Résumé de la demande

Transformer l'animation de collision actuelle (simulation aléatoire) en un système basé sur une **banque de collisions scientifiques réelles**, avec :
- Affichage du nom du processus physique
- Légende des particules au survol
- Sélection aléatoire dans la banque via le bouton existant

---

## Analyse de l'implémentation actuelle

### Fichier concerné
`src/components/effects/ParticleCollision.tsx`

### Fonctionnement actuel
- Génération aléatoire de tracks (trajectoires) avec paramètres randomisés :
  - Angle de départ
  - Courbure (simulant le champ magnétique)
  - Momentum
  - Charge
  - Couleur

Le système actuel ne représente **aucun processus physique réel** — c'est purement décoratif.

---

## Proposition d'architecture

### 1. Banque de données (`collisionData.ts`)

Créer un fichier de données contenant les collisions célèbres :

```typescript
// src/lib/collisionData.ts

export interface ParticleTrack {
  type: 'electron' | 'muon' | 'photon' | 'jet' | 'tau' | 'neutrino' | 'pion' | 'kaon' | 'proton'
  charge: -1 | 0 | 1
  momentum: number      // GeV/c (relatif, pour le rendu)
  angle: number         // radians
  curvature: number     // dépend de pT et charge
  color: string         // couleur par défaut du type
}

export interface CollisionEvent {
  id: string
  name: string                    // ex: "Higgs → γγ"
  description: string             // Description courte
  experiment: 'ATLAS' | 'CMS' | 'LHCb' | 'ALICE' | 'Generic'
  year?: number
  tracks: ParticleTrack[]
  significance?: string           // ex: "5σ discovery"
}

export const collisionEvents: CollisionEvent[] = [
  {
    id: 'higgs-diphoton',
    name: 'H → γγ',
    description: 'Désintégration du boson de Higgs en deux photons',
    experiment: 'ATLAS',
    year: 2012,
    tracks: [
      { type: 'photon', charge: 0, momentum: 60, angle: Math.PI * 0.3, curvature: 0, color: '#ffd700' },
      { type: 'photon', charge: 0, momentum: 65, angle: Math.PI * 1.7, curvature: 0, color: '#ffd700' },
      // Jets de fond
      { type: 'jet', charge: 0, momentum: 40, angle: Math.PI * 0.8, curvature: 0.1, color: '#4a90d9' },
      { type: 'jet', charge: 0, momentum: 35, angle: Math.PI * 1.2, curvature: -0.1, color: '#4a90d9' },
    ],
  },
  {
    id: 'z-dimuon',
    name: 'Z → μ⁺μ⁻',
    description: 'Désintégration du boson Z en paire de muons',
    experiment: 'CMS',
    tracks: [
      { type: 'muon', charge: 1, momentum: 45, angle: Math.PI * 0.4, curvature: 0.3, color: '#00ff88' },
      { type: 'muon', charge: -1, momentum: 45, angle: Math.PI * 1.6, curvature: -0.3, color: '#00ff88' },
    ],
  },
  {
    id: 'top-pair',
    name: 'tt̄ → W⁺bW⁻b̄',
    description: 'Production de paires de quarks top',
    experiment: 'ATLAS',
    tracks: [
      // Leptons des W
      { type: 'electron', charge: -1, momentum: 50, angle: Math.PI * 0.2, curvature: -0.4, color: '#ff4444' },
      { type: 'muon', charge: 1, momentum: 55, angle: Math.PI * 1.3, curvature: 0.35, color: '#00ff88' },
      // Jets des quarks b
      { type: 'jet', charge: 0, momentum: 70, angle: Math.PI * 0.7, curvature: 0.05, color: '#4a90d9' },
      { type: 'jet', charge: 0, momentum: 65, angle: Math.PI * 1.8, curvature: -0.05, color: '#4a90d9' },
      // Jets additionnels
      { type: 'jet', charge: 0, momentum: 30, angle: Math.PI * 1.0, curvature: 0.02, color: '#4a90d9' },
    ],
  },
  {
    id: 'llp-displaced',
    name: 'LLP → jets déplacés',
    description: 'Signature de particules à longue durée de vie',
    experiment: 'ATLAS',
    tracks: [
      // Vertex déplacé simulé par des tracks partant d'un point décalé
      { type: 'jet', charge: 0, momentum: 40, angle: Math.PI * 0.3, curvature: 0.08, color: '#ff6b6b' },
      { type: 'jet', charge: 0, momentum: 35, angle: Math.PI * 0.5, curvature: -0.06, color: '#ff6b6b' },
      { type: 'electron', charge: -1, momentum: 25, angle: Math.PI * 0.4, curvature: -0.5, color: '#ff4444' },
    ],
  },
  {
    id: 'pion-decay',
    name: 'π⁺ → μ⁺νμ',
    description: 'Désintégration du pion chargé',
    experiment: 'Generic',
    tracks: [
      { type: 'pion', charge: 1, momentum: 20, angle: Math.PI * 0.5, curvature: 0.6, color: '#ff9f43' },
      { type: 'muon', charge: 1, momentum: 15, angle: Math.PI * 0.6, curvature: 0.4, color: '#00ff88' },
      { type: 'neutrino', charge: 0, momentum: 5, angle: Math.PI * 0.4, curvature: 0, color: '#ffffff33' },
    ],
  },
  // ... Ajouter 10-15 autres événements
]
```

### 2. Légende des particules

```typescript
export const particleLegend: Record<string, { name: string; color: string; symbol: string }> = {
  electron: { name: 'Électron', color: '#ff4444', symbol: 'e⁻' },
  muon: { name: 'Muon', color: '#00ff88', symbol: 'μ' },
  photon: { name: 'Photon', color: '#ffd700', symbol: 'γ' },
  jet: { name: 'Jet hadronique', color: '#4a90d9', symbol: 'jet' },
  tau: { name: 'Tau', color: '#9b59b6', symbol: 'τ' },
  neutrino: { name: 'Neutrino', color: '#ffffff33', symbol: 'ν' },
  pion: { name: 'Pion', color: '#ff9f43', symbol: 'π' },
  kaon: { name: 'Kaon', color: '#e74c3c', symbol: 'K' },
  proton: { name: 'Proton', color: '#3498db', symbol: 'p' },
}
```

---

## Modifications du composant

### 3. Structure mise à jour de `ParticleCollision.tsx`

```tsx
interface ParticleCollisionProps {
  isVisible: boolean
  className?: string
}

export default function ParticleCollision({ isVisible, className = '' }: ParticleCollisionProps) {
  const [currentEvent, setCurrentEvent] = useState<CollisionEvent | null>(null)
  const [showLegend, setShowLegend] = useState(false)
  
  // Sélection aléatoire d'un événement
  const selectRandomEvent = useCallback(() => {
    const randomIndex = Math.floor(Math.random() * collisionEvents.length)
    setCurrentEvent(collisionEvents[randomIndex])
  }, [])
  
  // Initialisation
  useEffect(() => {
    if (isVisible && !currentEvent) {
      selectRandomEvent()
    }
  }, [isVisible])
  
  // Rendu des tracks basé sur currentEvent.tracks
  // ...
  
  return (
    <div 
      className={`relative ${className}`}
      onMouseEnter={() => setShowLegend(true)}
      onMouseLeave={() => setShowLegend(false)}
    >
      <canvas ref={canvasRef} />
      
      {/* Titre du processus */}
      {currentEvent && (
        <div className="absolute bottom-4 left-4 text-xs">
          <span className="text-white/60">{currentEvent.name}</span>
          {currentEvent.experiment && (
            <span className="text-white/30 ml-2">({currentEvent.experiment})</span>
          )}
        </div>
      )}
      
      {/* Légende au hover */}
      <AnimatePresence>
        {showLegend && currentEvent && (
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 10 }}
            className="absolute top-4 left-4 bg-black/60 backdrop-blur-sm p-3 rounded text-xs"
          >
            <div className="text-white/40 mb-2">Particules</div>
            {getUniqueParticleTypes(currentEvent.tracks).map(type => (
              <div key={type} className="flex items-center gap-2">
                <span 
                  className="w-3 h-0.5 rounded"
                  style={{ backgroundColor: particleLegend[type].color }}
                />
                <span className="text-white/60">
                  {particleLegend[type].symbol} — {particleLegend[type].name}
                </span>
              </div>
            ))}
          </motion.div>
        )}
      </AnimatePresence>
      
      {/* Bouton shuffle */}
      <button onClick={selectRandomEvent} title={content.contact.collision.newCollision}>
        <RefreshCw size={14} />
      </button>
    </div>
  )
}
```

---

## Liste d'événements suggérés

| ID | Nom | Description |
|----|-----|-------------|
| `higgs-diphoton` | H → γγ | Découverte du Higgs (canal diphoton) |
| `higgs-4lepton` | H → ZZ* → 4ℓ | Découverte du Higgs (canal 4 leptons) |
| `z-dimuon` | Z → μ⁺μ⁻ | Désintégration Z en muons |
| `z-dielectron` | Z → e⁺e⁻ | Désintégration Z en électrons |
| `w-muon` | W → μν | Désintégration W en muon |
| `top-pair` | tt̄ | Production de paires top |
| `dijet` | pp → jj | Événement dijet QCD |
| `pion-decay` | π⁺ → μ⁺ν | Désintégration du pion |
| `kaon-decay` | K⁺ → π⁺π⁰ | Désintégration du kaon |
| `b-meson` | B → J/ψ K | Désintégration d'un méson B |
| `llp-displaced` | LLP → jets | Particule à longue durée de vie |
| `drell-yan` | Z/γ* → ℓℓ | Processus Drell-Yan |
| `photon-jet` | γ + jet | Production photon + jet |
| `tau-decay` | τ → hadrons | Désintégration hadronique du tau |
| `muon-pair` | pp → μ⁺μ⁻ | Production de paires de muons |

---

## Étapes d'implémentation

### Phase 1 : Structure de données
1. Créer `src/lib/collisionData.ts`
2. Définir les interfaces `ParticleTrack` et `CollisionEvent`
3. Créer la banque initiale avec 10-15 événements
4. Créer `particleLegend` pour les couleurs/symboles

### Phase 2 : Adaptation du canvas
1. Modifier `generateTracks()` pour lire depuis `CollisionEvent.tracks`
2. Adapter les calculs de courbure et momentum
3. Conserver l'animation d'apparition progressive

### Phase 3 : UI/UX
1. Ajouter l'affichage du nom du processus
2. Implémenter la légende au hover avec Framer Motion
3. Mettre à jour le bouton shuffle

### Phase 4 : Bonus (optionnel)
- Ajouter un mode "auto-play" qui cycle les événements
- Ajouter un tooltip avec description complète
- Permettre la sélection manuelle d'un événement

---

## Estimation du temps

| Tâche | Temps estimé |
|-------|--------------|
| Structure de données | 1-2h |
| Adaptation canvas | 2-3h |
| UI légende + titre | 1-2h |
| Tests et ajustements | 1-2h |
| **Total** | **5-9h** |

---

## Notes supplémentaires

### Physique des trajectoires
- Les photons et neutrinos ont une **courbure nulle** (pas de charge)
- Les électrons/muons ont une **forte courbure** (masse faible, charge)
- Les jets sont des cônes larges avec **légère courbure**
- Le momentum affecte le **rayon de la trajectoire** (plus haut pT = moins de courbure)

### Couleurs standards (conventions ATLAS/CMS)
- Électrons : Rouge/Orange
- Muons : Vert
- Photons : Jaune/Or
- Jets : Bleu
- Énergie manquante (MET) : Pointillés ou flèche

Cette banque pourrait être enrichie au fil du temps avec des événements de tes propres analyses ATLAS/LHCb !
