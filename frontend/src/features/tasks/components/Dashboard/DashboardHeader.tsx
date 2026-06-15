import React from 'react';
import { FaTerminal, FaCalendarAlt } from 'react-icons/fa';
import { useAuth } from '../../../auth/context/AuthContext';
// Import the updated notification bell component safely
import { NotificationBell } from '../NotificationBell';

interface DashboardHeaderProps {
  darkMode: boolean;
  totalTasks: number;
  pendingTasks: number;
}

export const DashboardHeader: React.FC<DashboardHeaderProps> = ({
  darkMode,
  totalTasks,
  pendingTasks,
}) => {
  // Extract the active user state context parameters
  const { user } = useAuth();

  // Evaluated instantly as a constant value so the linter tracks it flawlessly
  const hour = new Date().getHours();
  const greeting = hour < 12 ? 'Good morning' : hour < 18 ? 'Good afternoon' : 'Good evening';

  // Generate the system date string cleanly without tracking state
  const options: Intl.DateTimeFormatOptions = { month: 'long', day: 'numeric', year: 'numeric' };
  const currentTime = new Date().toLocaleDateString('en-US', options);

  return (
    <div
      className={`mb-8 flex flex-col md:flex-row md:items-center md:justify-between gap-4 p-6 rounded-2xl border transition-all duration-200 ${
        darkMode
          ? 'bg-gradient-to-r from-slate-900/40 dark:border-slate-800/60'
          : 'bg-gradient-to-r from-indigo-500/10 via-indigo-500/[0.02] to-transparent border-slate-200/80 shadow-sm'
      }`}
    >
      <div className="space-y-1.5">
        <div className="flex items-center gap-2">
          <div className="flex items-center justify-center h-5 w-5 rounded bg-indigo-500/10 text-indigo-500 dark:text-indigo-400 font-mono text-[10px] border border-indigo-500/20">
            <FaTerminal className="text-[9px]" />
          </div>
          <span className="text-[10px] font-bold tracking-wider font-mono text-indigo-500 dark:text-indigo-400 uppercase">
            Environment: Production-Ready
          </span>
        </div>

        <h1
          className={`text-2xl md:text-3xl font-black tracking-tight ${darkMode ? 'text-white' : 'text-slate-900'}`}
        >
          {greeting},{' '}
          <span className="bg-gradient-to-r from-indigo-500 to-purple-500 bg-clip-text text-transparent capitalize">
            {user?.username
              ? user.username.charAt(0).toUpperCase() + user.username.slice(1)
              : 'Developer'}
          </span>{' '}
          👋
        </h1>

        <p className={`text-xs ${darkMode ? 'text-slate-400' : 'text-slate-500'} font-medium`}>
          {totalTasks === 0 ? (
            'Your engine core is idle. Ready to deploy your first task registry unit?'
          ) : pendingTasks > 0 ? (
            <>
              You have{' '}
              <span className="font-semibold text-indigo-500 dark:text-indigo-400">
                {pendingTasks} pending updates
              </span>{' '}
              awaiting state modifications across your pipeline.
            </>
          ) : (
            'System database fully synchronized. All active deployments are completed!'
          )}
        </p>
      </div>

      {/* Modern Status Badge / Notification Controls Group */}
      <div className="flex items-center gap-3 self-start md:self-auto">
        {/* Inject the live action polling bell container */}
        <NotificationBell darkMode={darkMode} />

        <div
          className={`flex items-center gap-3 px-4 py-3 rounded-xl border ${
            darkMode
              ? 'bg-slate-900/60 border-slate-800 text-slate-300'
              : 'bg-white border-slate-200/80 text-slate-600 shadow-sm'
          }`}
        >
          <div className="h-8 w-8 rounded-lg bg-indigo-500/10 text-indigo-500 flex items-center justify-center text-xs border border-indigo-500/20">
            <FaCalendarAlt />
          </div>
          <div className="text-left">
            <div
              className={`text-[10px] font-bold tracking-wider uppercase font-mono ${
                darkMode ? 'text-slate-500' : 'text-slate-400'
              }`}
            >
              System Date
            </div>
            <div className="text-xs font-black tracking-tight font-mono">{currentTime}</div>
          </div>
        </div>
      </div>
    </div>
  );
};
