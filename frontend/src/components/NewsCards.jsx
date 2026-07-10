import React from 'react';
import { Newspaper, Calendar } from 'lucide-react';

const NewsCards = ({ news, sentiment }) => {
  if (!news || news.length === 0) return null;

  const getSentimentColor = (s) => {
    switch (s) {
      case 'Bullish': return 'bg-emerald-100 text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-400 border-emerald-200 dark:border-emerald-800';
      case 'Positive': return 'bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400 border-green-200 dark:border-green-800';
      case 'Bearish': return 'bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400 border-red-200 dark:border-red-800';
      case 'Negative': return 'bg-orange-100 text-orange-700 dark:bg-orange-900/30 dark:text-orange-400 border-orange-200 dark:border-orange-800';
      default: return 'bg-slate-100 text-slate-700 dark:bg-slate-700 dark:text-slate-300 border-slate-200 dark:border-slate-600';
    }
  };

  return (
    <div className="glass-panel rounded-2xl p-6 h-full flex flex-col group">
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center space-x-3">
          <div className="p-2 bg-blue-100 dark:bg-blue-900/30 rounded-xl shadow-inner">
            <Newspaper className="h-5 w-5 text-blue-600 dark:text-blue-400" />
          </div>
          <h2 className="text-xl font-black text-slate-900 dark:text-white tracking-tight">Recent News</h2>
        </div>
        <div className={`px-3 py-1 rounded-full text-xs font-semibold border ${getSentimentColor(sentiment)}`}>
          Overall: {sentiment}
        </div>
      </div>

      <div className="space-y-4">
        {news.map((item, idx) => (
          <div key={idx} className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-900/50 border border-slate-100 dark:border-slate-800 hover:border-blue-200 dark:hover:border-blue-800 transition-colors">
            <div className="flex justify-between items-start mb-2">
              <h4 className="font-bold text-slate-900 dark:text-white text-base leading-snug line-clamp-2 pr-2 group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors">{item.headline}</h4>
              <span className={`px-2 py-1 rounded-md text-[10px] font-bold border whitespace-nowrap shadow-sm ${getSentimentColor(item.sentiment)}`}>
                {item.sentiment}
              </span>
            </div>
            <p className="text-sm text-slate-600 dark:text-slate-300 line-clamp-2 mb-3 leading-relaxed">
              {item.description}
            </p>
            <div className="flex items-center justify-between text-xs text-slate-500 dark:text-slate-400">
              <span className="font-bold text-blue-600 dark:text-blue-400 uppercase tracking-wider">{item.source}</span>
              <div className="flex items-center">
                <Calendar className="h-3 w-3 mr-1" />
                {new Date(item.date).toLocaleDateString()}
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default NewsCards;
