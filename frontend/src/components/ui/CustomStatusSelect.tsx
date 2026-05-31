import React, { useState } from 'react';
import { FaGlobe, FaHourglassHalf, FaBolt, FaCheckCircle, FaChevronDown } from 'react-icons/fa';
import type { CustomStatusSelectProps, FilterStatus } from '../../types/layout';

export const CustomStatusSelect: React.FC<CustomStatusSelectProps> = ({
  darkMode,
  statusFilter,
  setStatusFilter,
}) => {
  const [isOpen, setIsOpen] = useState(false);

  // Map out configs for cleaner rendering loops
  const options = [
    {
      value: 'All' as FilterStatus,
      label: 'Show All Tasks',
      icon: <FaGlobe className="text-indigo-400" />,
    },
    {
      value: 'Pending' as FilterStatus,
      label: 'Pending Status Only',
      icon: <FaHourglassHalf className="text-amber-500" />,
    },
    {
      value: 'In Progress' as FilterStatus,
      label: 'In Progress Only',
      icon: <FaBolt className="text-blue-400" />,
    },
    {
      value: 'Completed' as FilterStatus,
      label: 'Completed Only',
      icon: <FaCheckCircle className="text-emerald-400" />,
    },
  ];

  const currentSelection = options.find((opt) => opt.value === statusFilter) || options[0];

  return (
    <div className="relative z-50 w-56">
      {/* Active Selection Button Wrapper */}
      <button
        type="button"
        onClick={() => setIsOpen(!isOpen)}
        className={`w-full px-4 py-2.5 rounded-xl text-xs font-bold border flex items-center justify-between transition-all outline-none focus:ring-2 focus:ring-indigo-500/20 ${
          darkMode
            ? 'bg-slate-950 border-slate-800 text-white hover:bg-slate-900'
            : 'bg-white border-slate-200 text-slate-900 hover:bg-slate-50'
        }`}
      >
        <div className="flex items-center gap-2">
          {currentSelection.icon}
          <span>{currentSelection.label}</span>
        </div>
        <FaChevronDown
          className={`text-[10px] transition-transform duration-200 ${isOpen ? 'transform rotate-180' : ''}`}
        />
      </button>

      {/* Floating Menu Popover Panel */}
      {isOpen && (
        <>
          {/* Transparent click overlay to close dropdown when clicking outside */}
          <div className="fixed inset-0 z-40" onClick={() => setIsOpen(false)} />

          <div
            className={`absolute left-0 right-0 mt-2 p-1.5 rounded-xl border shadow-xl z-50 animate-fadeIn ${
              darkMode ? 'bg-slate-950 border-slate-800' : 'bg-white border-slate-200'
            }`}
          >
            {options.map((option) => (
              <button
                key={option.value}
                type="button"
                onClick={() => {
                  setStatusFilter(option.value); // Set exact typed parameter values securely
                  setIsOpen(false);
                }}
                className={`w-full px-3 py-2 rounded-lg text-xs font-semibold flex items-center gap-2.5 transition-colors ${
                  statusFilter === option.value
                    ? darkMode
                      ? 'bg-indigo-600/20 text-indigo-400'
                      : 'bg-indigo-50 text-indigo-600'
                    : darkMode
                      ? 'text-slate-300 hover:bg-slate-900'
                      : 'text-slate-700 hover:bg-slate-50'
                }`}
              >
                <span className="text-[11px]">{option.icon}</span>
                <span>{option.label}</span>
              </button>
            ))}
          </div>
        </>
      )}
    </div>
  );
};

export default CustomStatusSelect;
