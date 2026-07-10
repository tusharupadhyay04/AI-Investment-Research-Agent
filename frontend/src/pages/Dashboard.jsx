import React, { useState } from 'react';
import SearchBox from '../components/SearchBox';
import LoadingAnimation from '../components/LoadingAnimation';
import FinancialCards from '../components/FinancialCards';
import NewsCards from '../components/NewsCards';
import InvestmentCard from '../components/InvestmentCard';
import HistoryPanel from '../components/HistoryPanel';
import MarketStatus from '../components/MarketStatus';
import PriceChart from '../components/PriceChart';
import { analyzeCompany } from '../services/api';
import { BrainCircuit, AlertCircle, Moon, Sun, Download } from 'lucide-react';
import html2pdf from 'html2pdf.js';

const Dashboard = () => {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);
  const [data, setData] = useState(null);
  const [isDarkMode, setIsDarkMode] = useState(() => {
    // Check local storage or system preference on load
    if (typeof window !== 'undefined') {
      return document.documentElement.classList.contains('dark');
    }
    return false;
  });

  const toggleDarkMode = () => {
    setIsDarkMode(!isDarkMode);
    if (!isDarkMode) {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  };

  // This will be implemented in Phase 7
  const handleSearch = async (company) => {
    setIsLoading(true);
    setError(null);
    setData(null);
    
    try {
      const result = await analyzeCompany(company);
      setData(result);
      // Tell the HistoryPanel to refresh
      setTimeout(() => {
        window.dispatchEvent(new Event('refresh-history'));
      }, 500);

    } catch (err) {
      setError(err.message);
    } finally {
      setIsLoading(false);
    }
  };

  const handleHistorySelect = (historyResult) => {
    setData(historyResult);
    setError(null);
  };

  const handleDownloadPDF = () => {
    const element = document.getElementById('report-content');
    const opt = {
      margin: 0.5,
      filename: `${data.company}_AI_Investment_Report.pdf`,
      image: { type: 'jpeg', quality: 0.98 },
      html2canvas: { scale: 2, useCORS: true, windowWidth: 1200 },
      jsPDF: { unit: 'in', format: 'letter', orientation: 'portrait' }
    };
    
    html2pdf().set(opt).from(element).save();
  };

  return (
    <div className="min-h-screen bg-transparent transition-colors duration-500 font-sans">
      {/* Header */}
      <header className="glass-panel sticky top-0 z-50 border-b-0">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
          <div className="flex items-center space-x-4">
            <div className="bg-blue-600 p-2.5 rounded-xl shadow-lg shadow-blue-500/20">
              <BrainCircuit className="h-8 w-8 text-white" />
            </div>
            <h1 className="text-3xl font-black bg-clip-text text-transparent bg-gradient-to-r from-blue-600 to-indigo-600 dark:from-blue-400 dark:to-indigo-400 tracking-tighter">
              Quantora AI
            </h1>
          </div>
          <div className="flex items-center space-x-4">
            <button 
              onClick={toggleDarkMode}
              className="p-3 rounded-2xl bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 hover:scale-110 transition-all duration-300 shadow-sm"
              aria-label="Toggle Dark Mode"
            >
              {isDarkMode ? <Sun className="h-6 w-6 text-amber-500" /> : <Moon className="h-6 w-6 text-slate-500" />}
            </button>
            {data && !isLoading && (
              <button 
                onClick={handleDownloadPDF}
                className="p-3 rounded-2xl bg-blue-100 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400 hover:bg-blue-200 dark:hover:bg-blue-800/50 hover:scale-110 transition-all duration-300 shadow-sm"
                title="Download PDF Report"
              >
                <Download className="h-6 w-6" />
              </button>
            )}
            <HistoryPanel onSelectHistory={handleHistorySelect} />
            <MarketStatus />
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="text-center mb-12 animate-in fade-in slide-in-from-bottom-4 duration-1000">
          <h2 className="text-5xl md:text-7xl font-black text-gradient-vibrant tracking-tighter mb-6 pb-2 drop-shadow-lg">
            AI-Powered Stock Analysis
          </h2>
          <p className="text-lg md:text-xl text-slate-600 dark:text-slate-300 max-w-2xl mx-auto font-medium leading-relaxed">
            Enter a stock ticker below (e.g. AAPL, MSFT). 
            Our AI Agent will fetch real-time financials, analyze global news sentiment, and generate a definitive investment verdict.
          </p>
        </div>

        <SearchBox onSearch={handleSearch} isLoading={isLoading} />

        {/* Error State */}
        {error && (
          <div className="max-w-2xl mx-auto mb-8 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-2xl p-4 flex items-center text-red-600 dark:text-red-400">
            <AlertCircle className="h-5 w-5 mr-3 flex-shrink-0" />
            <p>{error}</p>
          </div>
        )}

        {/* Loading State */}
        {isLoading && (
          <div className="py-12 animate-in fade-in zoom-in duration-300">
            <LoadingAnimation />
          </div>
        )}

        {/* Data Presentation */}
        {data && !isLoading && (
          <div id="report-content" className="animate-in fade-in slide-in-from-bottom-8 duration-700">
            <PriceChart data={data.chartData} />
            <FinancialCards data={data} />
            <div className="flex flex-col gap-8 items-center max-w-5xl mx-auto">
              <div className="w-full">
                <InvestmentCard data={data} />
              </div>
              <div className="w-full">
                <NewsCards news={data.news} sentiment={data.newsSentiment} />
              </div>
            </div>
          </div>
        )}
      </main>
    </div>
  );
};

export default Dashboard;
