export const styles = {
  wrapper: 'relative z-20 w-56',
  trigger: (darkMode: boolean) =>
    `w-full px-4 py-2.5 rounded-xl text-xs font-bold border flex items-center justify-between transition-all outline-none focus:ring-2 focus:ring-indigo-500/20 ${
      darkMode
        ? 'bg-slate-950 border-slate-800 text-white hover:bg-slate-900'
        : 'bg-white border-slate-200 text-slate-900 hover:bg-slate-50'
    }`,
  triggerContent: 'flex items-center gap-2',
  chevron: (isOpen: boolean) =>
    `text-[10px] transition-transform duration-200 ${isOpen ? 'transform rotate-180' : ''}`,
  overlay: 'fixed inset-0 z-20',
  menu: (darkMode: boolean) =>
    `absolute left-0 right-0 mt-2 p-1.5 rounded-xl border shadow-xl z-30 animate-fadeIn ${
      darkMode ? 'bg-slate-950 border-slate-800' : 'bg-white border-slate-200'
    }`,
  option: (darkMode: boolean, active: boolean) =>
    `w-full px-3 py-2 rounded-lg text-xs font-semibold flex items-center gap-2.5 transition-colors ${
      active
        ? darkMode
          ? 'bg-indigo-600/20 text-indigo-400'
          : 'bg-indigo-50 text-indigo-600'
        : darkMode
          ? 'text-slate-300 hover:bg-slate-900'
          : 'text-slate-700 hover:bg-slate-50'
    }`,
  icon: 'text-[11px]',
};
