import { useState, useEffect, useMemo } from 'react';

const Pagination = ({ pagination, onPageChange, loading = false }) => {
  const [pageInput, setPageInput] = useState('');

  // Calculer les valeurs de pagination
  const { currentPage, totalPages, canPrev, canNext, shouldRender } = useMemo(() => {
    if (!pagination?.total || pagination.total === 0) {
      return { currentPage: 1, totalPages: 1, canPrev: false, canNext: false, shouldRender: false };
    }

    // Le backend retourne nbPage (page actuelle), limit (NB_PAGINATION), total
    const limit = pagination.limit || pagination.nbLimit || 10;
    const page = pagination.nbPage || pagination.page || 1;
    const total = Math.ceil(pagination.total / limit);

    return {
      currentPage: page,
      totalPages: total,
      canPrev: page > 1,
      canNext: page < total,
      shouldRender: total > 1
    };
  }, [pagination]);

  // Mettre à jour l'input quand la page change
  useEffect(() => {
    setPageInput(currentPage.toString());
  }, [currentPage]);

  // Ne pas rendre si pas assez de pages
  if (!shouldRender) return null;

  const handleChange = (e) => {
    const val = e.target.value;
    if (val === '' || /^\d+$/.test(val)) setPageInput(val);
  };

  const handleBlur = () => {
    if (!pageInput || parseInt(pageInput, 10) < 1) setPageInput(currentPage.toString());
  };

  const goToPage = (targetPage) => {
    if (targetPage >= 1 && targetPage <= totalPages && targetPage !== currentPage && !loading) {
      // Le backend utilise next/previous avec le numéro de page ACTUEL
      if (targetPage > currentPage) {
        // Aller à la page suivante : envoyer la page actuelle dans "next"
        onPageChange({ next: currentPage });
      } else {
        // Revenir en arrière : envoyer la page actuelle dans "previous"
        onPageChange({ previous: currentPage });
      }
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const num = parseInt(pageInput, 10);
    if (num >= 1 && num <= totalPages && num !== currentPage) {
      goToPage(num);
    } else {
      setPageInput(currentPage.toString());
    }
  };

  return (
    <div className="w-full border-t border-gray-200 pt-6 pb-4 mt-4">
      <div className="flex flex-col sm:flex-row justify-between items-center gap-6">
        <div className="hidden sm:block flex-1">
          <span className="text-sm text-gray-500">
            {pagination.total} résultat{pagination.total > 1 ? 's' : ''} • Page {currentPage} sur {totalPages}
          </span>
        </div>
        <div className="flex items-center gap-3">
          <label className="text-sm font-medium text-gray-700">Page</label>
          <form onSubmit={handleSubmit} className="inline-block">
            <input
              type="text"
              value={pageInput}
              onChange={handleChange}
              onBlur={handleBlur}
              disabled={loading}
              className="w-14 h-10 px-2 text-center text-sm font-medium text-gray-900 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-violet-500 focus:border-violet-500 disabled:opacity-50 disabled:cursor-not-allowed bg-white"
            />
          </form>
          <span className="text-sm text-gray-500">/ {totalPages}</span>
        </div>
        <div className="flex items-center gap-3">
          <button
            onClick={() => goToPage(currentPage - 1)}
            disabled={!canPrev || loading}
            className="flex items-center justify-center gap-2 px-5 py-2.5 h-11 rounded-full border border-gray-300 bg-white hover:bg-violet-50 hover:border-violet-300 disabled:opacity-40 disabled:cursor-not-allowed disabled:hover:bg-white disabled:hover:border-gray-300 transition-all duration-200 shadow-sm"
          >
            <svg className="w-4 h-4 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
            </svg>
            <span className="text-sm font-medium text-gray-700">Précédent</span>
          </button>
          <button
            onClick={() => goToPage(currentPage + 1)}
            disabled={!canNext || loading}
            className="flex items-center justify-center gap-2 px-5 py-2.5 h-11 rounded-full bg-violet-600 hover:bg-violet-700 disabled:opacity-40 disabled:cursor-not-allowed disabled:hover:bg-violet-600 transition-all duration-200 shadow-sm"
          >
            <span className="text-sm font-medium text-white">Suivant</span>
            <svg className="w-4 h-4 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
            </svg>
          </button>
        </div>
      </div>
    </div>
  );
};

export default Pagination;
