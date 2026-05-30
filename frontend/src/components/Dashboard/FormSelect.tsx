// src/components/Dashboard/FormSelect.tsx
import React, { useState } from 'react';
import { FaChevronDown } from 'react-icons/fa';

export interface FormOption {
  value: string;
  label: string;
  icon: React.ReactNode;
}

interface FormSelectProps {
  labelTitle: string;
  darkMode: boolean;
  selectedValue: string;
  options: FormOption[];
  onSelectChange: (value: string) => void;
}

export const FormSelect: React.FC<FormSelectProps> = ({ labelTitle, darkMode, selectedValue, options, onSelectChange }) => {
  const [isOpen, setIsOpen] = useState(false);
  const currentSelection = options.find(opt => opt.value === selectedValue) || options[0];

  return (
    <div className="space-y-2 flex-1 min-w-[200px]">
      <label className={`text-[11px] uppercase tracking-wider font-black ${darkMode ? 'text-slate-400' : 'text-slate-500'}`}>
        {labelTitle}
      </label>
      
      <div className="relative">
        <button
          type="button"
          onClick={() => setIsOpen(!isOpen)}
          className={`w-full px-4 py-3 rounded-xl text-xs font-bold border flex items-center justify-between transition-all outline-none ${
            darkMode 
              ? 'bg-slate-900/40 border-slate-800 text-white hover:bg-slate-800/40' 
              : 'bg-white border-slate-200 text-slate-900 hover:bg-slate-50'
          }`}
        >
          <div className="flex items-center gap-2">
            {currentSelection.icon}
            <span>{currentSelection.label}</span>
          </div>
          <FaChevronDown className={`text-[10px] text-slate-400 transition-transform ${isOpen ? 'rotate-180' : ''}`} />
        </button>

        {isOpen && (
          <>
            <div className="fixed inset-0 z-40" onClick={() => setIsOpen(false)} />
            <div className={`absolute left-0 right-0 mt-2 p-1.5 rounded-xl border shadow-2xl z-50 ${
              darkMode ? 'bg-slate-950 border-slate-800' : 'bg-white border-slate-200'
            }`}>
              {options.map((option) => (
                <button
                  key={option.value}
                  type="button"
                  onClick={() => {
                    onSelectChange(option.value);
                    setIsOpen(false);
                  }}
                  className={`w-full px-3 py-2.5 rounded-lg text-xs font-semibold flex items-center gap-2.5 transition-colors ${
                    selectedValue === option.value
                      ? darkMode ? 'bg-indigo-600/20 text-indigo-400' : 'bg-indigo-50 text-indigo-600'
                      : darkMode ? 'text-slate-300 hover:bg-slate-900' : 'text-slate-700 hover:bg-slate-50'
                  }`}
                >
                  {option.icon}
                  <span>{option.label}</span>
                </button>
              ))}
            </div>
          </>
        )}
      </div>
    </div>
  );
};