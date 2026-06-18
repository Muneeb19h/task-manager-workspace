// AllTasksView.styles.ts

export const styles = {
  container: 'space-y-6 animate-fadeIn',

  navContainer: (darkMode: boolean) => `
    flex items-center space-x-2 p-1.5 rounded-xl border w-fit mb-4 transition-colors duration-200
    ${darkMode ? 'bg-slate-950 border-slate-800' : 'bg-slate-100 border-slate-200'}
  `,

  navButton: (active: boolean, darkMode: boolean) => `
    flex items-center space-x-2 px-4 py-2 text-xs font-semibold rounded-lg transition-all duration-150
    ${
      active
        ? 'bg-indigo-600 text-slate-100 shadow-md'
        : darkMode
          ? 'text-slate-400 hover:text-slate-200 hover:bg-slate-900/40'
          : 'text-slate-600 hover:text-slate-800 hover:bg-slate-200/50'
    }
  `,

  headerCard: (darkMode: boolean) => `
    p-4 rounded-xl border flex flex-col md:flex-row justify-between items-stretch md:items-center gap-4
    ${darkMode ? 'bg-slate-900/60 border-slate-800' : 'bg-white border-slate-200'}
  `,

  headerTextWrapper: 'flex-1',
  headerTitle: 'text-lg font-black tracking-tight',
  headerSubtitle: 'text-xs text-slate-400',

  // Search Box Configurations
  searchContainer: 'relative flex-1 max-w-md w-full',
  searchIconContainer: 'absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none',
  searchIcon: (darkMode: boolean) => `text-xs ${darkMode ? 'text-slate-500' : 'text-slate-400'}`,
  searchInput: (darkMode: boolean) => `
    w-full pl-9 pr-8 py-2 text-xs rounded-xl border outline-none font-medium transition-all duration-200
    ${
      darkMode
        ? 'bg-slate-950/60 border-slate-800 text-slate-100 placeholder-slate-500 focus:border-indigo-500/80 focus:ring-1 focus:ring-indigo-500/40'
        : 'bg-slate-50 border-slate-200 text-slate-900 placeholder-slate-400 focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500'
    }
  `,
  searchClearBtn:
    'absolute inset-y-0 right-0 pr-3 flex items-center text-slate-400 hover:text-slate-200',
  searchClearIcon: 'text-[10px]',

  // Grid Layout Splitting
  mainGrid: 'grid grid-cols-1 lg:grid-cols-3 gap-6 items-start',

  // Table View Area Layouts
  tableContainer: (darkMode: boolean) => `
    lg:col-span-2 rounded-2xl border overflow-hidden
    ${darkMode ? 'bg-slate-900/40 border-slate-800/60' : 'bg-white border-slate-200'}
  `,
  tableWrapper: 'overflow-x-auto',
  tableElement: 'w-full text-left text-sm',
  tableHeader: (darkMode: boolean) => `
    text-xs font-black uppercase tracking-wider border-b
    ${darkMode ? 'bg-slate-950/60 border-slate-800 text-slate-400' : 'bg-slate-50 border-slate-200 text-slate-500'}
  `,
  tableHeaderCell: 'p-4',
  tableRow: (isActive: boolean, darkMode: boolean) => `
    cursor-pointer transition-colors
    ${
      isActive
        ? darkMode
          ? 'bg-indigo-600/10'
          : 'bg-indigo-50'
        : darkMode
          ? 'hover:bg-slate-800/20'
          : 'hover:bg-slate-50'
    }
  `,
  tableBodyCell: 'p-4',
  taskTitle: 'font-bold tracking-tight',
  taskMetaStatus: 'text-xs text-slate-400 font-mono mt-0.5',
  taskDueDate: 'p-4 font-mono text-xs',
  actionsCell: 'p-4 text-right',

  // Buttons
  editBtn:
    'flex items-center gap-1.5 ml-auto px-3 py-1.5 bg-indigo-600 hover:bg-indigo-500 text-white rounded-lg text-xs font-bold shadow transition-colors',
  deleteBtn:
    'flex items-center justify-center gap-2 px-3 py-1.5 bg-rose-950/40 border border-rose-900/40 text-rose-400 text-xs font-bold rounded-lg hover:bg-rose-900/40 transition-colors w-full sm:w-auto',

  tableEmptyRow: 'p-8 text-center text-xs text-slate-400 font-medium',

  // Side Details Panel Profile Context
  detailsPanel: (hasSelection: boolean, darkMode: boolean) => `
    p-6 rounded-2xl border transition-all
    ${
      hasSelection
        ? darkMode
          ? 'bg-slate-900/60 border-slate-800 shadow-2xl'
          : 'bg-white border-slate-200 shadow-xl'
        : 'opacity-50 border-dashed border-slate-700/40 text-center py-12'
    }
  `,
  detailsHeader: 'flex justify-between items-start border-b border-slate-800/10 pb-3',
  detailsSubHeading: 'text-[10px] font-mono font-bold tracking-widest text-indigo-500 uppercase',
  detailsTitle: 'text-base font-black tracking-tight mt-1',
  detailsCloseBtn:
    'flex items-center justify-center p-1 text-slate-400 hover:text-white rounded-lg hover:bg-slate-800/50 transition-colors',

  sectionLabel: (darkMode: boolean) =>
    `text-[10px] font-black uppercase tracking-wider mb-2 font-mono ${darkMode ? 'text-slate-500' : 'text-slate-400'}`,
  descriptionBox: (darkMode: boolean) => `
    text-xs leading-relaxed p-4 rounded-xl border transition-colors duration-200
    ${darkMode ? 'text-slate-300 bg-slate-950/40 border-slate-800/60' : 'text-slate-600 bg-slate-100/70 border-slate-200/80'}
  `,

  metadataGrid: 'grid grid-cols-2 gap-3 text-xs pt-2',
  metaLabel: 'block text-[10px] text-slate-400 font-bold uppercase',
  statusCycleLink:
    'flex items-center gap-1.5 font-medium mt-1 inline-block text-indigo-400 hover:underline text-left cursor-pointer',
  dueDateText: 'font-mono mt-1 inline-block',
  detailsFooter: 'pt-4 border-t border-slate-800/10 flex justify-end',

  // Empty State Panel View Offline Telemetry Styles
  offlineWrapper: 'text-slate-500 text-xs font-medium',
  offlineHeader: 'flex items-center gap-2 justify-center lg:justify-start',
  offlineIcon: 'text-sm opacity-70',
  offlineText: 'mt-1 text-[11px] text-slate-400/60 font-normal',
};
