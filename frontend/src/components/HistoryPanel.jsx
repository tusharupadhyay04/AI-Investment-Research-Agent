import React, { useState, useEffect, useRef } from 'react';
import { History, ChevronRight, TrendingUp, TrendingDown, Minus, Trash2 } from 'lucide-react';
import { fetchHistory as apiFetchHistory, deleteHistory as apiDeleteHistory } from '../services/api';

const HistoryPanel = ({ onSelectHistory }) => {
  const [history, setHistory] = useState([]);
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef(null);

  const fetchHistory = async () => {
    try {
      const data = await apiFetchHistory();
      setHistory(data);
    } catch (error) {
      console.error('Failed to fetch history:', error);
    }
  };

  useEffect(() => {
    fetchHistory();
    const handleHistoryUpdate = () => fetchHistory();
    window.addEventListener('refresh-history', handleHistoryUpdate);
    return () => window.removeEventListener('refresh-history', handleHistoryUpdate);
  }, []);

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setIsOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleDelete = async (e, id) => {
    e.stopPropagation(); // Prevent the parent button onClick from firing
    try {
      await apiDeleteHistory(id);
      // Immediately remove from local state for snappy UI
      setHistory((prev) => prev.filter(item => item.id !== id));
    } catch (error) {
      console.error('Failed to delete history item:', error);
    }
  };

  const getRecommendationIcon = (recommendation) => {
    switch (recommendation?.toUpperCase()) {
      case 'STRONG BUY':
      case 'BUY':
        return <TrendingUp className="h-3 w-3 text-emerald-500" />;
      case 'SELL':
      case 'STRONG SELL':
        return <TrendingDown className="h-3 w-3 text-rose-500" />;
      default:
        return <Minus className="h-3 w-3 text-slate-500" />;
    }
  };

  if (history.length === 0) return null;

  return (
    <div className="relative" ref={dropdownRef}>
      <button
        onClick={() => setIsOpen(true)}
        className="flex items-center space-x-2.5 px-4 py-2.5 rounded-2xl bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 transition-colors duration-300 shadow-sm"
      >
        <History className="h-6 w-6 text-slate-500 dark:text-slate-400" />
        <span className="text-base font-bold text-slate-600 dark:text-slate-300">Recent</span>
      </button>

      {isOpen && (
        <div className="absolute right-0 mt-2 w-72 max-h-96 overflow-y-auto glass-panel rounded-2xl shadow-2xl border border-slate-200/50 dark:border-slate-700/50 z-50 animate-in fade-in slide-in-from-top-2 duration-200">
          <div className="p-3 border-b border-slate-100 dark:border-slate-800/50 bg-slate-50/50 dark:bg-slate-900/50 rounded-t-2xl backdrop-blur-sm">
            <h3 className="text-sm font-bold text-slate-800 dark:text-slate-200">Recent Analyses</h3>
          </div>
          <div className="p-2 space-y-1">
            {history.map((item) => (
              <div key={item.id} className="relative group/item flex items-center justify-between p-3 rounded-xl hover:bg-slate-100 dark:hover:bg-slate-800/80 transition-colors">
                <button
                  onClick={() => {
                    onSelectHistory(item.result);
                    setIsOpen(false);
                  }}
                  className="w-full flex items-center justify-between group text-left pr-8"
                >
                  <div className="flex flex-col">
                    <span className="font-bold text-slate-900 dark:text-white text-sm">{item.company}</span>
                    <div className="flex items-center space-x-1 mt-0.5">
                      {getRecommendationIcon(item.result.recommendation)}
                      <span className="text-xs font-medium text-slate-500 dark:text-slate-400">
                        {item.result.recommendation}
                      </span>
                    </div>
                  </div>
                  <ChevronRight className="h-4 w-4 text-slate-300 dark:text-slate-600 group-hover:text-blue-500 transition-colors" />
                </button>
                <button 
                  onClick={(e) => handleDelete(e, item.id)}
                  className="absolute right-3 p-1.5 rounded-md text-slate-400 hover:text-red-500 hover:bg-red-50 dark:hover:bg-red-900/30 opacity-0 group-hover/item:opacity-100 transition-all duration-200"
                  aria-label="Delete history item"
                >
                  <Trash2 className="h-4 w-4" />
                </button>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default HistoryPanel;
