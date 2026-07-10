import React, { useState } from 'react';
import { Search } from 'lucide-react';

const SearchBox = ({ onSearch, isLoading }) => {
  const [company, setCompany] = useState('');

  const handleSubmit = (e) => {
    e.preventDefault();
    if (company.trim()) {
      onSearch(company);
    }
  };

  return (
    <div className="w-full max-w-2xl mx-auto mb-8">
      <form onSubmit={handleSubmit} className="relative group">
        <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
          <Search className="h-5 w-5 text-slate-400 group-focus-within:text-blue-500 transition-colors" />
        </div>
        <input
          type="text"
          className="block w-full pl-12 pr-32 py-4 glass-panel border-2 border-slate-200/60 dark:border-slate-700/50 rounded-2xl text-lg shadow-xl focus:ring-0 focus:border-blue-500 transition-all outline-none text-slate-900 dark:text-white placeholder-slate-500 dark:placeholder-slate-400"
          placeholder="Enter stock ticker (e.g., AAPL, MSFT, TSLA)..."
          value={company}
          onChange={(e) => setCompany(e.target.value)}
          disabled={isLoading}
        />
        <div className="absolute inset-y-2 right-2">
          <button
            type="submit"
            disabled={isLoading || !company.trim()}
            className="h-full px-8 bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white rounded-xl font-bold shadow-md hover:shadow-lg hover:-translate-y-0.5 transition-all duration-300 disabled:bg-none disabled:bg-slate-200 dark:disabled:bg-slate-800 disabled:text-slate-700 dark:disabled:text-slate-300 disabled:cursor-not-allowed disabled:transform-none disabled:shadow-none"
          >
            Analyze
          </button>
        </div>
      </form>
    </div>
  );
};

export default SearchBox;
