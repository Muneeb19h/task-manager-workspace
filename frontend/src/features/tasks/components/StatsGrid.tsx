import React from 'react';
import type { StatsGridProps, FilterStatus } from '../../types/layout';

export const StatsGrid: React.FC<StatsGridProps> = ({
  darkMode,
  setActiveTab,
  setStatusFilter,
  tasksCount,
}) => {
  // Configurable array driving the grid dynamically
  const metrics = [
    {
      label: 'Total Tasks',
      count: tasksCount.total,
      filterValue: 'All' as FilterStatus,
      color: 'border-indigo-500 text-indigo-400 bg-indigo-500/5',
    },
    {
      label: 'Pending',
      count: tasksCount.pending,
      filterValue: 'Pending' as FilterStatus,
      color: 'border-amber-500 text-amber-500 bg-amber-500/5',
    },
    {
      label: 'In Progress',
      count: tasksCount.inProgress,
      filterValue: 'In Progress' as FilterStatus,
      color: 'border-blue-500 text-blue-400 bg-blue-500/5',
    },
    {
      label: 'Completed',
      count: tasksCount.completed,
      filterValue: 'Completed' as FilterStatus,
      color: 'border-emerald-500 text-emerald-400 bg-emerald-500/5',
    },
  ];

  const handleCardClick = (targetFilter: FilterStatus) => {
    setStatusFilter(targetFilter); // 1. Set the exact database pipeline filter state
    setActiveTab('all-tasks'); // 2. Redirect focus to the records table layout view
  };

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 md:gap-6">
      {metrics.map((metric) => (
        <div
          key={metric.label}
          onClick={() => handleCardClick(metric.filterValue)}
          className={`p-6 rounded-2xl border cursor-pointer transition-all duration-300 transform hover:-translate-y-1 hover:shadow-2xl ${
            darkMode
              ? 'bg-slate-900/40 border-slate-800/60 hover:bg-slate-900/80 hover:border-slate-700/80'
              : 'bg-white border-slate-200 hover:shadow-slate-200/60'
          }`}
        >
          <div className="flex justify-between items-center">
            <span
              className={`text-[11px] font-black tracking-wider uppercase ${darkMode ? 'text-slate-400' : 'text-slate-500'}`}
            >
              {metric.label}
            </span>
            <span className={`text-[9px] px-2 py-0.5 font-mono rounded border ${metric.color}`}>
              Analyze View
            </span>
          </div>
          <div
            className={`text-3xl md:text-4xl font-black mt-4 tracking-tight ${darkMode ? 'text-white' : 'text-slate-900'}`}
          >
            {metric.count}
          </div>
        </div>
      ))}
    </div>
  );
};

export default StatsGrid;
