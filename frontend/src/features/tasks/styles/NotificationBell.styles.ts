export const styles = {
  wrapper: 'relative inline-block text-left',
  button: 'p-2.5 rounded-xl border relative transition-all duration-200',
  buttonDark: 'bg-slate-900 border-slate-800 text-slate-300 hover:text-white hover:bg-slate-800',
  buttonLight: 'bg-white border-slate-200 text-slate-600 hover:text-slate-900 hover:shadow-sm',
  badgeWrapper: 'absolute top-1.5 right-1.5 flex h-2.5 w-2.5',
  ping: 'animate-ping absolute inline-flex h-full w-full rounded-full bg-indigo-400 opacity-75',
  badgeDot: 'relative inline-flex rounded-full h-2.5 w-2.5 text-indigo-500',
  dropdown:
    'absolute right-0 mt-2 w-80 rounded-2xl border shadow-2xl z-50 overflow-hidden transform origin-top-right transition-all duration-200',
  dropdownDark: 'bg-slate-900 border-slate-800 text-slate-100',
  dropdownLight: 'bg-white border-slate-200 text-slate-900',
  header:
    'px-4 py-3 border-b border-slate-800/60 flex items-center justify-between bg-slate-950/20',
  title: 'text-xs font-black tracking-wider uppercase font-mono text-indigo-400',
  unreadBadge:
    'text-[10px] font-mono px-2 py-0.5 rounded bg-indigo-500/10 text-indigo-400 border border-indigo-500/20',
  list: 'max-h-64 overflow-y-auto divide-y divide-slate-800/40',
  emptyState: 'p-6 text-center text-xs text-slate-500 font-medium',
  item: 'p-3.5 text-xs transition-colors leading-relaxed',
  itemUnreadDark: 'bg-indigo-500/[0.03]',
  itemUnreadLight: 'bg-indigo-500/[0.01]',
  messageRead: 'text-slate-400',
  messageUnread: 'text-slate-200 font-medium',
  timestamp: 'text-[9px] font-mono text-slate-500 block mt-1',
};
