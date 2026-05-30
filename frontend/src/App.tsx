
import React, { useState } from 'react';
import Sidebar from './components/Layout/Sidebar';
import StatsGrid from './components/Dashboard/StatsGrid';
import TaskForm from './components/Dashboard/TaskForm';
import TaskList from './components/Dashboard/TaskList';
import type { TabId } from './types/layout';

// Layout Shell Structural Classes
const styles = {
  canvas: (dark: boolean) => 
    `min-h-screen flex flex-col lg:flex-row antialiased font-sans transition-colors duration-300 ${
      dark ? 'bg-slate-950 text-slate-100' : 'bg-slate-50 text-slate-900'
    }`,
  mainContentShell: "flex-1 p-4 md:p-8 overflow-y-auto max-w-7xl mx-auto w-full",
  welcomeTitle: (dark: boolean) => 
    `flex items-center gap-2 text-2xl md:text-3xl font-black tracking-tight ${dark ? 'text-white' : 'text-slate-900'}`,
  subtitleText: (dark: boolean) => 
    `mt-1 text-xs md:text-sm ${dark ? 'text-slate-400' : 'text-slate-600'}`,
  dbTag: (dark: boolean) => 
    `text-xs px-3.5 py-1.5 rounded-full font-mono border shadow-inner flex items-center gap-2 transition-colors ${
      dark ? 'bg-slate-900/80 text-indigo-400 border-slate-800/80' : 'bg-white text-indigo-600 border-slate-200'
    }`
};

const App = () => {
  const [activeTab, setActiveTab] = useState<TabId>('dashboard');
  const [darkMode, setDarkMode] = useState<boolean>(true);

  return (
    <div className={styles.canvas(darkMode)}>
      <Sidebar 
        activeTab={activeTab} 
        setActiveTab={setActiveTab} 
        darkMode={darkMode} 
        setDarkMode={setDarkMode} 
      />

      <div className={styles.mainContentShell}>
        {/* Core Header View Layer */}
        <header className="w-full flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-8">
          <div>
            <div className={styles.welcomeTitle(darkMode)}>
              <span>Welcome back, Developer!</span>
              <span className="animate-bounce origin-bottom-right inline-block">👋</span>
            </div>
            <p className={styles.subtitleText(darkMode)}>
              Here's your live architectural data overview stream.
            </p>
          </div>
          
          <span className={styles.dbTag(darkMode)}>
            <span className="h-2 w-2 rounded-full bg-emerald-500 animate-pulse" />
            PostgreSQL Active
          </span>
        </header>

        {/* View Port Routing Handler Switching Board */}
        {activeTab === 'dashboard' && (
          <div className="space-y-8 animate-fadeIn">
            <StatsGrid darkMode={darkMode} />
            <div className="w-full">
              <TaskList darkMode={darkMode} />
            </div>
          </div>
        )}

        {activeTab === 'add-task' && (
          <div className="max-w-2xl mx-auto mt-4 animate-fadeIn">
            <TaskForm darkMode={darkMode} onTaskCreated={() => setActiveTab('dashboard')} />
          </div>
        )}

        {activeTab === 'all-tasks' && (
          <div className="space-y-4 animate-fadeIn">
            <div className={`p-6 rounded-2xl border ${darkMode ? 'bg-slate-900/40 border-slate-800/60' : 'bg-white border-slate-200'}`}>
              <h2 className="text-xl font-bold mb-2">All Tasks Management View</h2>
              <p className="text-sm text-slate-400">Complete table view containing Update, Delete, and Filter controllers will render here.</p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default App;