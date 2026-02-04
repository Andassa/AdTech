require("dotenv").config();
const axios = require("axios");
const mongoose = require("mongoose");
const Campaigndb = require("../src/campaign/models/campaign.model");
const connectDB = require("../src/config/database");

const API_URL = process.env.API_URL || "http://localhost:3000/api/campaign";

const advertisers = [
  "Culture",
  "TechCorp",
  "FashionBrand",
  "FoodDelivery",
  "TravelAgency",
  "FitnessCenter",
  "MusicStream",
  "EcoProducts",
];

const campaignNames = [
  "Campagne Printemps 2026",
  "Promotion Été",
  "Black Friday Special",
  "Lancement Produit",
  "Fidélisation Clients",
  "Acquisition Nouveaux",
  "Brand Awareness",
  "Retargeting Display",
  "Influence Marketing",
  "Email Marketing",
  "Social Media Boost",
  "Search Engine Ads",
  "Video Campaign",
  "Mobile App Install",
  "E-commerce Push",
  "Seasonal Sale",
  "Holiday Special",
  "New Year Launch",
  "Back to School",
  "Winter Collection",
];

// Fonction date aléatoire 
function randomDate(start, end) {
  const startDate = new Date(start);
  const endDate = new Date(end);
  const randomTime =
    startDate.getTime() +
    Math.random() * (endDate.getTime() - startDate.getTime());
  return new Date(randomTime);
}

// Fonction formater YYYY-MM-DD
function formatDate(date) {
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, "0");
  const day = String(date.getDate()).padStart(2, "0");
  return `${year}-${month}-${day}`;
}

// Fonctio créer campagne
async function createCampaign(campaignData) {
  try {
    const response = await axios.post(API_URL, campaignData);
    return response.data.data;
  } catch (error) {
    console.error(
      `Erreur lors de la création de la campagne "${campaignData.name}":`,
      error.response?.data?.message || error.message
    );
    return null;
  }
}

// Fonction ajouter impressions (optimisée - mise à jour directe en DB)
async function addImpressions(campaignId, count) {
  try {
    const campaign = await Campaigndb.findById(campaignId);
    if (campaign && campaign.status === "active") {
      campaign.impressions += count;
      await campaign.save();
    }
  } catch (error) {
    console.error(
      `Erreur lors de l'ajout d'impressions pour la campagne ${campaignId}:`,
      error.message
    );
  }
}

// Fonction ajouter clics (optimisée - mise à jour directe en DB)
async function addClicks(campaignId, count) {
  try {
    const campaign = await Campaigndb.findById(campaignId);
    if (campaign && campaign.status === "active") {
      campaign.clicks += count;
      await campaign.save();
    }
  } catch (error) {
    console.error(
      `Erreur lors de l'ajout de clics pour la campagne ${campaignId}:`,
      error.message
    );
  }
}

// Fonctionvérifier backend est accessible
async function checkBackend() {
  try {
    await axios.get(API_URL.replace("/campaign", "/campaign?next=1"));
    return true;
  } catch (error) {
    return false;
  }
}

// Fonction pour supprimer les campagnes existantes
async function clearExistingCampaigns() {
  try {
    const count = await Campaigndb.countDocuments();
    if (count > 0) {
      console.log(`🗑️  Suppression de ${count} campagnes existantes...`);
      await Campaigndb.deleteMany({});
      console.log("✅ Campagnes supprimées\n");
    }
  } catch (error) {
    console.error("❌ Erreur lors de la suppression:", error.message);
  }
}

// Fonction pour supprimer les campagnes existantes
async function clearExistingCampaigns() {
  try {
    const count = await Campaigndb.countDocuments();
    if (count > 0) {
      console.log(`🗑️  Suppression de ${count} campagnes existantes...`);
      await Campaigndb.deleteMany({});
      console.log("✅ Campagnes supprimées\n");
    }
  } catch (error) {
    console.error("❌ Erreur lors de la suppression:", error.message);
  }
}

