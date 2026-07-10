import React from 'react';
import { DollarSign, TrendingUp, PieChart, Activity } from 'lucide-react';

const FinancialCards = ({ data }) => {
  if (!data) return null;

  const metrics = [
    { label: 'Market Cap', value: data.marketCap, icon: DollarSign, color: 'text-blue-500', bg: 'bg-blue-100 dark:bg-blue-900/30' },
    { label: 'Revenue', value: data.revenue, icon: TrendingUp, color: 'text-emerald-500', bg: 'bg-emerald-100 dark:bg-emerald-900/30' },
    { label: 'P/E Ratio', value: data.peRatio, icon: PieChart, color: 'text-purple-500', bg: 'bg-purple-100 dark:bg-purple-900/30' },
    { label: 'Profit Margin', value: data.profitMargin, icon: Activity, color: 'text-amber-500', bg: 'bg-amber-100 dark:bg-amber-900/30' }
  ];

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
      {metrics.map((metric, idx) => {
        const Icon = metric.icon;
        return (
          <div key={idx} className="glass-panel rounded-2xl p-6 hover:-translate-y-2 hover:shadow-2xl dark:hover:shadow-[0_0_30px_rgba(99,102,241,0.3)] dark:hover:border-indigo-500/50 transition-all duration-500 group cursor-default">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-xs font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400">{metric.label}</h3>
              <div className={`p-2 rounded-lg ${metric.bg} shadow-inner`}>
                <Icon className={`h-5 w-5 ${metric.color}`} />
              </div>
            </div>
            <p className="text-3xl font-black text-slate-900 dark:text-white tracking-tight">{metric.value}</p>
          </div>
        );
      })}
      
      <div className="col-span-1 md:col-span-2 lg:col-span-4 glass-panel rounded-3xl p-8 mt-2 hover:shadow-xl transition-shadow duration-300">
        <h3 className="text-sm font-black uppercase tracking-[0.2em] text-slate-500 dark:text-slate-400 mb-4">Company Overview</h3>
        <p className="text-slate-800 dark:text-slate-200 leading-relaxed text-lg md:text-xl font-medium">
          {data.overview}
        </p>
      </div>
    </div>
  );
};

export default FinancialCards;
