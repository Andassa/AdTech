import { createContext, useContext, useState, useEffect, useCallback } from 'react';
import { getCampaigns, createCampaign, updateCampaignStatus } from '../services/api';

const CampaignContext = createContext();

export const CampaignProvider = ({ children }) => {
  const [campaigns, setCampaigns] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [pagination, setPagination] = useState(null);

  const fetchCampaigns = useCallback(async (filters = {}) => {
    setLoading(true);
    setError(null);
    
    try {
      const res = await getCampaigns(filters);
      console.log('API Response:', res); // Debug
      if (res.success && res.data) {
        setCampaigns(res.data);
        // Le backend retourne nbPage, limit, skip, total, nbEnd
        setPagination(res.pagination || null);
      } else {
        setError(res.message || 'Erreur lors du chargement des campagnes');
        setPagination(null);
      }
    } catch (err) {
      setError(err.message || 'Erreur lors du chargement des campagnes');
      setCampaigns([]);
    } finally {
      setLoading(false);
    }
  }, []);

  const addCampaign = (c) => setCampaigns((prev) => [c, ...prev]);

  const updateCampaignStatusLocal = (id, status) =>
    setCampaigns((prev) =>
      prev.map((c) => (c._id === id ? { ...c, status } : c))
    );

  const createCampaignAndAdd = async (data) => {
    setLoading(true);
    setError(null);
    try {
      const res = await createCampaign(data);
      if (res.success && res.data) {
        addCampaign(res.data);
        return res.data;
      }
      throw new Error(res.message || 'Erreur lors de la création de la campagne');
    } catch (err) {
      setError(err.message || 'Erreur lors de la création de la campagne');
      throw err;
    } finally {
      setLoading(false);
    }
  };

  const updateCampaignStatusAndSync = async (id, status) => {
    setLoading(true);
    setError(null);
    try {
      const res = await updateCampaignStatus(id, status);
      if (res.success && res.data) {
        updateCampaignStatusLocal(id, status);
        return res.data;
      }
      throw new Error(res.message || 'Erreur lors de la mise à jour du statut');
    } catch (err) {
      setError(err.message || 'Erreur lors de la mise à jour du statut');
      throw err;
    } finally {
      setLoading(false);
    }
  };

  // Chargement initial (le backend gère la pagination via NB_PAGINATION)
  useEffect(() => { fetchCampaigns(); }, [fetchCampaigns]);

  return (
    <CampaignContext.Provider
      value={{
        campaigns,
        loading,
        error,
        pagination,
        fetchCampaigns,
        addCampaign,
        updateCampaignStatusLocal,
        createCampaignAndAdd,
        updateCampaignStatusAndSync,
      }}
    >
      {children}
    </CampaignContext.Provider>
  );
};

export const useCampaignContext = () => {
  const context = useContext(CampaignContext);
  if (!context) throw new Error('useCampaignContext doit être utilisé dans un CampaignProvider');
  return context;
};

export default CampaignContext;
