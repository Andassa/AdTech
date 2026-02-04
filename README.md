# AdTech Campaign Platform

## 📋 Description

Plateforme complète de gestion de campagnes publicitaires digitales permettant de créer, suivre et analyser les performances de campagnes publicitaires. Le projet est composé d'une **API REST backend** et d'une **interface React frontend** qui travaillent ensemble pour offrir une solution AdTech complète.

### Fonctionnalités principales

- ✅ **Gestion de campagnes** : Création, consultation et modification de campagnes publicitaires
- ✅ **Recherche en temps réel** : Recherche automatique par nom, annonceur ou statut (déclenchée après la saisie)
- ✅ **Suivi des performances** : Calcul et affichage des métriques clés (CTR, CPC)
- ✅ **Gestion des statuts** : Activation, pause et finalisation des campagnes
- ✅ **Interface moderne** : Design responsive avec expérience utilisateur optimale
- ✅ **Documentation API** : Swagger/OpenAPI pour faciliter l'intégration

---

## 🏗️ Structure du projet

Le projet est organisé en deux sous-dossiers principaux :

```
AdTech/
├── backend/              # API REST (Node.js + Express + MongoDB)
│   ├── src/
│   │   ├── campaign/     # Module campagne (controllers, services, models)
│   │   ├── config/       # Configuration (database, swagger)
│   │   └── app.js        # Point d'entrée Express
│   └── README.md         # Documentation détaillée du backend
│
└── ad-platform-frontend/ # Interface React (Vite + Tailwind)
    ├── src/
    │   ├── components/   # Composants réutilisables
    │   ├── pages/        # Pages de l'application
    │   ├── context/      # Gestion d'état globale
    │   ├── hooks/        # Hooks personnalisés
    │   └── services/     # Services API
    └── README.md         # Documentation détaillée du frontend
```

### Backend (`backend/`)

API REST construite avec **Node.js**, **Express** et **MongoDB** qui gère :
- La persistance des données (MongoDB + Mongoose)
- La validation des données (Joi)
- La logique métier (calculs CTR/CPC, transitions de statut)
- La documentation API (Swagger/OpenAPI)

📖 **Pour plus de détails** : Consultez [`backend/README.md`](backend/README.md)

### Frontend (`ad-platform-frontend/`)

Interface React moderne construite avec **Vite** et **Tailwind CSS** qui offre :
- Une expérience utilisateur fluide et responsive
- La visualisation des campagnes et statistiques
- La création et gestion des campagnes
- Une architecture scalable avec Context API et hooks personnalisés

📖 **Pour plus de détails** : Consultez [`ad-platform-frontend/README.md`](ad-platform-frontend/README.md)

---

## 🚀 Démarrage rapide

### Prérequis

- **Node.js** (v18 ou supérieur)
- **npm** ou **yarn**
- **MongoDB** (local ou MongoDB Atlas)

### Installation et lancement

#### 1. Cloner le projet

```bash
git clone git@github.com:Andassa/AdTech.git
cd AdTech
```

#### 2. Configuration du Backend

```bash
cd backend
npm install
```

Créer un fichier `.env` à la racine du dossier `backend/` :

```.env
PORT=3000
MONGO_URI=<votre_uri_mongodb>
NB_PAGINATION=10
```

**Exemples d'URI MongoDB** :
- **MongoDB Atlas** : `mongodb+srv://username:password@cluster.mongodb.net/dbname?retryWrites=true&w=majority`
- **MongoDB Local** : `mongodb://localhost:27017/adtech`

#### 3. Configuration du Frontend

```bash
cd ../ad-platform-frontend
npm install
```

Créer un fichier `.env` à la racine du dossier `ad-platform-frontend/` :

```.env
VITE_API_URL=http://localhost:3000/api/campaign
```

**Note** : Par défaut, l'application utilise `http://localhost:3000/api/campaign` si la variable n'est pas définie.

#### 4. Lancer le projet

**Terminal 1 - Backend** :
```bash
cd backend
npm start
```
Le serveur API sera accessible sur : **http://localhost:3000**

**Terminal 2 - Frontend** :
```bash
cd ad-platform-frontend
npm run dev
```
L'application sera accessible sur : **http://localhost:5173**

#### 5. Générer des données de test (optionnel)

Pour générer 20 campagnes de test avec des données variées (statuts, budgets, impressions, clics) :

**Terminal 3 - Génération de données** :
```bash
cd backend
npm run seed
```

Cette commande va créer :
- 20 campagnes avec des noms, annonceurs, budgets et dates variés
- 8 campagnes actives avec des impressions et clics pour visualiser les statistiques (CTR, CPC)
- Des campagnes avec différents statuts (active, paused, finished)

**Note** : Le backend doit être démarré pour que cette commande fonctionne.

---

## 📚 Documentation

### Documentation API (Swagger)

Une fois le backend démarré, accédez à la documentation interactive Swagger :

**http://localhost:3000/api-docs**

La documentation Swagger permet de :
- Consulter tous les endpoints disponibles
- Voir les schémas de données et les exemples
- Tester les API directement depuis l'interface
- Comprendre les paramètres requis et les réponses attendues

### Documentation détaillée

- **Backend** : [`backend/README.md`](backend/README.md) - Architecture, endpoints, choix techniques
- **Frontend** : [`ad-platform-frontend/README.md`](ad-platform-frontend/README.md) - Composants, hooks, architecture UI

---

