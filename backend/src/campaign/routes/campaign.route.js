const express = require("express");
const router = express.Router();
const campaignController = require("../controllers/campaign.controller");

router.post("/", controller.createCampaign);
router.get("/", controller.getCampaigns);
router.get("/:id", controller.getCampaignById);
router.patch("/:id/status", controller.updateStatus);
router.get("/:id/stats", controller.getStats);
router.post("/:id/click", controller.trackClick);
router.post("/:id/impression", controller.trackImpression);

module.exports = router;