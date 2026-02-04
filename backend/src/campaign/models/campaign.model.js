const mongoose = require("mongoose");

var CampaignSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
  },
  advertiser: {
    type: String,
    required: true,
  },
  budget: {
    type: Number,
    required: true,
    min: 0,
    default: 0,
  },
  startDate: {
    type: Date,
    required: true,
  },
  endDate: {
    type: Date,
    required: true,
  },
  status: {
    type: String,
    required: true,
    enum: ["active", "paused", "finished"],
    default: "active",
  },

  impressions: {
    type: Number,
    default: 0,
  },
  clicks: {
    type: Number,
    default: 0
  }
});

CampaignSchema.set("timestamps", true); 

const Campaigndb = mongoose.model("campaign", CampaignSchema);
module.exports = Campaigndb;
