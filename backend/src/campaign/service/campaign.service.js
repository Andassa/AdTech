require( "dotenv" ).config();
const mongoose = require( "mongoose" );

const Campaigndb = require( "../models/campaign.model" );

exports.getNext = ( nextPage, totalPage ) =>
{
    var nbLimit = process.env.NB_PAGINATION;
    var skipValue = 0;
    var nbEnd = ( skipValue - 1 ) + nbLimit;
    if ( nextPage <= 1 )
    {
        nextPage = 1;
    }
    if ( nextPage + nbLimit <= totalPage )
    {
        skipValue = ( nextPage - 1 ) + nbLimit;
        nbEnd = ( skipValue ) + nbLimit;
        if ( nbEnd >= totalPage )
        {
            nbEnd = totalPage;
        }
    } else
    {
        skipValue = nextPage - 1;
        nbEnd = totalPage;
    }
    return { nbPage: skipValue + 1, nbEnd: nbEnd, nbLimit: nbLimit, skipValue: skipValue, totalPage: totalPage };
};


exports.getPrevious = ( previousPage, totalPage ) =>
{
    var nbLimit = process.env.NB_PAGINATION;
    var skipValue = 0;
    var nbEnd = ( skipValue - 1 ) + nbLimit;
    if ( previousPage - nbLimit >= 1 )
    {
        skipValue = ( previousPage - 1 ) - nbLimit;
        nbEnd = skipValue + nbLimit;
        if ( nbEnd <= 1 )
        {
            nbEnd = nbLimit;
        }
    } else
    {
        skipValue = 0;
        previousPage = 1;
        nbEnd = nbLimit;
    }
    return { nbPage: skipValue + 1, nbEnd: nbEnd, nbLimit: nbLimit, skipValue: skipValue, totalPage: totalPage };
};

exports.prepareFilter = ( key, startDate, endDate ) =>
{
    var filter = { $and: [] };
    if ( key == null || key == "" )
    {
        key = "";
    }
    const regex = new RegExp( key, 'i' );
    var tmp = regex;
    filter.$and.push( {
        $or: [ { name: { $regex: tmp } }, { advertiser: { $regex: tmp } } ]
    } );

    if ( startDate != null && endDate != null && startDate.trim() != "" && endDate.trim() != "" )
    {
        filter.$and.push( {
            $and: [ { startDate: { $gte: startDate } }, { endDate: { $lte: endDate } } ]
        } );
    }
    return filter;
};

exports.getLists = async ( filters, nbNext = null, nbPrevious = null ) =>
{
    try
    {
        const searchKeyword = this.prepareFilter(
            filters.status,
            filters.startDate,
            filters.endDate
        );

        const total = await Campaigndb.countDocuments( searchKeyword );

        let pagination = {
            page: 1,
            nbEnd: total,
            limit: Number( process.env.NB_PAGINATION ),
            skip: 0,
            total,
        };

        if ( nbNext )
        {
            pagination = this.getNext( Number( nbNext ), total );
        }

        if ( nbPrevious )
        {
            pagination = this.getPrevious( Number( nbPrevious ), total );
        }
        if ( total <= pagination.nbEnd )
        {
            pagination.nbEnd = total;
        }
        const campaigns = await Campaigndb.find( searchKeyword )
            .skip( pagination.skip )
            .limit( pagination.limit )
            .sort( { createdAt: -1 } );

        return {
            campaigns,
            pagination,
        };
    } catch ( error )
    {
        console.error( "getLists service error:", error );
        throw new Error( "Internal server error" );
    }

};


exports.createCampaign = async ( data ) =>
{
    try
    {
        const campaign = await Campaigndb.findOne( { name: data.name } );
        if ( campaign )
        {
            throw new Error( "Campaign already exists" );
        }
        const newCampaign = await Campaigndb.create( data );
        return newCampaign;
    } catch ( error )
    {
        console.error( "createCampaign service error:", error );
        throw new Error( error.message );
    }
};


exports.getCampaignById = async ( id ) =>
{
    try
    {
        if ( mongoose.Types.ObjectId.isValid( id ) )
        {
            return Campaigndb.findById( id );
        }
        else
        {
            throw new Error( "Invalid campaign ID" );
        }
    } catch ( error )
    {
        console.error( "getCampaignById service error:", error );
        throw new Error( error.message );
    }
};

const allowedTransitions = {
    paused: [ "active" ],
    active: [ "paused", "finished" ],
    finished: [],
};

exports.updateStatus = async ( id, newStatus ) =>
{
    const campaign = await Campaigndb.findById( id );

    if ( !campaign )
    {
        throw new Error( "Campaign not found" );
    }

    if (!Object.keys(allowedTransitions).includes(newStatus)) {
        throw new Error("Invalid status");
      }

      const currentStatus = campaign.status;
      const transitions = allowedTransitions[currentStatus];

      if (!transitions) {
        throw new Error(`Unknown current status: ${currentStatus}`);
      }

      if (!transitions.includes(newStatus)) {
        throw new Error(
          `Invalid status transition from ${currentStatus} to ${newStatus}`
        );
      }

    campaign.status = newStatus;
    await campaign.save();

    return campaign;
};


exports.getStats = async ( campaign ) =>
{
    const ctr =
        campaign.impressions > 0
            ? ( campaign.clicks / campaign.impressions ) * 100
            : 0;

    const cpc =
        campaign.clicks > 0
            ? campaign.budget / campaign.clicks
            : 0;

    return {
        campaign: campaign,
        impressions: campaign.impressions,
        clicks: campaign.clicks,
        ctr: Number( ctr.toFixed( 2 ) ),
        cpc: Number( cpc.toFixed( 2 ) ),
    };
};

// Améliorations et bonus
exports.incrementClick = async ( id ) =>
{
    const campaign = await Campaigndb.findById( id );

    if ( !campaign )
    {
        throw new Error( "Campaign not found" );
    }

    if ( campaign.status !== "active" )
    {
        throw new Error( "Campaign is not active" );
    }

    campaign.clicks += 1;
    await campaign.save();

    return campaign;
};


exports.incrementImpression = async ( id ) =>
{
    const campaign = await Campaigndb.findById( id );

    if ( !campaign )
    {
        throw new Error( "Campaign not found" );
    }

    if ( campaign.status !== "active" )
    {
        throw new Error( "Campaign is not active" );
    }

    campaign.impressions += 1;
    await campaign.save();

    return campaign;
};
