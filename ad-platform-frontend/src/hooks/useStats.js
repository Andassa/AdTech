import { useMemo } from 'react';

/**
 *Hook pou les statistiques CTR et CPC
 * Utilisé comme backup si l'API stats ne répond pas
 * @param {Object} params 
 * @returns {Object} 
 */
export const useStats = ({ budget = 0, impressions = 0, clicks = 0 }) => {
  const stats = useMemo(() => {
    // le formule que j'ai utilisé c'est CTR = (clicks / impressions) * 100
    let ctr = 0;
    if (impressions > 0) {
      ctr = (clicks / impressions) * 100;
    }

    
    // le formule pur Cost Per Click= budget / clicks
    let cpc = 0;
    if (clicks > 0) {
      cpc = budget / clicks;
    }

    // arrondissement à2 décimales
    return {
      ctr: Number(ctr.toFixed(2)),
      cpc: Number(cpc.toFixed(2)),
    };
  }, [budget, impressions, clicks]);

  return stats;
};

export default useStats;

