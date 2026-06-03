import { useState, useEffect } from 'react';
import Sidebar from './components/layout/Sidebar';
import AllTasksView from './features/tasks/components/AllTasksView';
import TaskForm from './features/tasks/components/TaskForm';
import DashboardContainer from './features/tasks/components/Dashboard/DashboardContainer';
import type { Task, FilterStatus } from './features/tasks/types/task.types';
import type { TabId } from './types/navigation.types'; // 🌟 Importing your updated TabId definition

// Authentication Layer Imports
import { AuthProvider, useAuth } from './features/auth/context/AuthContext';
import { LoginView } from './features/auth/components/LoginView';
import { RegisterView } from './features/auth/components/RegisterView'; // 🌟 Import registration gate component

// Task Data Pipeline Hook
import { useTaskOperations } from './features/tasks/hooks/useTaskOperations';

const MainAppContent = () => {
  // 🌟 Extract user information and logout controls directly from your updated context layer
  const { isAuthenticated, user, logout } = useAuth();

  // 🌟 Updated Tab state constraint to match your separate navigation type definition safely
  const [activeTab, setActiveTab] = useState<TabId>('dashboard');
  const [isRegistering, setIsRegistering] = useState<boolean>(false); // 🌟 Tracks auth page state switcher
  const [darkMode, setDarkMode] = useState<boolean>(true);
  const [statusFilter, setStatusFilter] = useState<FilterStatus>('All');
  const [editingTask, setEditingTask] = useState<Task | null>(null);

  const { tasks, isLoading, error, fetchTasks, createTask, updateTask, deleteTask } =
    useTaskOperations();

  // Fetch database entries automatically only after successful authentication session
  useEffect(() => {
    if (isAuthenticated) {
      fetchTasks();
    }
  }, [fetchTasks, isAuthenticated]);

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

  // 🌟 GUARD LAYER: Renders either the Login portal or the Register form based on switcher state
  if (!isAuthenticated) {
    if (isRegistering) {
      return <RegisterView darkMode={darkMode} onSwitchToLogin={() => setIsRegistering(false)} />;
    }
    return <LoginView darkMode={darkMode} onSwitchToRegister={() => setIsRegistering(true)} />;
  }

  // APPLICATION LAYER: Render complete responsive workspace layout if session valid
  return (
    <div
      className={`min-h-screen flex flex-col lg:flex-row antialiased transition-colors ${
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

      <main className="flex-1 p-4 md:p-6 lg:p-8 w-full max-w-7xl mx-auto overflow-x-hidden space-y-6">
        {/* Network Error Banner Notification */}
        {error && (
          <div className="p-4 bg-rose-500/10 border border-rose-500/20 text-rose-400 text-xs font-bold rounded-xl">
            {error}
          </div>
        )}

        {/* Global Loading Feedback Indicator */}
        {isLoading && (
          <div className="text-xs text-indigo-400 font-bold tracking-widest animate-pulse uppercase">
            Syncing System Database...
          </div>
        )}

        {/* COMBINED DASHBOARD RENDERING ROUTE ELEMENT */}
        {activeTab === 'dashboard' && (
          <DashboardContainer
            darkMode={darkMode}
            tasks={tasks}
            setActiveTab={setActiveTab}
            setStatusFilter={setStatusFilter}
            onEditSelect={handleEditSelect}
            taskCount={taskCount}
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

        {/* 🌟 NEW CANVAS VIEW ROUTE: Profile Parameter Management Screen Container */}
        {activeTab === 'profile' && (
          <div
            className={`p-8 rounded-2xl border transition-all duration-200 ${
              darkMode ? 'bg-slate-900 border-slate-800' : 'bg-white border-slate-200 shadow-sm'
            }`}
          >
            <h2 className="text-xl font-black tracking-tight">Identity Node Registry Profile</h2>
            <p className="text-xs text-slate-400 mt-1 font-mono">System Parameters Verified.</p>

            <div className="mt-6 space-y-4 max-w-md">
              <div
                className={`p-4 rounded-xl border ${darkMode ? 'bg-slate-950/40 border-slate-800/60' : 'bg-slate-50 border-slate-200'}`}
              >
                <span className="text-[10px] font-bold tracking-wider uppercase text-slate-400 block mb-1">
                  Node Operator Alias
                </span>
                <p className="text-sm font-semibold capitalize text-indigo-500 dark:text-indigo-400">
                  {user?.username
                    ? user.username.charAt(0).toUpperCase() + user.username.slice(1)
                    : 'Developer'}
                </p>
              </div>

              <div
                className={`p-4 rounded-xl border ${darkMode ? 'bg-slate-950/40 border-slate-800/60' : 'bg-slate-50 border-slate-200'}`}
              >
                <span className="text-[10px] font-bold tracking-wider uppercase text-slate-400 block mb-1">
                  System Login Username
                </span>
                <p className="text-sm font-semibold text-slate-400 font-mono">
                  @{user?.username || 'unknown'}
                </p>
              </div>

              <button
                onClick={() => {
                  logout();
                  setActiveTab('dashboard');
                  setIsRegistering(false);
                }}
                className="w-full sm:w-auto px-5 py-2.5 bg-rose-600 hover:bg-rose-500 active:scale-[0.99] transition-all text-xs font-bold text-white rounded-xl shadow-lg shadow-rose-600/10"
              >
                Terminate Access Session (Log Out)
              </button>
            </div>
          </div>
        )}
      </main>
    </div>
  );
};

// Root Wrapper encapsulating global session context
export const App = () => {
  return (
    <AuthProvider>
      <MainAppContent />
    </AuthProvider>
  );
};

export default App;
