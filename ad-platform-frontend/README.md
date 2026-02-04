# Mini AdTech Campaign Frontend

## Description
Interface React moderne permettant de gérer des campagnes publicitaires digitales :
- Visualisation de la liste des campagnes avec pagination
- Création de nouvelles campagnes
- Consultation des détails et statistiques (CTR, CPC)
- Gestion du statut des campagnes (activer/pause)

---

## Stack
- **React 19** - Bibliothèque UI
- **Vite** - Build tool et dev server
- **React Router DOM** - Routing côté client
- **Tailwind CSS** - Framework CSS utilitaire
- **Axios** - Client HTTP pour les appels API
- **Context API** - Gestion d'état globale
- **Lucide React** - Bibliothèque d'icônes

---
---

## Pourquoi React ?

**React a été choisi pour ce projet pour plusieurs raisons :**

### 1. **Standard de l'industrie**
- Framework largement utilisé dans l'industrie AdTech (Google Ads, Meta Ads Manager, TikTok Ads)
- Alternative moderne à Next.js pour les applications SPA

### 2. **Adapté aux besoins du projet**
- **Gestion d'état** : Context API simple et suffisante pour 3 pages
- **Composants réutilisables** : StatusBadge, Pagination, FabButton
- **Navigation SPA** : React Router pour une expérience fluide
- **Hooks modernes** : `useState`, `useEffect`, custom hooks (`useCampaigns`, `useStats`)

### 3. **Rapidité de développement**
- **Vite** : HMR instantané, setup en 2 minutes
- **Écosystème riche** : librairies bien documentées (Axios, Tailwind, Lucide)
- **Communauté** : énorme quantité de ressources disponibles

### 4. **Cohérence avec le backend**
- Backend en JavaScript (Node.js + Express)
- Frontend en JavaScript (React)
- Stack homogène facilitant le partage de code et la maintenance

### 5. **Scalabilité**
- Facile d'ajouter des features AdTech avancées :
  - React Query pour le cache
  - Recharts pour les graphiques de performances
  - React Table pour des tableaux complexes

**Alternative considérée :** Next.js → jugé overkill pour 3 pages sans besoin de SSR/SEO

## Installation

```bash
git clone git@github.com:Andassa/AdTech.git
cd AdTech/ad-platform-frontend
npm install
```

## Configuration

### Configuration Frontend

Créer un fichier `.env` à la racine du projet frontend avec la variable suivante :

```.env
VITE_API_URL=http://localhost:3000/api/campaign
```

**Note** : Par défaut, l'application utilise `http://localhost:3000/api/campaign` si la variable d'environnement n'est pas définie.



## Lancer le projet

```bash
npm run dev
```

L'application sera accessible sur : http://localhost:5173

### Autres commandes

```bash
npm run build    # Build de production
npm run preview  # Prévisualiser le build de production
npm run lint     # Linter le code
```

---

## Structure du projet

```
ad-platform-frontend/
├── src/
│   ├── components/        # Composants réutilisables
│   │   ├── FabButton.jsx  # Bouton flottant
│   │   ├── StatusBadge.jsx # Badge de statut
│   │   └── Pagination.jsx  # Composant de pagination
│   ├── context/            # Context API
│   │   └── CampaignContext.jsx # État global des campagnes
│   ├── hooks/              # Hooks personnalisés
│   │   ├── useCampaigns.js # Hook pour les campagnes
│   │   └── useStats.js     # Hook pour calculer CTR/CPC
│   ├── pages/              # Pages de l'application
│   │   ├── CampaignList.jsx    # Liste des campagnes
│   │   ├── CampaignDetail.jsx  # Détails d'une campagne
│   │   └── CreateCampaign.jsx   # Formulaire de création
│   ├── services/           # Services API
│   │   └── api.js          # Client Axios et fonctions API
│   ├── assets/             # Assets statiques
│   ├── App.jsx             # Composant racine avec routing
│   └── main.jsx            # Point d'entrée
├── public/                  # Fichiers publics
├── package.json
├── vite.config.js          # Configuration Vite
└── tailwind.config.js      # Configuration Tailwind
```

---

## Fonctionnalités

### 📋 Liste des campagnes (`/`)
- Affichage en tableau (desktop) et cartes (mobile/tablette)
- Colonnes : Nom, Annonceur, Statut, Budget, CTR
- Pagination avec navigation `next` / `previous`
- Calcul du CTR en temps réel : `(clicks / impressions) * 100`
- État de chargement et gestion d'erreurs
- Design responsive

### ➕ Création de campagne (`/create`)
- Formulaire avec validation côté client
- Champs : nom, annonceur, budget, dates (début/fin)
- Validation des dates (fin > début)
- Feedback visuel des erreurs
- Redirection automatique après création

### 📊 Détails de campagne (`/campaigns/:id`)
- Affichage complet des informations
- Statistiques calculées (CTR, CPC)
- Métriques visuelles : Budget, Impressions, Clicks
- Bouton pour modifier le statut (activer/pause)
- Fallback de calcul si l'API stats ne répond pas

---

---

### Architecture & État

**Context API vs Redux**

Context API a été choisi plutôt que Redux pour plusieurs raisons :
- ✅ **Simplicité** : Pas de boilerplate (actions, reducers, store)
- ✅ **Scope adapté** : État global simple (liste campagnes + loading/error)
- ✅ **Performance suffisante** : Pas de problème de re-render sur cette échelle
- ✅ **Built-in React** : Pas de dépendance externe

