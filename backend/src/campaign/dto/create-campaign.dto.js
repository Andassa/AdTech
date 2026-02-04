const Joi = require("joi");

exports.createCampaignDto = Joi.object({
  name: Joi.string().required(),
  advertiser: Joi.string().required(),
  budget: Joi.number().positive().required(),
  startDate: Joi.date().required(),
  endDate: Joi.date().greater(Joi.ref("startDate")).required(),
});

