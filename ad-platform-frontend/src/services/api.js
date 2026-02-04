import axios from 'axios';
const api = axios.create({
    baseURL: 'http://localhost:3000/api/campaign',
    headers: {
      'Content-Type': 'application/json',
    },
  });

  // L'API renvoie toujours un objet { code, success, message, data }

  api.interceptors.response.use(
    (response) => {

      if (response.data && !response.data.success) {
        return Promise.reject(new Error(response.data.message || 'Une erreur est survenue'));
      }
      return response;
    },
    (error) => {
        // Gestian des erreurs de connexion
        const errorMessage = error.response?.data?.message || error.message || 'Erreur de connexion';
        return Promise.reject(new Error(errorMessage));
      }
    );
    api.interceptors.response.use(
        (response) => {
            if (response.data && !response.data.success) {
                return Promise.reject(new Error(response.data.message || 'Une erreur est survenue'));
              }
              return response;
            },
            (error) => {
                const errorMessage = error.response?.data?.message || error.message || 'Erreur de connexion';
                return Promise.reject(new Error(errorMessage));
              }
            );
            /**
 * Récupère les campagnes avec filtres et pagination
 *
 * @param {Object} filters - Filtrage possible : status, startDate, endDate, next, previous
 * @returns {Promise<Object>} Objet avec { code, success, message, data: campaigns[], pagination }
 */
            export const getCampaigns = async (filters = {}) => {
                try {
                  const params = {};
                  
                  if (filters.status) params.status = filters.status;
                  if (filters.startDate) params.startDate = filters.startDate;
                  if (filters.endDate) params.endDate = filters.endDate;
                  if (filters.next) params.next = filters.next;
                  if (filters.previous) params.previous = filters.previous;
              
                  const response = await api.get('/', { params });
                  return response.data; 
                } catch (error) {
                  console.error('Erreur lors de la récupération des campagnes:', error);
                  throw error;
                }
              };
              /**
 * Crée une nouvelle campagne.
 * @param {Object} campaignData - Donnée de la campagne
 * @returns {Promise<Object>} - Promise avec { code, success, message, data: campaign }
 */

export const createCampaign = async (campaignData) => {
  try {
    const response = await api.post('/', campaignData);
    return response.data; // { code, success, message, data: campaign }
  } catch (error) {
    console.error('Erreur lors de la création de la campagne:', error);
    throw error;
  }
};
/**
 * Récuoeere  une campagne par ID
 * @param {string} id - ID de la campagne
 * @returns {Promise} Encore une promise
 */
export const getCampaignById = async (id) => {
    try {
      const response = await api.get(`/${id}`);
      return response.data; // { code, success, message, data: campaign }
    } catch (error) {
      console.error('Erreur lors de la récupération de la campagne:', error);
      throw error;
    }
  };

  /**
 * Fait le maj pour le statut du'ne campgane
 * @param {string} id 
 * @param {string} status 
 * @returns {Promise} 
 */
  export const updateCampaignStatus = async (id, status) => {
    try {
      const response = await api.patch(`/${id}/status`, { status });
      return response.data; // { code, success, message, data: campaign }
    } catch (error) {
      console.error('Erreur lors de la mise à jour du statut:', error);
      throw error;
    }
  };

  /**
 * Recup le stat d'une campagne
 * @param {string} id - ID campagne
 * @returns {Promise} 
 */
export const getCampaignStats = async (id) => {
    try {
      const response = await api.get(`/${id}/stats`);
      return response.data; 
    } catch (error) {
      console.error('Erreur lors de la récupération des statistiques:', error);
      throw error;
    }
  };
  
  export default api;