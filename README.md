# Mini AdTech Campaign Backend

## Description
API REST permettant de gérer des campagnes publicitaires digitales :
- Création de campagne
- Suivi des performances
- Consultation de statistiques simples (CTR, CPC)

---

## Stack
- Node.js
- Express
- MongoDB
- Mongoose
- Joi (validation)

---

## Installation

```bash
git clone <repo-url>
cd project-backend
npm install
````

## Configuration
Créer un fichier .env à la racine du projet avec les variables suivantes :
```.env
PORT=3000
MONGO_URI=<votre_uri_mongodb>
NB_PAGINATION=10
```
## Lancer le projet
```.bash
npm start
```
Le serveur sera accessible sur : http://localhost:3000

## Endpoints
```
| Méthode | Endpoint                  | Description                                                                                                  |
| ------- | ------------------------- | ------------------------------------------------------------------------------------------------------------ |
| POST    | /api/campaigns            | Créer une nouvelle campagne                                                                                  |
| GET     | /api/campaigns            | Lister les campagnes (filtrage par status, startDate, endDate possible, pagination via `next` et `previous`) |
| GET     | /api/campaigns/:id        | Détails d’une campagne                                                                                       |
| PATCH   | /api/campaigns/:id/status | Mettre à jour le statut (`active`, `paused`, `finished`)                                                     |
| GET     | /api/campaigns/:id/stats  | Récupérer les statistiques d’une campagne (CTR, CPC)                                                         |
```

## Exemple POST /api/campaigns
```json
{
  "name": "Campaign Test",
  "advertiser": "Culture",
  "budget": 5000,
  "startDate": "2026-02-10",
  "endDate": "2026-02-17",
  "status": "paused"
}
```
## Exemple PATCH /api/campaigns/:id/status
```lua
GET /api/campaigns?status=active&next=1
```
## Choix techniques

Architecture en couches : controllers / services / models

Validation avec Joi pour sécuriser les données entrantes

Logique métier isolée dans le service (ex: calcul CTR/CPC, transitions de statut)

Pagination simple pour scalabilité (next / previous)

Gestion d’erreurs cohérente avec codes HTTP appropriés (400 / 404 / 500)

## Améliorations futures

Authentification JWT pour sécuriser l’API

Tests unitaires et intégration (Jest / Supertest)

Filtrage avancé et tri sur plusieurs champs

Historique des changements de statut pour audit