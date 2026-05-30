import React from 'react';

export const StatsGrid: React.FC = () => {
  const stats = [
    { title: 'Total Tasks', value: '24', color: 'from-purple-500', trend: '↑ 12% vs last week', textColor: 'text-purple-400' },
    { title: 'Pending', value: '8', color: 'from-amber-500', trend: '↑ 5% vs last week', textColor: 'text-amber-400' },
    { title: 'In Progress', value: '9', color: 'from-blue-500', trend: '↑ 18% vs last week', textColor: 'text-blue-400' },
    { title: 'Completed', value: '7', color: 'from-emerald-500', trend: '↑ 20% vs last week', textColor: 'text-emerald-400' },
  ];

  return (
    <section className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 w-full">
      {stats.map((card, idx) => (
        <div key={idx} className="bg-slate-900/40 backdrop-blur-md border border-slate-800/60 p-5 rounded-2xl relative overflow-hidden group shadow-lg">
          <div className={`absolute top-0 left-0 w-full h-[2px] bg-gradient-to-r from-transparent via-950 ${card.color} to-transparent opacity-40 group-hover:opacity-100 transition-opacity`} />
          <div className={`text-xs font-bold tracking-widest uppercase ${card.textColor}`}>{card.title}</div>
          <div className="text-3xl font-black text-white mt-1">{card.value}</div>
          <div className={`text-[10px] ${card.textColor}/70 mt-2 font-mono`}>{card.trend}</div>
        </div>
      ))}
    </section>
  );
};

export default StatsGrid;