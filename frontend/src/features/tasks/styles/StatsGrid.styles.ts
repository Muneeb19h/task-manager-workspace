export const styles = {
  grid: 'grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 md:gap-6',
  card: (darkMode: boolean) =>
    `p-6 rounded-2xl border cursor-pointer transition-all duration-300 transform hover:-translate-y-1 hover:shadow-2xl ${
      darkMode
        ? 'bg-slate-900/40 border-slate-800/60 hover:bg-slate-900/80 hover:border-slate-700/80'
        : 'bg-white border-slate-200 hover:shadow-slate-200/60'
    }`,
  label: (darkMode: boolean) =>
    `text-[11px] font-black tracking-wider uppercase ${darkMode ? 'text-slate-400' : 'text-slate-500'}`,
  badge: 'text-[9px] px-2 py-0.5 font-mono rounded border',
  count: (darkMode: boolean) =>
    `text-3xl md:text-4xl font-black mt-4 tracking-tight ${darkMode ? 'text-white' : 'text-slate-900'}`,
};
