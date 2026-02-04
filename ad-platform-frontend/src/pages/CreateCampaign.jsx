import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useCampaigns } from '../hooks/useCampaigns';

const CreateCampaign = () => {
  const navigate = useNavigate();
  const { createCampaignAndAdd, loading, error: contextError } = useCampaigns();

  const [formData, setFormData] = useState({ name: '', advertiser: '', budget: '', startDate: '', endDate: '' });
  const [errors, setErrors] = useState({});
  const [submitError, setSubmitError] = useState(null);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    if (errors[name]) setErrors((prev) => ({ ...prev, [name]: null }));
  };

  const validateForm = () => {
    const newErrors = {};
    if (!formData.name.trim()) newErrors.name = 'Le nom de la campagne est requis';
    if (!formData.advertiser.trim()) newErrors.advertiser = "L'annonceur est requis";
    const budget = parseFloat(formData.budget);
    if (!formData.budget || isNaN(budget) || budget <= 0) newErrors.budget = 'Le budget doit être un nombre positif';
    if (!formData.startDate) newErrors.startDate = 'La date de début est requise';
    if (!formData.endDate) newErrors.endDate = 'La date de fin est requise';
    if (formData.startDate && formData.endDate) {
      const start = new Date(formData.startDate);
      const end = new Date(formData.endDate);
      if (end <= start) newErrors.endDate = 'La date de fin doit être postérieure à la date de début';
    }
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSubmitError(null);
    if (!validateForm()) return;
    try {
      await createCampaignAndAdd({
        name: formData.name.trim(),
        advertiser: formData.advertiser.trim(),
        budget: parseFloat(formData.budget),
        startDate: formData.startDate,
        endDate: formData.endDate,
      });
      navigate('/');
    } catch (err) {
      setSubmitError(err.message || 'Erreur lors de la création de la campagne');
    }
  };

  return (
    <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="max-w-3xl mx-auto">
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-8 md:p-10">
          <div className="mb-8">
            <div className="flex items-center gap-3 mb-3">
              <div className="w-12 h-12 bg-linear-to-br from-violet-500 to-violet-600 rounded-lg flex items-center justify-center">
                <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                </svg>
              </div>
              <h1 className="text-3xl font-bold text-gray-900">Créer une nouvelle campagne</h1>
            </div>
            <p className="text-gray-600 ml-16">Remplissez les informations ci-dessous pour créer votre campagne publicitaire</p>
          </div>

          {(submitError || contextError) && (
            <div className="mb-6 bg-red-50 border-l-4 border-red-500 text-red-700 p-4 rounded-lg flex items-center gap-3">
              <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
              </svg>
              <p className="font-medium">{submitError || contextError}</p>
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-6">
            {[
              { label: 'Nom de la campagne', name: 'name', type: 'text', placeholder: 'Ex: Campagne Printemps 2026' },
              { label: 'Annonceur', name: 'advertiser', type: 'text', placeholder: 'Ex: Culture' },
            ].map((field) => (
              <div key={field.name}>
                <label htmlFor={field.name} className="block mb-2 text-sm font-semibold text-gray-900">
                  {field.label} <span className="text-red-500">*</span>
                </label>
                <input
                  type={field.type}
                  id={field.name}
                  name={field.name}
                  value={formData[field.name]}
                  onChange={handleChange}
                  required
                  className={`w-full border ${errors[field.name] ? 'border-red-500 bg-red-50' : 'border-gray-300 bg-white'} rounded-lg px-4 py-3 text-gray-900 placeholder-gray-400 focus:ring-2 focus:ring-violet-500 focus:border-transparent transition-all`}
                  placeholder={field.placeholder}
                />
                {errors[field.name] && (
                  <p className="mt-2 text-sm text-red-600 flex items-center gap-1">
                    <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
                    </svg>
                    {errors[field.name]}
                  </p>
                )}
              </div>
            ))}

            <div>
              <label htmlFor="budget" className="block mb-2 text-sm font-semibold text-gray-900">
                Budget (€) <span className="text-red-500">*</span>
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                  <span className="text-gray-500 font-medium">€</span>
                </div>
                <input
                  type="number"
                  id="budget"
                  name="budget"
                  value={formData.budget}
                  onChange={handleChange}
                  required
                  min="0"
                  step="0.01"
                  className={`w-full border ${errors.budget ? 'border-red-500 bg-red-50' : 'border-gray-300 bg-white'} rounded-lg pl-8 pr-4 py-3 text-gray-900 placeholder-gray-400 focus:ring-2 focus:ring-violet-500 focus:border-transparent transition-all`}
                  placeholder="5000"
                />
              </div>
              {errors.budget && <p className="mt-2 text-sm text-red-600">{errors.budget}</p>}
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {['startDate','endDate'].map((dateField) => (
                <div key={dateField}>
                  <label htmlFor={dateField} className="block mb-2 text-sm font-semibold text-gray-900">
                    {dateField === 'startDate' ? 'Date de début' : 'Date de fin'} <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="date"
                    id={dateField}
                    name={dateField}
                    value={formData[dateField]}
                    onChange={handleChange}
                    min={dateField === 'endDate' ? formData.startDate || undefined : undefined}
                    required
                    className={`w-full border ${errors[dateField] ? 'border-red-500 bg-red-50' : 'border-gray-300 bg-white'} rounded-lg px-4 py-3 text-gray-900 focus:ring-2 focus:ring-violet-500 focus:border-transparent transition-all`}
                  />
                  {errors[dateField] && <p className="mt-2 text-sm text-red-600">{errors[dateField]}</p>}
                </div>
              ))}
            </div>

            <div className="flex flex-col sm:flex-row justify-end gap-4 pt-6 border-t border-gray-200">
              <button type="button" onClick={() => navigate('/')} className="w-full sm:w-auto px-6 py-3 bg-gray-100 hover:bg-gray-200 text-gray-800 rounded-lg font-semibold transition-all duration-200 disabled:opacity-50" disabled={loading}>
                Annuler
              </button>
              <button type="submit" className="w-full sm:w-auto px-6 py-3 bg-linear-to-r from-violet-600 to-violet-700 hover:from-violet-700 hover:to-violet-800 text-white rounded-lg font-semibold transition-all duration-200 disabled:opacity-50 flex items-center justify-center gap-2" disabled={loading}>
                {loading ? <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div> : 'Créer la campagne'}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default CreateCampaign;
