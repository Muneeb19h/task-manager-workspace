export const styles = {
  overlay: 'fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm',
  modal:
    'w-full max-w-md overflow-hidden rounded-2xl bg-slate-900 border border-slate-800 text-slate-100 shadow-2xl p-6 relative',
  closeBtn: 'absolute top-4 right-4 text-slate-400 hover:text-white transition-colors',
  header: 'flex items-center space-x-3 mb-4',
  headerIcon: 'p-2.5 bg-indigo-600/20 text-indigo-400 rounded-xl',
  title: 'text-lg font-bold',
  subtitle: 'text-xs text-slate-400',
  errorBox:
    'p-3 mb-4 bg-rose-500/10 border border-rose-500/20 text-rose-400 text-xs font-semibold rounded-xl',
  successBox:
    'p-3 mb-4 bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 text-xs font-semibold rounded-xl',
  listContainer:
    'max-h-48 overflow-y-auto my-4 border border-slate-800 rounded-xl divide-y divide-slate-800/60 p-2 bg-slate-950/40',
  loadingRow: 'flex items-center justify-center py-8 text-xs text-slate-400 space-x-2',
  emptyState: 'text-center py-8 text-xs text-slate-500',
  userRow:
    'flex items-center space-x-3 p-2.5 rounded-lg hover:bg-slate-800/40 cursor-pointer transition-colors',
  checkbox:
    'rounded border-slate-700 bg-slate-800 text-indigo-600 focus:ring-indigo-500 focus:ring-offset-slate-900 w-4 h-4',
  username: 'text-sm font-medium text-slate-300',
  footer: 'flex items-center justify-end space-x-3 mt-6 border-t border-slate-800/60 pt-4',
  cancelBtn:
    'px-4 py-2 bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs font-bold rounded-xl transition-colors',
  saveBtn:
    'px-5 py-2 bg-indigo-600 hover:bg-indigo-500 disabled:opacity-50 text-xs font-bold text-white rounded-xl shadow-lg shadow-indigo-600/10 transition-all flex items-center space-x-2',
  spinner: 'animate-spin text-indigo-400',
};
