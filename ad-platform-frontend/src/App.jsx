import { BrowserRouter, Routes, Route, Link, useLocation } from 'react-router-dom';
import { CampaignProvider } from './context/CampaignContext';
import CampaignList from './pages/CampaignList';
import CreateCampaign from './pages/CreateCampaign';
import CampaignDetail from './pages/CampaignDetail';

const Header = () => {
  const location = useLocation();
  const isActive = (path) => location.pathname === path;

  return (
    <header className="bg-white border-b border-gray-200 shadow-sm sticky top-0 z-50">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          <Link to="/" className="flex items-center gap-3 group">
            <div className="w-10 h-10 bg-gradient-to-br from-violet-600 to-violet-700 rounded-lg flex items-center justify-center group-hover:from-violet-700 group-hover:to-violet-800 transition-all">
              <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 3.055A9.001 9.001 0 1020.945 13H11V3.055z" />
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20.488 9H15V3.512A9.025 9.025 0 0120.488 9z" />
              </svg>
            </div>
            <div>
              <h1 className="text-xl font-bold text-gray-900">AdaTech</h1>
              <p className="text-xs text-gray-500">Plateforme Publicitaire</p>
            </div>
          </Link>

          <nav className="hidden md:flex items-center gap-1">
            <Link
              to="/"
              className={`px-4 py-2 rounded-lg font-medium transition-all duration-200 ${
                isActive('/') ? 'bg-violet-100 text-violet-700' : 'text-gray-600 hover:bg-gray-100 hover:text-gray-900'
              }`}
            >
              Campagnes
            </Link>
            <Link
              to="/create"
              className={`px-4 py-2 rounded-lg font-medium transition-all duration-200 ${
                isActive('/create') ? 'bg-violet-100 text-violet-700' : 'text-gray-600 hover:bg-gray-100 hover:text-gray-900'
              }`}
            >
              Créer
            </Link>
          </nav>

          <div className="md:hidden">
            <Link
              to="/create"
              className="inline-flex items-center justify-center w-10 h-10 rounded-lg bg-violet-600 text-white hover:bg-violet-700 transition-colors"
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
              </svg>
            </Link>
          </div>
        </div>
      </div>
    </header>
  );
};

function App() {
  return (
    <CampaignProvider>
      <BrowserRouter>
        <div className="min-h-screen bg-gray-50">
          <Header />
          <main className="animate-fade-in">
            <Routes>
              <Route path="/" element={<CampaignList />} />
              <Route path="/create" element={<CreateCampaign />} />
              <Route path="/campaigns/:id" element={<CampaignDetail />} />
            </Routes>
          </main>
        </div>
      </BrowserRouter>
    </CampaignProvider>
  );
}

export default App;