Redux aurait été pertinent si :
- État très complexe avec relations multiples
- Besoin de middleware (saga, thunk pour logique async complexe)
- DevTools avancés requis pour debug

**Custom Hooks**

Création de `useCampaigns` et `useStats` pour :
- ✅ **Réutilisabilité** : Logique accessible dans tous les composants
- ✅ **Séparation des préoccupations** : Logique métier hors des composants UI
- ✅ **Testabilité** : Hooks testables indépendamment
- ✅ **Optimisation** : `useMemo` dans `useStats` évite recalculs inutiles

### UI/UX & Styling

**Tailwind CSS vs CSS-in-JS / CSS Modules**

Tailwind a été choisi pour :
- ✅ **Rapidité** : Classes utilitaires = développement ultra rapide
- ✅ **Cohérence** : Design system intégré (espacements, couleurs, breakpoints)
- ✅ **Pas de CSS orphelin** : Tout dans le JSX, PurgeCSS automatique
- ✅ **Responsive natif** : Breakpoints intégrés (`sm:`, `md:`, `lg:`)
- ✅ **Build optimisé** : CSS final minimal (~10KB après purge)

**Design responsive**

Approche mobile-first avec 3 breakpoints :
- Mobile (< 640px) : Cartes empilées, menu hamburger
- Tablette (640px - 1024px) : Grid 2 colonnes
- Desktop (>= 1024px) : Tableau complet, sidebar fixe

### Performance & Optimisation

**Vite vs Create React App**

Vite a été préféré pour :
- ✅ **HMR instantané** : Updates < 50ms (vs plusieurs secondes avec CRA)
- ✅ **Démarrage rapide** : Server start < 1 seconde
- ✅ **Build moderne** : ESBuild (50x plus rapide que Webpack)
- ✅ **Configuration minimale** : Fonctionne out-of-the-box

**Optimisations implémentées**

1. **Calculs mémoïsés** : `useMemo` pour CTR/CPC
2. **Pagination** : Limite les données chargées (50 par page)
3. **Lazy imports** : Prêt pour code splitting si besoin
4. **Debounce prévu** : Pour futures features (recherche, filtres)

### Architecture API

**Couche Services (`api.js`)**

Séparation des appels API pour :
- ✅ **Separation of Concerns** : Logique HTTP isolée de l'UI
- ✅ **Réutilisabilité** : Fonctions API utilisables partout
- ✅ **Testabilité** : Mockage facile pour tests
- ✅ **Maintenance** : Point unique de config (baseURL, intercepteurs)

**Gestion des erreurs**

Architecture à 3 niveaux :
1. **Intercepteurs Axios** : Gestion globale des erreurs HTTP
2. **Try/catch dans Context** : Gestion spécifique par opération
3. **États UI** : Affichage clair des erreurs avec retry

### Logique Métier AdTech

**Calculs de performances**

Le frontend calcule les métriques AdTech (CTR, CPC) en temps réel. Pour plus de détails sur les formules, consultez le [README principal](../README.md#-métriques-adtech).

**Gestion des cas limites**
- Division par zéro : Retourne 0 si `impressions = 0` ou `clicks = 0`
- Fallback calcul : Si l'API `/stats` échoue, calcul côté client
- Arrondi : 2 décimales pour lisibilité

**Workflow de statut**

Transitions de statut gérées par le backend :
```
paused ──────→ active
  ↑              │
  └──────────────┘
                 │
                 ↓
             finished (final)
```

Frontend : affiche/cache les boutons selon le statut actuel


---

## Exemple d'utilisation

### Créer une campagne
1. Cliquer sur "Créer une campagne"
2. Remplir le formulaire :
   - Nom : "Campagne Printemps 2026"
   - Annonceur : "Culture"
   - Budget : 5000
   - Dates : sélectionner début et fin
3. Valider → redirection vers la liste

### Consulter les statistiques
1. Cliquer sur une campagne dans la liste
2. Visualiser les métriques :
   - **CTR** : Taux de clic (clicks / impressions * 100)
   - **CPC** : Coût par clic (budget / clicks)
   - Impressions et clicks bruts

### Modifier le statut
1. Sur la page de détail, utiliser les boutons d'action
2. Choisir entre `active`, `paused`, `finished`
3. Mise à jour immédiate dans l'interface

---

## Améliorations futures

### Fonctionnalités
- **Export de données** : CSV/Excel pour les campagnes
- **Graphiques** : visualisation des performances dans le temps
- **Notifications** : toasts pour les actions réussies/échouées
- **Mode sombre** : thème dark/light

### Technique
- **TypeScript** : typage fort pour réduire les erreurs
- **Tests** : tests unitaires (Vitest) et tests E2E (Playwright)
- **Optimistic updates** : mise à jour UI avant confirmation serveur
- **Cache** : mise en cache des données avec React Query ou SWR
- **Accessibilité** : amélioration ARIA, navigation clavier
- **i18n** : internationalisation (français/anglais)

### Performance
- **Code splitting** : lazy loading des routes
- **Virtualisation** : pour les grandes listes (react-window)
- **Debounce** : sur les recherches et filtres
- **Service Worker** : pour le mode offline

### Sécurité
- **Authentification** : intégration JWT avec refresh tokens
- **Validation renforcée** : validation côté client ET serveur
- **Sanitization** : nettoyage des inputs utilisateur
