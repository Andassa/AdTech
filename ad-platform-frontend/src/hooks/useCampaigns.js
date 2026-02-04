import { useCampaignContext } from '../context/CampaignContext';

/**
 * @returns {Object} Contexte complet des campagnes
 */
export const useCampaigns = () => {
  return useCampaignContext();
};

export default useCampaigns;

