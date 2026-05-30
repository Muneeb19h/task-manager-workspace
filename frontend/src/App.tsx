import React from 'react';
import Sidebar from './components/Layout/Sidebar';
import StatsGrid from './components/Dashboard/StatsGrid';
import TaskForm from './components/Dashboard/TaskForm';
import TaskList from './components/Dashboard/TaskList';

const App = () => {
  return (
    // Responsive outer grid: Layout shifts horizontally when viewing on desktop monitors
    <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col lg:flex-row antialiased font-sans selection:bg-indigo-500 selection:text-white">
      
      {/* 1. SIDEBAR PANEL SYSTEM LINK */}
      <Sidebar />

      {/* 2. CORE SYSTEM CONTENT SUITE PANEL */}
      <div className="flex-1 p-4 md:p-8 overflow-y-auto max-w-7xl mx-auto w-full">
        
        {/* Dynamic Dashboard Greeting Unit Header */}
        <header className="w-full flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-8">
          <div>
            <div className="flex items-center gap-2 text-2xl md:text-3xl font-black tracking-tight text-white">
              <span>Welcome back, Developer!</span>
              <span className="animate-bounce origin-bottom-right inline-block">👋</span>
            </div>
            <p className="text-slate-400 mt-1 text-xs md:text-sm">
              Here's what is happening across your task pipeline today.
            </p>
          </div>
          
          <span className="bg-slate-900/80 text-indigo-400 text-xs px-3.5 py-1.5 rounded-full font-mono border border-slate-800/80 shadow-inner flex items-center gap-2">
            <span className="h-2 w-2 rounded-full bg-emerald-500 animate-pulse" />
            PostgreSQL Active
          </span>
        </header>

        {/* 3. REUSABLE SYSTEM METRIC PANEL WIDGET */}
        <StatsGrid />

        {/* 4. LOWER DATA STREAM SPLIT GRID PANEL CONTROL MODULE */}
        <main className="grid grid-cols-1 lg:grid-cols-3 gap-8 items-start mt-8 w-full">
          {/* Left Third: Input Management Column Block */}
          <div className="lg:col-span-1">
            <TaskForm />
          </div>

          {/* Right Two-Thirds: Active Tasks Reader Column Block */}
          <div className="lg:col-span-2">
            <TaskList />
          </div>
        </main>

      </div>
    </div>
  );
};

export default App;