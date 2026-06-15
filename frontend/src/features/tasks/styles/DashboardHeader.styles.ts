export const styles = {
  container: (darkMode: boolean) =>
    `mb-8 flex flex-col md:flex-row md:items-center md:justify-between gap-4 p-6 rounded-2xl border transition-all duration-200 ${
      darkMode
        ? 'bg-gradient-to-r from-slate-900/40 dark:border-slate-800/60'
        : 'bg-gradient-to-r from-indigo-500/10 via-indigo-500/[0.02] to-transparent border-slate-200/80 shadow-sm'
    }`,
  infoPanel: 'space-y-1.5',
  badgeRow: 'flex items-center gap-2',
  badgeCircle:
    'flex items-center justify-center h-5 w-5 rounded bg-indigo-500/10 text-indigo-500 dark:text-indigo-400 font-mono text-[10px] border border-indigo-500/20',
  statusText:
    'text-[10px] font-bold tracking-wider font-mono text-indigo-500 dark:text-indigo-400 uppercase',
  heading: (darkMode: boolean) =>
    `text-2xl md:text-3xl font-black tracking-tight ${darkMode ? 'text-white' : 'text-slate-900'}`,
  name: 'bg-gradient-to-r from-indigo-500 to-purple-500 bg-clip-text text-transparent capitalize',
  summary: (darkMode: boolean) =>
    `text-xs ${darkMode ? 'text-slate-400' : 'text-slate-500'} font-medium`,
  callout: 'font-semibold text-indigo-500 dark:text-indigo-400',
  actionsRow: 'flex items-center gap-3 self-start md:self-auto',
  miniCard: (darkMode: boolean) =>
    `flex items-center gap-3 px-4 py-3 rounded-xl border ${
      darkMode
        ? 'bg-slate-900/60 border-slate-800 text-slate-300'
        : 'bg-white border-slate-200/80 text-slate-600 shadow-sm'
    }`,
  dateLabel: (darkMode: boolean) =>
    `text-[10px] font-bold tracking-wider uppercase font-mono ${darkMode ? 'text-slate-500' : 'text-slate-400'}`,
  dateValue: 'text-xs font-black tracking-tight font-mono',
};
