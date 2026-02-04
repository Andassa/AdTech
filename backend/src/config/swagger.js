const swaggerJsdoc = require('swagger-jsdoc');

const options = {
  definition: {
    openapi: '3.0.0',
    info: {
      title: 'AdTech Campaign API',
      version: '1.0.0',
      description: 'API REST pour la gestion de campagnes publicitaires digitales',
      contact: {
        name: 'API Support',
      },
    },
    servers: [
      {
        url: 'http://localhost:3000',
        description: 'Serveur de développement',
      },
    ],
    components: {
      schemas: {
        Campaign: {
          type: 'object',
          required: ['name', 'advertiser', 'budget', 'startDate', 'endDate'],
          properties: {
            _id: {
              type: 'string',
              description: 'Identifiant unique de la campagne',
              example: '507f1f77bcf86cd799439011',
            },
            name: {
              type: 'string',
              description: 'Nom de la campagne',
              example: 'Campaign Test',
            },
            advertiser: {
              type: 'string',
              description: 'Nom de l\'annonceur',
              example: 'Culture',
            },
            budget: {
              type: 'number',
              minimum: 0,
              description: 'Budget de la campagne',
              example: 5000,
            },
            startDate: {
              type: 'string',
              format: 'date',
              description: 'Date de début de la campagne',
              example: '2026-02-10',
            },
            endDate: {
              type: 'string',
              format: 'date',
              description: 'Date de fin de la campagne',
              example: '2026-02-17',
            },
            status: {
              type: 'string',
              enum: ['active', 'paused', 'finished'],
              default: 'active',
              description: 'Statut de la campagne',
              example: 'active',
            },
            impressions: {
              type: 'number',
              default: 0,
              description: 'Nombre d\'impressions',
              example: 1000,
            },
            clicks: {
              type: 'number',
              default: 0,
              description: 'Nombre de clics',
              example: 50,
            },
            createdAt: {
              type: 'string',
              format: 'date-time',
              description: 'Date de création',
            },
            updatedAt: {
              type: 'string',
              format: 'date-time',
              description: 'Date de mise à jour',
            },
          },
        },
        CreateCampaign: {
          type: 'object',
          required: ['name', 'advertiser', 'budget', 'startDate', 'endDate'],
          properties: {
            name: {
              type: 'string',
              description: 'Nom de la campagne',
              example: 'Campaign Test',
            },
            advertiser: {
              type: 'string',
              description: 'Nom de l\'annonceur',
              example: 'Culture',
            },
            budget: {
              type: 'number',
              minimum: 0,
              description: 'Budget de la campagne',
              example: 5000,
            },
            startDate: {
              type: 'string',
              format: 'date',
              description: 'Date de début de la campagne',
              example: '2026-02-10',
            },
            endDate: {
              type: 'string',
              format: 'date',
              description: 'Date de fin de la campagne (doit être après startDate)',
              example: '2026-02-17',
            },
          },
        },
        UpdateStatus: {
          type: 'object',
          required: ['status'],
          properties: {
            status: {
              type: 'string',
              enum: ['active', 'paused', 'finished'],
              description: 'Nouveau statut de la campagne',
              example: 'active',
            },
          },
        },
        CampaignStats: {
          type: 'object',
          properties: {
            ctr: {
              type: 'number',
              description: 'Click-Through Rate (CTR) en pourcentage',
              example: 5.0,
            },
            cpc: {
              type: 'number',
              description: 'Cost Per Click (CPC)',
              example: 0.5,
            },
            impressions: {
              type: 'number',
              description: 'Nombre total d\'impressions',
              example: 1000,
            },
            clicks: {
              type: 'number',
              description: 'Nombre total de clics',
              example: 50,
            },
            budget: {
              type: 'number',
              description: 'Budget de la campagne',
              example: 5000,
            },
            spent: {
              type: 'number',
              description: 'Montant dépensé',
              example: 25.0,
            },
          },
        },
        ApiResponse: {
          type: 'object',
          properties: {
            code: {
              type: 'number',
              description: 'Code de statut HTTP',
              example: 200,
            },
            success: {
              type: 'boolean',
              description: 'Indique si la requête a réussi',
              example: true,
            },
            message: {
              type: 'string',
              description: 'Message de réponse',
              example: 'Operation successful',
            },
            data: {
              type: 'object',
              description: 'Données de la réponse',
            },
          },
        },
        Pagination: {
          type: 'object',
          properties: {
            next: {
              type: 'number',
              nullable: true,
              description: 'Numéro de page suivant',
              example: 2,
            },
            previous: {
              type: 'number',
              nullable: true,
              description: 'Numéro de page précédent',
              example: null,
            },
            total: {
              type: 'number',
              description: 'Nombre total de campagnes',
              example: 25,
            },
          },
        },
        ErrorResponse: {
          type: 'object',
          properties: {
            code: {
              type: 'number',
              description: 'Code de statut HTTP',
              example: 400,
            },
            success: {
              type: 'boolean',
              description: 'Indique si la requête a réussi',
              example: false,
            },
            message: {
              type: 'string',
              description: 'Message d\'erreur',
              example: 'Invalid request',
            },
          },
        },
      },
    },
    tags: [
      {
        name: 'Campaigns',
        description: 'Endpoints pour la gestion des campagnes publicitaires',
      },
    ],
  },
  apis: ['../campaign/routes/*.docs.js', '../app.js'],
};

const swaggerSpec = swaggerJsdoc(options);

module.exports = swaggerSpec;

