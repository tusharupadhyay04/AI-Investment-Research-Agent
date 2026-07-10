import React from 'react';
import { Target, ShieldAlert, CheckCircle2, XCircle, BrainCircuit } from 'lucide-react';
import ScoreChart from './ScoreChart';

const InvestmentCard = ({ data }) => {
  if (!data || !data.recommendation) return null;

  const getRecommendationColor = (rec) => {
    switch (rec.toUpperCase()) {
      case 'INVEST': return 'bg-gradient-to-br from-emerald-400 to-teal-600 text-white shadow-[0_10px_40px_-10px_rgba(16,185,129,0.6)]';
      case 'HOLD': return 'bg-gradient-to-br from-amber-400 to-orange-500 text-white shadow-[0_10px_40px_-10px_rgba(245,158,11,0.6)]';
      case 'PASS': return 'bg-gradient-to-br from-rose-400 to-red-600 text-white shadow-[0_10px_40px_-10px_rgba(225,29,72,0.6)]';
      default: return 'bg-gradient-to-br from-slate-400 to-slate-600 text-white';
    }
  };

  const getRiskColor = (risk) => {
    switch (risk.toUpperCase()) {
      case 'LOW': return 'text-emerald-500 bg-emerald-50 dark:bg-emerald-900/20';
      case 'MEDIUM': return 'text-amber-500 bg-amber-50 dark:bg-amber-900/20';
      case 'HIGH': return 'text-rose-500 bg-rose-50 dark:bg-rose-900/20';
      case 'EXTREME': return 'text-red-700 bg-red-100 dark:bg-red-900/30 font-bold';
      default: return 'text-slate-500';
    }
  };

  return (
    <div className="glass-panel rounded-2xl overflow-hidden h-full flex flex-col group">
      {/* Header */}
      <div className={`px-8 py-6 flex items-center justify-between border-b border-slate-100/10 dark:border-slate-700/50 ${getRecommendationColor(data.recommendation)}`}>
        <div className="flex flex-col md:flex-row md:items-center space-y-2 md:space-y-0 md:space-x-4">
          <div className="flex items-center space-x-3 opacity-90">
            <Target className="h-10 w-10 md:h-12 md:w-12 drop-shadow-md" />
            <h2 className="text-5xl md:text-6xl font-black tracking-tight drop-shadow-lg uppercase">
              AI Verdict:
            </h2>
          </div>
          <h2 className="text-5xl md:text-6xl font-black tracking-tighter drop-shadow-xl underline decoration-4 underline-offset-8">
            {data.recommendation}
          </h2>
        </div>
        <div className="text-right w-48">
          <ScoreChart score={data.investmentScore} />
        </div>
      </div>

      <div className="p-8 flex-grow flex flex-col">
        {/* Risk & Confidence */}
        <div className="grid grid-cols-2 gap-6 mb-10">
          <div className="relative overflow-hidden flex flex-col items-center justify-center p-6 rounded-3xl bg-gradient-to-b from-slate-50 to-slate-100/50 dark:from-slate-800/50 dark:to-slate-900/50 border border-slate-200 dark:border-slate-700/50 shadow-sm hover:shadow-md transition-shadow">
            <div className="absolute top-0 right-0 -mt-4 -mr-4 w-24 h-24 bg-blue-500/10 rounded-full blur-2xl"></div>
            <ShieldAlert className="h-8 w-8 text-slate-400 dark:text-slate-500 mb-3" />
            <span className="text-xs text-slate-500 dark:text-slate-400 uppercase font-bold tracking-[0.2em] mb-2 z-10">Risk Level</span>
            <span className={`text-2xl font-black tracking-tighter ${getRiskColor(data.riskLevel)} px-4 py-1.5 rounded-xl border border-current shadow-sm z-10 bg-white/50 dark:bg-black/20 backdrop-blur-sm`}>
              {data.riskLevel}
            </span>
          </div>
          <div className="relative overflow-hidden flex flex-col items-center justify-center p-6 rounded-3xl bg-gradient-to-b from-slate-50 to-slate-100/50 dark:from-slate-800/50 dark:to-slate-900/50 border border-slate-200 dark:border-slate-700/50 shadow-sm hover:shadow-md transition-shadow">
            <div className="absolute top-0 left-0 -mt-4 -ml-4 w-24 h-24 bg-indigo-500/10 rounded-full blur-2xl"></div>
            <BrainCircuit className="h-8 w-8 text-slate-400 dark:text-slate-500 mb-3" />
            <span className="text-xs text-slate-500 dark:text-slate-400 uppercase font-bold tracking-[0.2em] mb-2 z-10">Confidence</span>
            <span className="text-4xl font-black text-slate-900 dark:text-white tracking-tighter drop-shadow-sm z-10">
              {data.confidenceScore}%
            </span>
          </div>
        </div>

        {/* Pros and Cons */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
          <div>
            <h4 className="flex items-center text-emerald-600 dark:text-emerald-400 font-bold text-lg mb-4">
              <CheckCircle2 className="h-6 w-6 mr-2" /> Bull Case
            </h4>
            <ul className="space-y-4">
              {(Array.isArray(data.pros) ? data.pros : []).map((pro, idx) => (
                <li key={idx} className="text-base text-slate-700 dark:text-slate-300 flex items-start leading-relaxed">
                  <span className="text-emerald-500 mr-3 mt-1 text-lg">•</span>
                  {pro}
                </li>
              ))}
            </ul>
          </div>
          <div>
            <h4 className="flex items-center text-rose-600 dark:text-rose-400 font-bold text-lg mb-4">
              <XCircle className="h-6 w-6 mr-2" /> Bear Case
            </h4>
            <ul className="space-y-4">
              {(Array.isArray(data.cons) ? data.cons : []).map((con, idx) => (
                <li key={idx} className="text-base text-slate-700 dark:text-slate-300 flex items-start leading-relaxed">
                  <span className="text-rose-500 mr-3 mt-1 text-lg">•</span>
                  {con}
                </li>
              ))}
            </ul>
          </div>
        </div>

        {/* Summary */}
        <div className="mt-8 bg-gradient-to-r from-blue-50 to-indigo-50 dark:from-blue-900/20 dark:to-indigo-900/20 p-8 rounded-3xl border border-blue-100/50 dark:border-indigo-500/20 relative shadow-sm">
          <BrainCircuit className="absolute top-6 right-6 h-16 w-16 text-blue-500/10 dark:text-blue-400/10" />
          <h4 className="text-sm font-black tracking-[0.2em] uppercase text-blue-600 dark:text-blue-400 mb-4 flex items-center">
            <span className="w-2 h-2 rounded-full bg-blue-500 mr-2 animate-pulse"></span>
            Executive Summary
          </h4>
          <p className="text-slate-800 dark:text-slate-200 text-lg md:text-xl leading-relaxed italic font-medium relative z-10">
            "{data.summary}"
          </p>
        </div>
      </div>
    </div>
  );
};

export default InvestmentCard;
