export const styles = {
  container: (darkMode: boolean) => `
    p-5 rounded-2xl border transition-all duration-300 mb-6
    ${darkMode ? 'bg-slate-900/40 border-slate-800/60 shadow-xl' : 'bg-white border-slate-200 shadow-sm'}
  `,
  headerWrapper: 'flex justify-between items-center mb-3',
  titleWrapper: 'space-y-0.5',
  title: 'text-sm font-black uppercase tracking-wider',
  subtitle: 'text-[11px] text-slate-400 font-mono',
  percentageText: 'text-2xl font-black font-mono tracking-tight text-indigo-500',

  track: (darkMode: boolean) => `
    w-full h-3 rounded-full overflow-hidden relative
    ${darkMode ? 'bg-slate-950/80' : 'bg-slate-100'}
  `,
  fill: 'h-full bg-gradient-to-r from-indigo-600 to-violet-500 rounded-full transition-all duration-500 ease-out shadow-[0_0_12px_rgba(99,102,241,0.4)]',

  metricsGrid:
    'grid grid-cols-3 gap-2 mt-4 pt-3 border-t border-slate-800/10 text-center font-mono',
  metricBlock: 'space-y-0.5',
  metricLabel: 'text-[9px] uppercase font-bold text-slate-400 block',
  metricValue: (colorClass: string) => `text-xs font-bold ${colorClass}`,
};
