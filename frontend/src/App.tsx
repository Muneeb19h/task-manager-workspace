// src/App.tsx
import React, { useState } from 'react';
import Sidebar from './components/Layout/Sidebar';
import { StatsGrid } from './components/Dashboard/StatsGrid';
import { AllTasksView } from './components/Dashboard/AllTasksView';
import TaskForm from './components/Dashboard/TaskForm';
import TaskList from './components/Dashboard/TaskList';
import type { TabId, Task, TaskStatus } from './types/layout';

const App = () => {
  const [activeTab, setActiveTab] = useState<TabId>('dashboard');
  const [darkMode, setDarkMode] = useState<boolean>(true);
  
  // New shared routing state variables
  const [statusFilter, setStatusFilter] = useState<TaskStatus | 'All'>('All');
  const [editingTask, setEditingTask] = useState<Task | undefined>(undefined);
  
  const tasks: Task[] = [
    { id: '1', title: 'Configure Django CORS Whitelist', description: 'Secure connection variables rules across API headers.', status: 'Pending', priority: 'Medium', dueDate: '2026-06-05' },
    { id: '2', title: 'Integrate React Bits Interactive Layouts', description: 'Assemble premium metrics analytics boards.', status: 'In Progress', priority: 'High', dueDate: '2026-06-12' },
  ];

  const handleEditSelect = (task: Task) => {
    setEditingTask(task);
    setActiveTab('add-task');
  };

  const taskCount={total: tasks.length,
              pending: tasks.filter(t=> t.status === 'Pending').length,
              inProgress: tasks.filter(t=>t.status ==='In Progress').length,
              completed: tasks.filter(t=>t.status==='Completed').length,};

  return (
    <div className={`min-h-screen flex flex-col lg:flex-row antialiased ${darkMode ? 'bg-slate-950 text-slate-100' : 'bg-slate-50 text-slate-900'}`}>
      <Sidebar activeTab={activeTab} setActiveTab={setActiveTab} darkMode={darkMode} setDarkMode={setDarkMode} statusFilter={statusFilter} setStatusFilter={setStatusFilter} />

      <main className="flex-1 p-4 md:p-8 overflow-y-auto max-w-7xl mx-auto w-full">
        {activeTab === 'dashboard' && (
          <div className="space-y-8">
            <StatsGrid darkMode={darkMode} setActiveTab={setActiveTab} setStatusFilter={setStatusFilter} tasksCount={taskCount} />
            <TaskList darkMode={darkMode} />
          </div>
        )}

        {activeTab === 'all-tasks' && (
          <AllTasksView 
            darkMode={darkMode} 
            tasks={tasks} 
            statusFilter={statusFilter} 
            setStatusFilter={setStatusFilter} 
            onEditSelect={handleEditSelect} 
          />
        )}

        {activeTab === 'add-task' && (
          <TaskForm 
            darkMode={darkMode} 
            initialTask={editingTask}
            onTaskCreated={() => { setEditingTask(undefined); setActiveTab('dashboard'); }} 
          />
        )}
      </main>
    </div>
  );
};

export default App;