// Fonction principale
async function seedDatabase() {
  console.log("🌱 Début de la génération de données de test...\n");

  // Vérifier que le backend est accessible
  console.log("🔍 Vérification de la connexion au backend...");
  const isBackendReady = await checkBackend();
  if (!isBackendReady) {
    console.error(
      " Erreur: Le backend n'est pas accessible à l'adresse:",
      API_URL
    );
    console.error(
      "   Assurez-vous que le backend est démarré avec 'npm start'"
    );
    process.exit(1);
  }
  console.log(" Backend accessible\n");

  // Se connecter à MongoDB pour les mises à jour directes
  console.log("🔗 Connexion à MongoDB...");
  try {
    await connectDB();
    console.log("✅ MongoDB connecté\n");
    
    // Supprimer les campagnes existantes pour éviter les conflits
    await clearExistingCampaigns();
  } catch (error) {
    console.error("❌ Erreur de connexion à MongoDB:", error.message);
    console.error("   Le script utilisera l'API (plus lent)");
  }

  const createdCampaigns = [];

  // Créer 20 campagnes
  for (let i = 0; i < 20; i++) {
    const startDate = randomDate("2026-01-01", "2026-12-31");
    const endDate = new Date(startDate);
    endDate.setDate(endDate.getDate() + Math.floor(Math.random() * 30) + 7); // 7 à 37 jours de durée

    const statuses = ["active", "paused", "finished"];
    const status =
      i < 8 ? "active" : i < 15 ? "paused" : statuses[Math.floor(Math.random() * statuses.length)];

    const campaignData = {
      name: campaignNames[i] || `Campagne ${i + 1}`,
      advertiser: advertisers[Math.floor(Math.random() * advertisers.length)],
      budget: Math.floor(Math.random() * 50000) + 1000, 
      startDate: formatDate(startDate),
      endDate: formatDate(endDate),
    };

    console.log(` Création de la campagne: ${campaignData.name}`);
    const campaign = await createCampaign(campaignData);

    if (campaign) {
      // Ajouter des impressions et clics pour les campagnes actives 
      if (i < 8) {
        const impressions = Math.floor(Math.random() * 5000) + 500; 
        const clicks = Math.floor(impressions * (Math.random() * 0.05 + 0.01));

        console.log(
          `   Ajout de ${impressions} impressions et ${clicks} clics...`
        );

        // Ajouter les impressions
        await addImpressions(campaign._id, impressions);

        // Ajouter les clics
        await addClicks(campaign._id, clicks);
      }

      // Mettre à jour  statut 
      if (status !== "active") {
        try {
          await axios.patch(`${API_URL}/${campaign._id}/status`, { status });
          campaign.status = status;
          console.log(`  🔄 Statut changé en: ${status}`);
        } catch (error) {
          console.error(
            `Erreur lors de la mise à jour du statut:`,
            error.response?.data?.message || error.message
          );
        }
      }

      createdCampaigns.push(campaign);
    }

    //  délai pour éviter de surcharger l'API
    await new Promise((resolve) => setTimeout(resolve, 100));
  }

  console.log("\n Génération terminée !");
  console.log(` ${createdCampaigns.length} campagnes créées avec succès\n`);

  // Afficher un résumé
  const activeCount = createdCampaigns.filter((c) => c.status === "active").length;
  const pausedCount = createdCampaigns.filter((c) => c.status === "paused").length;
  const finishedCount = createdCampaigns.filter((c) => c.status === "finished").length;

  console.log(" Résumé:");
  console.log(`  - Actives: ${activeCount}`);
  console.log(`  - En pause: ${pausedCount}`);
  console.log(`  - Terminées: ${finishedCount}\n`);

  console.log(" Vous pouvez maintenant visualiser les données dans le frontend !");

  // Fermer la connexion MongoDB
  if (mongoose.connection.readyState === 1) {
    await mongoose.connection.close();
    console.log("\n🔌 Connexion MongoDB fermée");
  }
}

// Exécuter le script
seedDatabase().catch((error) => {
  console.error(" Erreur lors de l'exécution du script:", error.message);
  if (mongoose.connection.readyState === 1) {
    mongoose.connection.close();
  }
  process.exit(1);
});

