const express = require("express");
const bodyParser = require("body-parser");
const cors = require("cors");
const corsOptions = {
    origin: "*",
    credentials: true,
    optionSuccessStatus: 200,
  };

const app = express();
const server = require("http").createServer(app);

// Middleware pour gérer les requêtes CORS
app.use(cors(corsOptions));

// Middleware pour parser le corps des requêtes
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

// Middleware pour parser le corps des requêtes en JSON
app.use(express.json());

app.get("/", (req, res) => {
    res.status(200).json({ message: "Welcome to the backend API" });
});

// Routes pour la gestion des campagnes
const campaignRoutes = require("./campaign/routes/campaign.route");
app.use("/api/campaign", campaignRoutes);


app.use(function (req, res) {
    res.status(404).json({ message: "Route not found" });
  });
// Export du serveur
module.exports = server;
