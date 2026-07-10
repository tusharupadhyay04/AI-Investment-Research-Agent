import React from 'react';
import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer
} from 'recharts';
import { TrendingUp, TrendingDown, Activity } from 'lucide-react';

const PriceChart = ({ data }) => {
  if (!data || data.length === 0) return null;

  // Calculate price difference over the period
  const startPrice = data[0].price;
  const endPrice = data[data.length - 1].price;
  const priceChange = endPrice - startPrice;
  const percentChange = (priceChange / startPrice) * 100;
  const isPositive = priceChange >= 0;

  // Determine gradient colors based on performance
  const gradientColors = isPositive
    ? { top: '#10b981', bottom: '#10b981' } // Emerald
    : { top: '#f43f5e', bottom: '#f43f5e' }; // Rose

  const CustomTooltip = ({ active, payload, label }) => {
    if (active && payload && payload.length) {
      return (
        <div className="bg-slate-900/90 backdrop-blur-md border border-slate-700 p-3 rounded-xl shadow-xl">
          <p className="text-slate-400 text-xs mb-1 font-medium">{new Date(label).toLocaleDateString(undefined, { month: 'short', day: 'numeric', year: 'numeric' })}</p>
          <p className={`text-xl font-bold ${isPositive ? 'text-emerald-400' : 'text-rose-400'}`}>
            ${payload[0].value.toFixed(2)}
          </p>
        </div>
      );
    }
    return null;
  };

  return (
    <div className="glass-panel rounded-2xl p-6 mb-8 relative overflow-hidden group">
      <div className="flex flex-col sm:flex-row sm:items-end justify-between mb-8 z-10 relative">
        <div>
          <div className="flex items-center space-x-2 mb-2">
            <Activity className="h-5 w-5 text-blue-500" />
            <h3 className="text-sm font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400">6-Month Price History</h3>
          </div>
          <div className="flex items-end space-x-3">
            <span className="text-4xl font-black text-slate-900 dark:text-white tracking-tight">
              ${endPrice.toFixed(2)}
            </span>
            <span className={`flex items-center text-sm font-bold pb-1 ${isPositive ? 'text-emerald-500' : 'text-rose-500'}`}>
              {isPositive ? <TrendingUp className="h-4 w-4 mr-1" /> : <TrendingDown className="h-4 w-4 mr-1" />}
              {Math.abs(percentChange).toFixed(2)}%
            </span>
          </div>
        </div>
      </div>

      <div className="h-72 w-full z-10 relative">
        <ResponsiveContainer width="100%" height="100%">
          <AreaChart data={data} margin={{ top: 10, right: 0, left: -20, bottom: 0 }}>
            <defs>
              <linearGradient id="colorPrice" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor={gradientColors.top} stopOpacity={0.3} />
                <stop offset="95%" stopColor={gradientColors.bottom} stopOpacity={0} />
              </linearGradient>
            </defs>
            <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#334155" opacity={0.2} />
            <XAxis 
              dataKey="date" 
              axisLine={false} 
              tickLine={false} 
              tick={{ fill: '#64748b', fontSize: 12 }}
              tickFormatter={(str) => {
                const date = new Date(str);
                return `${date.toLocaleString('default', { month: 'short' })} ${date.getFullYear().toString().substr(-2)}`;
              }}
              minTickGap={30}
            />
            <YAxis 
              axisLine={false} 
              tickLine={false} 
              tick={{ fill: '#64748b', fontSize: 12 }}
              tickFormatter={(val) => `$${val}`}
              domain={['auto', 'auto']}
            />
            <Tooltip content={<CustomTooltip />} />
            <Area 
              type="monotone" 
              dataKey="price" 
              stroke={gradientColors.top} 
              strokeWidth={3}
              fillOpacity={1} 
              fill="url(#colorPrice)" 
            />
          </AreaChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
};

export default PriceChart;
