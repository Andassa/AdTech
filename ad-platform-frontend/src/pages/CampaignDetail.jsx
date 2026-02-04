import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { getCampaignById, getCampaignStats } from '../services/api';
import { useCampaigns } from '../hooks/useCampaigns';
import StatusBadge from '../components/StatusBadge';
import { useStats } from '../hooks/useStats';

const CampaignDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { updateCampaignStatusAndSync } = useCampaigns();

  const [campaign, setCampaign] = useState(null);
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [updatingStatus, setUpdatingStatus] = useState(false);

  useEffect(() => {
    const fetchCampaignData = async () => {
      setLoading(true);
      setError(null);
      try {
        const campaignResponse = await getCampaignById(id);
        if (campaignResponse.success && campaignResponse.data) {
          setCampaign(campaignResponse.data);
          try {
            const statsResponse = await getCampaignStats(id);
            if (statsResponse.success && statsResponse.data) {
              console.log('Stats reçues de l\'API:', statsResponse.data);
              setStats(statsResponse.data);
            }
          } catch (err) {
            console.error('Erreur lors de la récupération des stats:', err);
          }
        } else {
          setError(campaignResponse.message || 'Campagne introuvable');
        }
      } catch (err) {
        setError(err.message || 'Erreur lors du chargement de la campagne');
      } finally {
        setLoading(false);
      }
    };
    if (id) fetchCampaignData();
  }, [id]);

  const formatDate = (dateString) =>
    dateString ? new Date(dateString).toLocaleDateString('fr-FR', { year: 'numeric', month: 'long', day: 'numeric' }) : '';

  const handleToggleStatus = async (newStatus) => {
    if (!campaign) return;
    setUpdatingStatus(true);
    try {
      await updateCampaignStatusAndSync(id, newStatus);
      setCampaign((prev) => ({ ...prev, status: newStatus }));
    } catch (err) {
      alert(err.message || 'Erreur lors de la mise à jour du statut');
    } finally {
      setUpdatingStatus(false);
    }
  };

  const backupStats = useStats({
    budget: campaign?.budget || 0,
    impressions: campaign?.impressions || 0,
    clicks: campaign?.clicks || 0,
  });

  // Utiliser les stats de l'API si disponibles, sinon utiliser le fallback
  const displayStats = stats && stats.ctr !== undefined && stats.cpc !== undefined
    ? {
        ctr: stats.ctr,
        cpc: stats.cpc,
        impressions: stats.impressions ?? campaign?.impressions ?? 0,
        clicks: stats.clicks ?? campaign?.clicks ?? 0,
      }
    : {
        ctr: backupStats.ctr,
        cpc: backupStats.cpc,
        impressions: campaign?.impressions || 0,
        clicks: campaign?.clicks || 0,
      };

  if (loading)
    return (
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="flex justify-center items-center min-h-[500px]">
          <div className="flex flex-col items-center gap-4">
            <div className="w-12 h-12 border-4 border-violet-200 border-t-violet-600 rounded-full animate-spin"></div>
            <div className="text-gray-600 text-lg font-medium">Chargement des détails...</div>
          </div>
        </div>
      </div>
    );

  if (error || !campaign)
    return (
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <button onClick={() => navigate('/')} className="inline-flex items-center gap-2 text-violet-600 hover:text-violet-700 font-medium mb-6 transition-colors">
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
          </svg>
          Retour aux campagnes
        </button>
        <div className="bg-red-50 border-l-4 border-red-500 text-red-700 p-6 rounded-lg shadow-sm">
          <div className="flex items-center gap-3">
            <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 20 20">
              <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
            </svg>
            <div>
              <p className="font-bold text-lg">Erreur</p>
              <p className="mt-1">{error || 'Campagne introuvable'}</p>
            </div>
          </div>
        </div>
      </div>
    );

  return (
    <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <button onClick={() => navigate('/')} className="inline-flex items-center gap-2 text-violet-600 hover:text-violet-700 font-medium mb-8 transition-colors">
        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
        </svg>
        Retour aux campagnes
      </button>

      <div className="mb-8">
        <div className="flex flex-col sm:flex-row sm:items-center gap-4 mb-3">
          <h1 className="text-4xl font-bold text-gray-900">{campaign.name}</h1>
          <StatusBadge status={campaign.status} />
        </div>
        <div className="flex items-center gap-2 text-gray-600">
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
          </svg>
          <p className="text-lg font-medium">{campaign.advertiser}</p>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        <div className="bg-linear-to-br from-violet-50 to-violet-100 rounded-xl shadow-sm border border-violet-200 p-6 hover:shadow-md transition-shadow">
          <div className="flex items-center gap-3 mb-4">
            <div className="w-12 h-12 bg-violet-600 rounded-lg flex items-center justify-center">
              <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            </div>
            <h3 className="text-sm font-semibold text-gray-700 uppercase tracking-wide">Budget</h3>
          </div>
          <p className="text-3xl font-bold text-gray-900">{campaign.budget?.toLocaleString('fr-FR')} €</p>
        </div>

        <div className="bg-linear-to-br from-blue-50 to-blue-100 rounded-xl shadow-sm border border-blue-200 p-6 hover:shadow-md transition-shadow">
          <div className="flex items-center gap-3 mb-4">
            <div className="w-12 h-12 bg-blue-600 rounded-lg flex items-center justify-center">
              <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
              </svg>
            </div>
            <h3 className="text-sm font-semibold text-gray-700 uppercase tracking-wide">Impressions</h3>
          </div>
          <p className="text-3xl font-bold text-gray-900">{displayStats.impressions?.toLocaleString('fr-FR') || 0}</p>
        </div>

        <div className="bg-linear-to-br from-green-50 to-green-100 rounded-xl shadow-sm border border-green-200 p-6 hover:shadow-md transition-shadow">
          <div className="flex items-center gap-3 mb-4">
            <div className="w-12 h-12 bg-green-600 rounded-lg flex items-center justify-center">
              <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 15l-2 5L9 9l11 4-5 2zm0 0l5 5M7.188 2.239l.777 2.897M5.136 7.965l-2.898-.777M13.95 4.05l-2.122 2.122m-5.657 5.656l-2.12 2.122" />
              </svg>
            </div>
            <h3 className="text-sm font-semibold text-gray-700 uppercase tracking-wide">Clicks</h3>
          </div>
          <p className="text-3xl font-bold text-gray-900">{displayStats.clicks?.toLocaleString('fr-FR') || 0}</p>
        </div>
      </div>

      <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-8 mb-8">
        <div className="flex items-center gap-3 mb-6">
          <div className="w-10 h-10 bg-linear-to-br from-violet-500 to-violet-600 rounded-lg flex items-center justify-center">
            <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6" />
            </svg>
          </div>
          <h2 className="text-2xl font-bold text-gray-900">Performances</h2>
        </div>

        <div className="space-y-8">
          <div>
            <div className="flex justify-between items-center mb-3">
              <div>
                <label className="text-base font-semibold text-gray-900">CTR (Click Through Rate)</label>
                <p className="text-xs text-gray-500 mt-1">Formule: (clicks / impressions) × 100</p>
              </div>
              <span className="text-3xl font-bold text-violet-600">{displayStats.ctr?.toFixed(2)} %</span>
            </div>
            <div className="bg-gray-100 h-3 rounded-full overflow-hidden">
              <div className="bg-linear-to-r from-violet-500 to-violet-600 h-full transition-all duration-500 rounded-full" style={{ width: `${Math.min(displayStats.ctr || 0, 100)}%` }} />
            </div>
          </div>

          <div>
            <div className="flex justify-between items-center mb-3">
              <div>
                <label className="text-base font-semibold text-gray-900">CPC (Cost Per Click)</label>
                <p className="text-xs text-gray-500 mt-1">Formule: budget / clicks</p>
              </div>
              <span className="text-3xl font-bold text-green-600">{displayStats.cpc?.toFixed(2)} €</span>
            </div>
            <div className="bg-gray-100 h-3 rounded-full overflow-hidden">
              <div className="bg-linear-to-r from-green-500 to-green-600 h-full transition-all duration-500 rounded-full" style={{ width: `${Math.min((displayStats.cpc / (campaign.budget || 1)) * 100 || 0, 100)}%` }} />
            </div>
          </div>
        </div>
      </div>

      <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 mb-8">
        <div className="flex items-center gap-3 mb-4">
          <div className="w-10 h-10 bg-linear-to-br from-blue-500 to-blue-600 rounded-lg flex items-center justify-center">
            <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
            </svg>
          </div>
          <h3 className="text-xl font-bold text-gray-900">Période de diffusion</h3>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div className="flex items-center gap-3 p-4 bg-gray-50 rounded-lg">
            <div className="w-2 h-2 bg-green-500 rounded-full"></div>
            <div>
              <p className="text-xs text-gray-500 uppercase tracking-wide mb-1">Date de début</p>
              <p className="text-base font-semibold text-gray-900">{formatDate(campaign.startDate)}</p>
            </div>
          </div>
          <div className="flex items-center gap-3 p-4 bg-gray-50 rounded-lg">
            <div className="w-2 h-2 bg-red-500 rounded-full"></div>
            <div>
              <p className="text-xs text-gray-500 uppercase tracking-wide mb-1">Date de fin</p>
              <p className="text-base font-semibold text-gray-900">{formatDate(campaign.endDate)}</p>
            </div>
          </div>
        </div>
      </div>

      <div className="flex flex-wrap gap-4">
        {campaign.status === 'active' && (
          <button onClick={() => handleToggleStatus('paused')} disabled={updatingStatus} className="inline-flex items-center gap-2 bg-orange-500 hover:bg-orange-600 text-white px-6 py-3 rounded-lg font-semibold transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed shadow-sm hover:shadow-md">
            {updatingStatus ? (
              <>
                <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                Mise à jour...
              </>
            ) : (
              <>
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 9v6m4-6v6m7-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
                Mettre en pause
              </>
            )}
          </button>
        )}

        {campaign.status === 'paused' && (
          <button onClick={() => handleToggleStatus('active')} disabled={updatingStatus} className="inline-flex items-center gap-2 bg-green-500 hover:bg-green-600 text-white px-6 py-3 rounded-lg font-semibold transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed shadow-sm hover:shadow-md">
            {updatingStatus ? (
              <>
                <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                Mise à jour...
              </>
            ) : (
              <>
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14.752 11.168l-3.197-2.132A1 1 0 0010 9.87v4.263a1 1 0 001.555.832l3.197-2.132a1 1 0 000-1.664z" />
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
                Activer
              </>
            )}
          </button>
        )}

        {campaign.status === 'finished' && (
          <div className="inline-flex items-center gap-2 bg-gray-100 text-gray-600 px-6 py-3 rounded-lg font-medium">
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
            Cette campagne est terminée
          </div>
        )}
      </div>
    </div>
  );
};

export default CampaignDetail;
