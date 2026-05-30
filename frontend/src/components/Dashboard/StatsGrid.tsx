import React from 'react';

interface StatsGridProps {
  darkMode: boolean;
}

export const StatsGrid: React.FC<StatsGridProps> = ({ darkMode }) => {
  const stats = [
    { title: 'Total Tasks', value: '24', color: 'from-purple-500', trend: '↑ 12% vs last week', darkText: 'text-purple-400', lightText: 'text-purple-600' },
    { title: 'Pending', value: '8', color: 'from-amber-500', trend: '↑ 5% vs last week', darkText: 'text-amber-400', lightText: 'text-amber-600' },
    { title: 'In Progress', value: '9', color: 'from-blue-500', trend: '↑ 18% vs last week', darkText: 'text-blue-400', lightText: 'text-blue-600' },
    { title: 'Completed', value: '7', color: 'from-emerald-500', trend: '↑ 20% vs last week', darkText: 'text-emerald-400', lightText: 'text-emerald-600' },
  ];

  return (
    <section className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 w-full">
      {stats.map((card, idx) => (
        <div key={idx} className={`p-5 rounded-2xl relative overflow-hidden group shadow-md transition-colors border ${
          darkMode ? 'bg-slate-900/40 border-slate-800/60' : 'bg-white border-slate-200'
        }`}>
          <div className={`absolute top-0 left-0 w-full h-[2px] bg-gradient-to-r from-transparent via-950 ${card.color} to-transparent opacity-40 group-hover:opacity-100 transition-opacity`} />
          <div className={`text-xs font-bold tracking-widest uppercase ${darkMode ? card.darkText : card.lightText}`}>{card.title}</div>
          <div className={`text-3xl font-black mt-1 ${darkMode ? 'text-white' : 'text-slate-900'}`}>{card.value}</div>
          <div className={`text-[10px] mt-2 font-mono ${darkMode ? `${card.darkText}/70` : `${card.lightText}/80`}`}>{card.trend}</div>
        </div>
      ))}
    </section>
  );
};

export default StatsGrid;