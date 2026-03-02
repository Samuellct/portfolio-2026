# Changelog

Toutes les modifications notables apportées à ce projet sont documentées dans ce fichier.

Le format est basé sur [Keep a Changelog](https://keepachangelog.com/en/1.1.0/),
et ce projet respecte les règles du [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

## [4.8.2]

### Corrigé
- Mismatch de version `@next/swc` (15.5.7 vs 15.5.11)
- `twitter-image.tsx` affiche "Portfolio 2025" au lieu de 2026

### Modifié
- Portée du chargement CSS KaTeX : actuellement global, à restreindre à `MarkdownRenderer`

### Supprimé
- Import `HiddenIcon` inutilisé dans `HeroSection.tsx`
- Fonction `typeText` inutilisée dans `Terminal.tsx`

---

## [4.8.1] - 2026-02-05

### Ajouté
- Nouveau projet : analyse de données L3
- Bouton "Skip to content" pour l'accessibilité
- Guide de déploiement Cloudflare Pages
- Configuration `pages_build_output_dir` pour Cloudflare Pages

### Modifié
- Migration de l'hébergement : Vercel --> Cloudflare Pages
- Update vers Next.js 15.5.11 et Wrangler
- Conversion des images au format WebP
- Remplacement des balises `<img>` par le composant `<Image>` de Next.js
- MàJ du lien LinkedIn

### Corrigé
- Menu hamburger non visible sur mobile — [#3](https://github.com/Samuellct/portfolio-2026/issues/3)
- Import KaTeX retiré du CSS global — [#4](https://github.com/Samuellct/portfolio-2026/issues/4)
- `useMemo` cassé — [#5](https://github.com/Samuellct/portfolio-2026/issues/5)
- Suppression de code hérité, ajout de `aria-hidden="true"` — [#8](https://github.com/Samuellct/portfolio-2026/issues/8)
- Année incorrecte dans le pied de page
- Corrections typo
- bug fix configuration du déploiement Cloudflare
- Suppression d'un warning de licence

---

## [4.8.0] - 2026-01-30

### Ajouté
- Système de visibilité des projets via le champ `featured` (masquage des projets incomplets)

### Modifié
- MàJ complète du contenu des projets
- MàJ des liens GitHub des projets
- MàJ de la section "Interests"
- Couleurs et styles du composant `techStats` revus
- Calcul des barres de compétences "About" basé sur le nombre total de projets
- Couleurs de survol des tuiles projets

### Corrigé
- Corrections diverses du rendu LaTeX
- Corrections des commentaires internes de `techStats`
- Couleur de texte incorrecte sur le projet Proxmox

### Supprimé
- Fichier Markdown obsolète supprimé

---

## [4.7.3] - 2026-01-26

### Ajouté
- Documentation README initiale

---

## [4.7.2] - 2026-01-13

### Corrigé
- Correction de fichiers publics cassés (assets introuvables au chargement)

---

## [4.7.1] - 2026-01-12

### Ajouté
- Intégration du formulaire de contact via Formspree
- Métadonnées JSON-LD pour le référencement SEO

### Modifié
- Amélioration du rendu côté serveur (SSR)
- Optimisations d'affichage sur mobile
- MàJ des clés de `content.json`

### Corrigé
- Nettoyage ESLint

---

## [4.7.0] - 2026-01-09

Refonte complète du portfolio avec Next.js 15 et React 19.

### Ajouté
- Rework du portfolio sur Next.js 15 (App Router, React 19, TypeScript)
- Refonte du design de la page projet individuelle

### Corrigé
- Bug d'affichage de la landing page
- Correctifs de la section projets sur la page d'accueil
- Correction du contenu de `content.json`

---

*Les versions antérieures à 4.7.0 ne sont pas documentées.*
