import { useState, useEffect, useRef, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { useCampaigns } from '../hooks/useCampaigns';
import StatusBadge from '../components/StatusBadge';
import FabButton from '../components/FabButton';
import Pagination from '../components/Pagination';
import SearchInput from '../components/SearchInput';
import addIcon from '../assets/icons/add.svg';

const calculateCTR = (impressions, clicks) =>
  impressions > 0 ? Number(((clicks / impressions) * 100).toFixed(2)) : 0;

const CampaignList = () => {
  const navigate = useNavigate();
  const { campaigns, loading, error, pagination, fetchCampaigns } = useCampaigns();
  const [searchTerm, setSearchTerm] = useState('');
  const debounceTimerRef = useRef(null);
  const fetchCampaignsRef = useRef(fetchCampaigns);
  const isInitialMount = useRef(true);

  // Mettre à jour la ref quand fetchCampaigns change
  useEffect(() => {
    fetchCampaignsRef.current = fetchCampaigns;
  }, [fetchCampaigns]);

  const handleRowClick = (id) => navigate(`/campaigns/${id}`);
  const handlePageChange = async (params) => await fetchCampaigns(params);

  // Debounce pour la recherche - ne se déclenche pas au montage initial
  useEffect(() => {
    // Ignorer le premier rendu (montage initial)
    if (isInitialMount.current) {
      isInitialMount.current = false;
      return;
    }

    // Nettoyer le timer précédent
    if (debounceTimerRef.current) {
      clearTimeout(debounceTimerRef.current);
    }

    // Créer un nouveau timer
    debounceTimerRef.current = setTimeout(() => {
      const filters = {};
      if (searchTerm && searchTerm.trim() !== '') {
        filters.keywoard = searchTerm.trim();
      }
      // Utiliser la ref pour éviter les dépendances et les re-renders
      fetchCampaignsRef.current(filters);
    }, 300);

    // Cleanup function
    return () => {
      if (debounceTimerRef.current) {
        clearTimeout(debounceTimerRef.current);
      }
    };
  }, [searchTerm]); // Retirer fetchCampaigns des dépendances

  const handleSearch = useCallback((value) => {
    setSearchTerm(value);
  }, []);

  if (loading)
    return (
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-8 flex justify-center items-center min-h-[500px]">
        <div className="flex flex-col items-center gap-4">
          <div className="w-12 h-12 border-4 border-violet-200 border-t-violet-600 rounded-full animate-spin"></div>
          <div className="text-gray-600 text-lg font-medium">Chargement des campagnes...</div>
        </div>
      </div>
    );

  if (error)
    return (
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="bg-red-50 border-l-4 border-red-500 text-red-700 p-6 rounded-lg shadow-sm flex items-center gap-3">
          <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 20 20">
            <path
              fillRule="evenodd"
              d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z"
              clipRule="evenodd"
            />
          </svg>
          <div>
            <p className="font-bold text-lg">Erreur</p>
            <p className="mt-1">{error}</p>
          </div>
        </div>
      </div>
    );

  if (!campaigns || campaigns.length === 0)
    return (
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-8 gap-4">
          <div>
            <h1 className="text-4xl font-bold text-gray-900 mb-2">Mes Campagnes</h1>
            <p className="text-gray-600">Gérez toutes vos campagnes publicitaires</p>
          </div>
          <FabButton
            label="Créer une campagne"
            icon={addIcon}
            size="md"
            iconPosition="leading"
            onClick={() => navigate('/create')}
            className="w-full sm:w-auto"
          />
        </div>
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-12 text-center">
          <div className="max-w-md mx-auto">
            <div className="w-20 h-20 bg-violet-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <svg className="w-10 h-10 text-violet-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
              </svg>
            </div>
            <h3 className="text-xl font-semibold text-gray-900 mb-2">Aucune campagne</h3>
            <p className="text-gray-600 mb-6">Commencez par créer votre première campagne publicitaire</p>
            <FabButton
              label="Créer ma première campagne"
              icon={addIcon}
              size="md"
              iconPosition="leading"
              onClick={() => navigate('/create')}
            />
          </div>
        </div>
      </div>
    );

  return (
    <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-8 gap-4">
        <div>
          <h1 className="text-4xl font-bold text-gray-900 mb-2">Mes Campagnes</h1>
          <p className="text-gray-600">{campaigns.length} {campaigns.length === 1 ? 'campagne' : 'campagnes'} au total</p>
        </div>
        <FabButton
          label="Créer une campagne"
          icon={addIcon}
          size="md"
          iconPosition="leading"
          onClick={() => navigate('/create')}
          className="w-full sm:w-auto"
        />
      </div>

      {/* Barre de recherche - Centrée en haut du tableau */}
      <div className="flex justify-center mb-6">
        <SearchInput
          onSearch={handleSearch}
          placeholder="Rechercher par nom, annonceur ou statut..."
        />
      </div>

      {/* Tableau desktop */}
      <div className="hidden lg:block bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-linear-to-r from-gray-50 to-gray-100">
              <tr>
                {['Nom','Annonceur','Statut','Budget','CTR','Actions'].map((th) => (
                  <th key={th} className="px-6 py-4 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">{th}</th>
                ))}
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {campaigns.map((c) => {
                const ctr = calculateCTR(c.impressions || 0, c.clicks || 0);
                return (
                  <tr
                    key={c._id}
                    onClick={() => handleRowClick(c._id)}
                    className="hover:bg-violet-50/50 cursor-pointer transition-all duration-200 group"
                  >
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm font-semibold text-gray-900 group-hover:text-violet-700 transition-colors">{c.name}</div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap"><div className="text-sm text-gray-600">{c.advertiser}</div></td>
                    <td className="px-6 py-4 whitespace-nowrap"><StatusBadge status={c.status} /></td>
                    <td className="px-6 py-4 whitespace-nowrap"><div className="text-sm font-medium text-gray-900">{c.budget?.toLocaleString('fr-FR')} €</div></td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center gap-2">
                        <div className="text-sm font-medium text-gray-900">{ctr}%</div>
                        <div className="w-16 h-1.5 bg-gray-200 rounded-full overflow-hidden">
                          <div className="h-full bg-violet-600 rounded-full transition-all duration-300" style={{ width: `${Math.min(ctr,100)}%` }} />
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-right">
                      <button
                        onClick={(e) => { e.stopPropagation(); handleRowClick(c._id); }}
                        className="inline-flex items-center gap-2 text-violet-600 hover:text-violet-700 font-medium text-sm transition-colors"
                      >
                        Voir
                      </button>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
        <div className="px-6">
          <Pagination pagination={pagination} onPageChange={handlePageChange} loading={loading} />
        </div>
      </div>

      {/* Cartes mobile/tablette */}
      <div className="lg:hidden space-y-4">
        {campaigns.map((c) => {
          const ctr = calculateCTR(c.impressions || 0, c.clicks || 0);
          return (
            <div
              key={c._id}
              onClick={() => handleRowClick(c._id)}
              className="bg-white rounded-xl shadow-sm border border-gray-200 p-5 cursor-pointer hover:shadow-md hover:border-violet-300 transition-all duration-200"
            >
              <div className="flex justify-between items-start mb-3">
                <h3 className="text-lg font-semibold text-gray-900 pr-2">{c.name}</h3>
                <StatusBadge status={c.status} />
              </div>
              <p className="text-sm text-gray-600 mb-4"><span className="font-medium">Annonceur:</span> {c.advertiser}</p>
              <div className="grid grid-cols-2 gap-4 mb-4">
                <div>
                  <p className="text-xs text-gray-500 mb-1">Budget</p>
                  <p className="text-sm font-semibold text-gray-900">{c.budget?.toLocaleString('fr-FR')} €</p>
                </div>
                <div>
                  <p className="text-xs text-gray-500 mb-1">CTR</p>
                  <div className="flex items-center gap-2">
                    <p className="text-sm font-semibold text-gray-900">{ctr}%</p>
                    <div className="flex-1 h-1.5 bg-gray-200 rounded-full overflow-hidden">
                      <div className="h-full bg-violet-600 rounded-full" style={{ width: `${Math.min(ctr,100)}%` }} />
                    </div>
                  </div>
                </div>
              </div>
              <button
                onClick={(e) => { e.stopPropagation(); handleRowClick(c._id); }}
                className="w-full flex items-center justify-center gap-2 text-violet-600 hover:text-violet-700 font-medium text-sm py-2 rounded-lg hover:bg-violet-50 transition-colors"
              >
                Voir les détails
              </button>
            </div>
          );
        })}
      </div>

      {pagination && (
        <div className="lg:hidden mt-6 bg-white rounded-xl shadow-sm border border-gray-200 p-4">
          <Pagination pagination={pagination} onPageChange={handlePageChange} loading={loading} />
        </div>
      )}
    </div>
  );
};

export default CampaignList;
