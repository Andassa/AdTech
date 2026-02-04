import { useState, useCallback } from 'react';
import searchIcon from '../assets/icons/search.svg';

const SearchInput = ({ onSearch, placeholder = "Rechercher par nom..." }) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [isFocused, setIsFocused] = useState(false);

  const handleChange = useCallback((e) => {
    const value = e.target.value;
    setSearchTerm(value);
    // Le debounce est géré dans le composant parent
    if (onSearch) {
      onSearch(value);
    }
  }, [onSearch]);

  const handleClear = useCallback(() => {
    setSearchTerm('');
    if (onSearch) {
      onSearch('');
    }
  }, [onSearch]);

  return (
    <div className="relative w-full max-w-[500px]">
      <div
        className={`
          flex flex-row items-center justify-center
          gap-1
          rounded-full
          transition-all duration-200
          ${
            isFocused
              ? 'px-5 py-1 h-12 bg-violet-50 border-[5px] border-violet-300'
              : searchTerm
              ? 'px-5 py-1 h-12 bg-white border-[1.5px] border-gray-200 hover:bg-violet-50 hover:border-violet-200'
              : 'px-0 py-0 h-auto bg-transparent border-0'
          }
        `}
      >
        {/* Input text container */}
        <div className="flex flex-row items-center p-0 flex-1">
          <input
            type="text"
            value={searchTerm}
            onChange={handleChange}
            onFocus={() => setIsFocused(true)}
            onBlur={() => setIsFocused(false)}
            placeholder={placeholder}
            style={{ border: 'none', outline: 'none', boxShadow: 'none' }}
            className={`
              w-full
              font-medium text-sm leading-5
              flex items-center
              flex-1
              bg-transparent
              !outline-none
              !border-none
              !shadow-none
              !ring-0
              appearance-none
              focus:!outline-none
              focus:!border-none
              focus:!ring-0
              focus:!shadow-none
              focus-visible:!outline-none
              ${
                isFocused || searchTerm
                  ? 'text-gray-900'
                  : 'text-gray-500'
              }
              placeholder:text-gray-400 placeholder:opacity-70
            `}
          />
        </div>

        {/* Icon container */}
        <div className="flex items-center justify-center w-6 h-6 flex-none">
          {searchTerm ? (
            <button
              onClick={handleClear}
              className="w-6 h-6 flex items-center justify-center hover:bg-gray-100 rounded-full transition-colors"
              aria-label="Effacer la recherche"
            >
              <svg
                width="24"
                height="24"
                viewBox="0 0 24 24"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
                className="w-5 h-5 text-gray-600"
              >
                <path
                  d="M18 6L6 18M6 6L18 18"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
              </svg>
            </button>
          ) : (
            <img
              src={searchIcon}
              alt="Rechercher"
              className="w-6 h-6"
            />
          )}
        </div>
      </div>
    </div>
  );
};

export default SearchInput;

