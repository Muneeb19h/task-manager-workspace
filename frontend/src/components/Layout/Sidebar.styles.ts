export const sidebarStyles = {
  container: (dark: boolean, isOpen: boolean) =>
    `fixed inset-y-0 left-0 z-50 w-64 p-6 flex flex-col justify-between shrink-0 transition-transform duration-300 transform 
    ${isOpen ? 'translate-x-0' : '-translate-x-full'} 
    lg:relative lg:translate-x-0 lg:w-64 lg:min-h-screen border-r ${
      dark
        ? 'bg-slate-900/95 lg:bg-slate-900/60 backdrop-blur-xl border-slate-800/80'
        : 'bg-white lg:bg-slate-100 backdrop-blur-xl border-slate-200'
    }`,

  brandText: (dark: boolean) =>
    `text-xl font-black tracking-tight ${dark ? 'text-white' : 'text-slate-900'}`,

  navButton: (isSelected: boolean, dark: boolean) =>
    `w-full flex items-center gap-3.5 px-4 py-3 rounded-xl text-sm font-semibold tracking-wide transition-all duration-200 group text-left ${
      isSelected
        ? 'bg-indigo-600 text-white shadow-lg shadow-indigo-600/20'
        : dark
          ? 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/40'
          : 'text-slate-600 hover:text-slate-900 hover:bg-slate-200/60'
    }`,

  themeWidget: (dark: boolean) =>
    `p-3 rounded-xl flex items-center justify-between border transition-colors ${
      dark ? 'bg-slate-950/40 border-slate-800/60' : 'bg-slate-200/40 border-slate-300/60'
    }`,

  themeWidgetText: (dark: boolean) =>
    `text-xs font-bold tracking-wide flex items-center gap-2 ${dark ? 'text-slate-400' : 'text-slate-600'}`,

  // 🌟 Upgraded Profile container style wrapper with responsive focus background mapping
  profileContainer: (isSelected: boolean, dark: boolean) =>
    `pt-4 border-t flex items-center gap-3 px-3 py-2.5 rounded-xl cursor-pointer transition-all duration-200 ${
      dark ? 'border-slate-800/60' : 'border-slate-200'
    } ${
      isSelected
        ? 'bg-indigo-600/10 border border-indigo-500/30 text-indigo-400'
        : dark
          ? 'border border-transparent hover:bg-slate-800/30'
          : 'border border-transparent hover:bg-slate-200/40'
    }`,

  // 🌟 Swapped standard user icon out for customized initials letter block avatar styles
  profileIconContainer: (isSelected: boolean, dark: boolean) =>
    `h-9 w-9 rounded-full flex items-center justify-center text-xs font-bold shrink-0 transition-colors ${
      isSelected
        ? 'bg-indigo-600 text-white shadow-md'
        : dark
          ? 'bg-slate-800 border border-slate-700 text-slate-300'
          : 'bg-indigo-600/10 border border-indigo-500/20 text-indigo-600'
    }`,

  profileName: (dark: boolean) =>
    `text-xs font-black capitalize truncate ${dark ? 'text-slate-200' : 'text-slate-800'}`,
};