## 🎯 Roadmap globale

Cette roadmap combine et enrichit les améliorations prévues pour le backend et le frontend.

### Phase 1 : Sécurité et Authentification (Priorité Haute)

- [ ] **Authentification JWT** : Système d'authentification avec refresh tokens
- [ ] **Autorisation** : Gestion des rôles et permissions (admin, annonceur, viewer)
- [ ] **Sécurisation des endpoints** : Middleware d'authentification sur les routes sensibles
- [ ] **Validation renforcée** : Validation côté client ET serveur
- [ ] **Sanitization** : Nettoyage des inputs utilisateur pour prévenir les injections

### Phase 2 : Tests et Qualité (Priorité Haute)

- [ ] **Tests backend** : Tests unitaires (Jest) et tests d'intégration (Supertest)
- [ ] **Tests frontend** : Tests unitaires (Vitest) et tests E2E (Playwright)
- [ ] **Coverage** : Objectif de 80% de couverture de code
- [ ] **CI/CD** : Pipeline automatisé (GitHub Actions / GitLab CI)
- [ ] **Linting et Formatting** : ESLint + Prettier avec règles strictes

### Phase 3 : Fonctionnalités avancées (Priorité Moyenne)

- [ ] **Graphiques de performances** : Visualisation des métriques dans le temps (Recharts)
- [ ] **Export de données** : Export CSV/Excel des campagnes et statistiques
- [ ] **Recherche et filtres avancés** : Filtrage multi-critères, tri sur plusieurs champs
- [ ] **Notifications** : Système de toasts pour les actions réussies/échouées
- [ ] **Historique des changements** : Audit trail pour les modifications de statut
- [ ] **Mode sombre** : Thème dark/light avec persistance des préférences

### Phase 4 : Performance et Scalabilité (Priorité Moyenne)

- [ ] **Cache** : Mise en cache des données avec React Query ou SWR
- [ ] **Code splitting** : Lazy loading des routes pour optimiser le chargement initial
- [ ] **Virtualisation** : Virtualisation des listes pour les grandes collections (react-window)
- [ ] **Debounce** : Debounce sur les recherches et filtres
- [ ] **Optimistic updates** : Mise à jour UI avant confirmation serveur
- [ ] **Service Worker** : Mode offline avec synchronisation différée

### Phase 5 : Internationalisation et Accessibilité (Priorité Basse)

- [ ] **i18n** : Internationalisation (français/anglais) avec react-i18next
- [ ] **Accessibilité** : Amélioration ARIA, navigation clavier complète
- [ ] **WCAG 2.1** : Conformité niveau AA pour l'accessibilité web

### Phase 6 : Migration TypeScript (Priorité Basse)

- [ ] **Backend TypeScript** : Migration progressive du backend vers TypeScript
- [ ] **Frontend TypeScript** : Migration du frontend vers TypeScript
- [ ] **Typage fort** : Réduction des erreurs grâce au typage statique

---

## 🛠️ Stack technique

### Backend
- **Node.js** - Runtime JavaScript
- **Express** - Framework web
- **MongoDB** - Base de données NoSQL
- **Mongoose** - ODM pour MongoDB
- **Joi** - Validation de schémas
- **Swagger/OpenAPI** - Documentation API

### Frontend
- **React 19** - Bibliothèque UI
- **Vite** - Build tool et dev server
- **React Router DOM** - Routing
- **Tailwind CSS** - Framework CSS utilitaire
- **Axios** - Client HTTP
- **Context API** - Gestion d'état
- **Lucide React** - Bibliothèque d'icônes

---

## 🔍 Recherche de campagnes

La plateforme dispose d'une fonctionnalité de recherche en temps réel :

- **Barre de recherche** : Centrée au-dessus du tableau des campagnes
- **Recherche automatique** : Se déclenche automatiquement après **4 secondes** de pause dans la saisie
- **Critères de recherche** : Nom, annonceur ou statut de la campagne
- **Important** : Il faut **taper dans le champ de recherche et attendre 4 secondes** pour déclencher la recherche automatique

**Comment utiliser** :
1. Accéder à la liste des campagnes
2. Taper dans le champ de recherche centré au-dessus du tableau
3. Attendre **4 secondes** (la recherche se fait automatiquement)
4. Les résultats filtrés s'affichent instantanément

---

## 📊 Métriques AdTech

Le projet calcule et affiche les métriques clés de l'industrie publicitaire :

### CTR (Click Through Rate)
Mesure l'attractivité d'une campagne :
```
CTR = (clicks / impressions) × 100
```

### CPC (Cost Per Click)
Mesure le coût d'acquisition :
```
CPC = budget / clicks
```

---

## 🤝 Contribution

Ce projet est structuré pour faciliter les contributions :

1. **Backend** : Architecture en couches (controllers / services / models)
2. **Frontend** : Composants réutilisables et hooks personnalisés
3. **Documentation** : README détaillés pour chaque partie du projet

Pour contribuer :
1. Consultez les README spécifiques de chaque sous-projet
2. Respectez les conventions de code existantes
3. Ajoutez des tests pour les nouvelles fonctionnalités


## 🔗 Liens utiles

- **Documentation Backend** : [`backend/README.md`](backend/README.md)
- **Documentation Frontend** : [`ad-platform-frontend/README.md`](ad-platform-frontend/README.md)
- **API Swagger** : http://localhost:3000/api-docs (une fois le backend démarré)

