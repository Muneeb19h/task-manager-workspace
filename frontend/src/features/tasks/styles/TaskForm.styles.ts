export const taskFormStyles = {
  card: (dark: boolean) =>
    `border rounded-2xl p-6 shadow-2xl transition-all duration-300 ${
      dark ? 'bg-slate-900/40 border-slate-800/60' : 'bg-white border-slate-200'
    }`,
  heading: (dark: boolean) =>
    `text-xl font-black tracking-tight ${dark ? 'text-white' : 'text-slate-900'}`,
  label: (dark: boolean) =>
    `block text-xs font-bold uppercase tracking-wider mb-2 ${dark ? 'text-slate-400' : 'text-slate-600'}`,
  input: (dark: boolean) =>
    `w-full px-4 py-3 rounded-xl border text-sm transition-all focus:outline-none focus:ring-2 focus:ring-indigo-500/20 ${
      dark
        ? 'bg-slate-950/60 border-slate-800 text-slate-100 focus:border-indigo-500 color-scheme-dark'
        : 'bg-slate-50 border-slate-200 text-slate-900 focus:border-indigo-600'
    }`,
  btnPrimary:
    'px-5 py-3 bg-indigo-600 hover:bg-indigo-500 text-white font-bold text-xs rounded-xl shadow-lg shadow-indigo-600/10 transition-all flex items-center justify-center gap-2',
  btnSecondary: (dark: boolean) =>
    `px-5 py-3 font-bold text-xs rounded-xl transition-all border ${
      dark
        ? 'border-slate-800 text-slate-400 hover:bg-slate-800/40 hover:text-slate-200'
        : 'border-slate-200 text-slate-600 hover:bg-slate-100 hover:text-slate-900'
    }`,
  btnDelete:
    'px-5 py-3 bg-rose-600/10 text-rose-500 hover:bg-rose-600 hover:text-white font-bold text-xs rounded-xl transition-all flex items-center justify-center gap-2 border border-rose-500/20',
};
