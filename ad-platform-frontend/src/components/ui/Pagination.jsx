import { useState, useEffect } from 'react';

const Pagination = ({ pagination, onPageChange, loading = false }) => {
  const [pageInput, setPageInput] = useState('');
  if (!pagination?.total || pagination.total === 0) return null;

  const currentPage = pagination.nbPage || pagination.page || (pagination.skip !== undefined && pagination.limit ? Math.floor(pagination.skip / pagination.limit) + 1 : 1);
  const totalPages = Math.ceil(pagination.total / (pagination.limit || 10));
  if (totalPages <= 1) return null;

  const canPrev = currentPage > 1;
  const canNext = currentPage < totalPages;

  useEffect(() => setPageInput(currentPage.toString()), [currentPage]);

  const handleChange = (e) => {
    const val = e.target.value;
    if (val === '' || /^\d+$/.test(val)) setPageInput(val);
  };

  const handleBlur = () => {
    if (!pageInput || parseInt(pageInput, 10) < 1) setPageInput(currentPage.toString());
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const num = parseInt(pageInput, 10);
    if (num >= 1 && num <= totalPages && num !== currentPage) onPageChange(num < currentPage ? { previous: num } : { next: num });
    else setPageInput(currentPage.toString());
  };

  return (
    <div className="w-full border-t border-[#AEAEAE] pt-3">
      <div className="flex flex-col sm:flex-row justify-between items-center gap-4">
        <div className="hidden sm:block flex-1"></div>
        <div className="flex items-center gap-2">
          <label className="text-sm font-medium text-[#1D242D]" style={{ lineHeight: '17px' }}>Page</label>
          <form onSubmit={handleSubmit} className="inline-block">
            <input
              type="text"
              value={pageInput}
              onChange={handleChange}
              onBlur={handleBlur}
              disabled={loading}
              className="w-[60px] min-w-[48px] h-9 px-2 text-center text-xs font-medium text-[#1D242D] border border-[#AEAEAE] rounded-xl focus:outline-none focus:ring-2 focus:ring-violet-500 focus:border-violet-500 disabled:opacity-50 disabled:cursor-not-allowed bg-white"
              style={{ lineHeight: '14px' }}
            />
          </form>
        </div>
        <div className="flex items-center gap-1">
          <button
            onClick={() => canPrev && !loading && onPageChange({ previous: currentPage })}
            disabled={!canPrev || loading}
            className="flex items-center justify-center gap-2 px-6 py-3 h-10 rounded-full border border-[#AEAEAE] bg-white hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
          >
            <svg className="w-5 h-5 text-[#1D242D]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
            </svg>
            <span className="text-sm font-semibold text-[#546881]" style={{ lineHeight: '17px', letterSpacing: '-0.1px' }}>Précédent</span>
          </button>
          <button
            onClick={() => canNext && !loading && onPageChange({ next: currentPage })}
            disabled={!canNext || loading}
            className="flex items-center justify-center gap-2 px-6 py-3 h-10 rounded-full border border-[#AEAEAE] bg-white hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
          >
            <span className="text-sm font-semibold text-[#546881]" style={{ lineHeight: '17px', letterSpacing: '-0.1px' }}>Suivant</span>
            <svg className="w-5 h-5 text-[#1D242D]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
            </svg>
          </button>
        </div>
      </div>
    </div>
  );
};

export default Pagination;
