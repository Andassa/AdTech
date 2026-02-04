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
- Swagger/OpenAPI (documentation API)

---

## Installation

```bash
git clone git@github.com:Andassa/AdTech.git
cd AdTech/backend
npm install
```

## Configuration

Créer un fichier `.env` à la racine du projet backend avec les variables suivantes :

```.env
PORT=3000
MONGO_URI=<votre_uri_mongodb>
NB_PAGINATION=10
```

**Exemples d'URI MongoDB** :
- **MongoDB Atlas** : `mongodb+srv://username:password@cluster.mongodb.net/dbname?retryWrites=true&w=majority`
- **MongoDB Local** : `mongodb://localhost:27017/adtech`

⚠️ **Important** : Le backend doit être démarré et connecté à MongoDB pour que le frontend puisse fonctionner correctement.
## Lancer le projet
```bash
npm start
```
Le serveur sera accessible sur : http://localhost:3000

## Documentation API (Swagger)

L'API est documentée avec Swagger. Une fois le serveur démarré, accédez à la documentation interactive :

**http://localhost:3000/api-docs**

Pour plus de détails sur l'utilisation de Swagger, consultez le [README principal](../README.md#-documentation).

## Endpoints
```
| Méthode | Endpoint                        | Description                                                                                                  |
| ------- | ------------------------------- | ------------------------------------------------------------------------------------------------------------ |
| POST    | /api/campaign                  | Créer une nouvelle campagne                                                                                  |
| GET     | /api/campaign                  | Lister les campagnes (filtrage par status, startDate, endDate possible, pagination via `next` et `previous`) |
| GET     | /api/campaign/:id              | Détails d'une campagne                                                                                       |
| PATCH   | /api/campaign/:id/status       | Mettre à jour le statut (`active`, `paused`, `finished`)                                                     |
| GET     | /api/campaign/:id/stats        | Récupérer les statistiques d'une campagne (CTR, CPC)                                                         |
| POST    | /api/campaign/:id/click        | Enregistrer un clic pour une campagne                                                                        |
| POST    | /api/campaign/:id/impression   | Enregistrer une impression pour une campagne                                                                 |
```

## Exemple POST /api/campaign
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
## Exemple GET /api/campaign
```bash
GET /api/campaign?status=active&next=1
```

## Exemple PATCH /api/campaign/:id/status
```json
{
  "status": "active"
}
```
## Choix techniques

Architecture en couches : controllers / services / models

Validation avec Joi pour sécuriser les données entrantes

Documentation API avec Swagger/OpenAPI pour faciliter l'intégration et les tests

Logique métier isolée dans le service (ex: calcul CTR/CPC, transitions de statut)

Pagination simple pour scalabilité (next / previous)

Gestion d’erreurs cohérente avec codes HTTP appropriés (400 / 404 / 500)

## Améliorations futures

Authentification JWT pour sécuriser l’API

Tests unitaires et intégration (Jest / Supertest)

Filtrage avancé et tri sur plusieurs champs

Historique des changements de statut pour audit