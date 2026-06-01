import { useState, useEffect } from 'react';
import Sidebar from './components/layout/Sidebar';
import { StatsGrid } from './features/tasks/components/StatsGrid';
import AllTasksView from './features/tasks/components/AllTasksView';
import TaskForm from './features/tasks/components/TaskForm';
import { TaskBoardView } from './features/tasks/components/TaskBoardView';
import type { Task, FilterStatus } from './features/tasks/types/task.types';

import { useTaskOperations } from './features/tasks/hooks/useTaskOperations';

const App = () => {
  const [activeTab, setActiveTab] = useState<'dashboard' | 'all-tasks' | 'add-task'>('dashboard');
  const [darkMode, setDarkMode] = useState<boolean>(true);
  const [statusFilter, setStatusFilter] = useState<FilterStatus>('All');
  const [editingTask, setEditingTask] = useState<Task | null>(null);
  const { tasks, isLoading, error, fetchTasks, createTask, updateTask, deleteTask } =
    useTaskOperations();
  useEffect(() => {
    fetchTasks();
  }, []);

  const handleEditSelect = (task: Task) => {
    setEditingTask(task);
    setActiveTab('add-task');
  };

  const taskCount = {
    total: tasks.length,
    pending: tasks.filter((t) => t.status === 'Pending').length,
    inProgress: tasks.filter((t) => t.status === 'In Progress').length,
    completed: tasks.filter((t) => t.status === 'Completed').length,
  };

  return (
    <div
      className={`min-h-screen flex flex-col lg:flex-row antialiased ${
        darkMode ? 'bg-slate-950 text-slate-100' : 'bg-slate-50 text-slate-900'
      }`}
    >
      <Sidebar
        activeTab={activeTab}
        setActiveTab={setActiveTab}
        darkMode={darkMode}
        setDarkMode={setDarkMode}
        statusFilter={statusFilter}
        setStatusFilter={setStatusFilter}
      />

      <main className="flex-1 p-4 md:p-6 lg:p-8 w-full max-w-7xl mx-auto overflow-x-hidden">
        {/* Network Error Banner Notification */}
        {error && (
          <div className="p-4 bg-rose-500/10 border border-rose-500/20 text-rose-400 text-xs font-bold rounded-xl">
            ⚠️ {error}
          </div>
        )}
        {/* Global Loading Feedback Indicator */}
        {isLoading && (
          <div className="text-xs text-indigo-400 font-bold tracking-widest animate-pulse uppercase">
            Syncing System Database...
          </div>
        )}
        {activeTab === 'dashboard' && (
          <div className="space-y-8">
            <StatsGrid
              darkMode={darkMode}
              setActiveTab={setActiveTab}
              setStatusFilter={setStatusFilter}
              tasksCount={taskCount}
            />
          </div>
        )}
        {activeTab === 'dashboard' && (
          <TaskBoardView
            darkMode={darkMode}
            tasks={tasks} // ⚡ Passing the managed dynamic database list array down
            onEditSelect={(task) => {
              setEditingTask(task);
              setActiveTab('add-task'); // Redirects to the form with the selected node context prefilled
            }}
          />
        )}

        {activeTab === 'all-tasks' && (
          <AllTasksView
            darkMode={darkMode}
            tasks={tasks}
            statusFilter={statusFilter}
            setStatusFilter={setStatusFilter}
            onEditSelect={handleEditSelect}
            onDeleteTask={deleteTask}
            onUpdateStatus={updateTask}
          />
        )}

        {activeTab === 'add-task' && (
          <TaskForm
            darkMode={darkMode}
            key={editingTask ? editingTask.id : 'new-task'}
            editingTask={editingTask}
            setEditingTask={setEditingTask}
            onCreateTask={createTask}
            onUpdateTask={updateTask}
            setActiveTab={setActiveTab}
          />
        )}
      </main>
    </div>
  );
};

export default App;
