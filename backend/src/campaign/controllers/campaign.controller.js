require( "dotenv" ).config();
const campaignService = require( "../service/campaign.service" );
const { createCampaignDto } = require( "../dto/create-campaign.dto" );

exports.getCampaigns = async (req, res) => {
  try {
    const { status, startDate, endDate, next, previous } = req.query;

    const filters = {
      status,
      startDate,
      endDate,
    };

    const result = await campaignService.getLists(
      filters,
      next,
      previous
    );

    res.status(200).json({
      code: 200,
      success: true,
      message: "Campaigns fetched successfully",
      data: result.campaigns,
      pagination: result.pagination,
    });
  } catch (error) {
    console.error("getCampaigns controller error:", error);

    res.status(500).json({
      code: 500,
      success: false,
      message: "Internal server error",
    });
  }
};



exports.createCampaign = async ( req, res ) =>
{
  try {
    const { error } = createCampaignDto.validate( req.body );
    if ( error )
    {
      return res.status( 400 ).json( {  code: 400, success: false, message: error.details[ 0 ].message } );
    }
    const campaign = await campaignService.createCampaign( req.body );

    res.status(201).json({
      code: 201,
      success: true,
      message: "Campaign created successfully",
      data: campaign
    });
  } catch (error) {
    console.error("createCampaign controller error:", error);
    res.status(500).json({
      code: 500,
      success: false,
      message: error.message,
    });
  }
};


exports.getCampaignById = async ( req, res ) =>
{
  try {
    const campaign = await campaignService.getCampaignById( req.params.id );
    if ( !campaign )
    {
      return res.status( 404 ).json( { code: 404, success: false, message: "Campaign not found" } );
    }
    res.status(200).json({
      code: 200,
      success: true,
      message: "Campaign fetched successfully",
      data: campaign
    });
  } catch (error) {
    res.status(500).json({
      code: 500,
      success: false,
      message: error.message,
    });
  }

};



exports.updateStatus = async ( req, res ) =>
{
  try {
    if (!["active", "paused", "finished"].includes(req.body.status)) {
      return res.status(400).json({
        code: 400,
        success: false,
        message: "Invalid status",
      });
    }
    const campaign = await campaignService.updateStatus( req.params.id, req.body.status );
    res.status(200).json({
      code: 200,
      success: true,
      message: "Campaign status updated successfully",
      data: campaign
    });
  } catch (error) {
    res.status(500).json({
      code: 500,
      success: false,
      message: error.message,
    });
  }
};

exports.getStats = async ( req, res ) =>
{
  try {
    const campaign = await campaignService.getCampaignById( req.params.id );
    const stats = await campaignService.getStats( campaign );
    res.status(200).json({
      code: 200,
      success: true,
      message: "Campaign stats fetched successfully",
      data: stats
    });
  } catch (error) {
    res.status(500).json({
      code: 500,
      success: false,
      message: error.message,
    });
  }
};


exports.trackClick = async (req, res) => {
  try {
    const campaign = await campaignService.incrementClick(req.params.id);

    res.status(200).json({
      code: 200,
      success: true,
      message: "Click tracked successfully",
      data: campaign,
    });
  } catch (error) {
    res.status(400).json({
      code: 400,
      success: false,
      message: error.message,
    });
  }
};


exports.trackImpression = async (req, res) => {
  try {
    const campaign = await campaignService.incrementImpression(req.params.id);

    res.status(200).json({
      code: 200,
      success: true,
      message: "Impression tracked successfully",
      data: campaign,
    });
  } catch (error) {
    res.status(400).json({
      code: 400,
      success: false,
      message: error.message,
    });
  }
};

