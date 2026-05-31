import React from 'react';

interface TaskListProps {
  darkMode: boolean;
}

export const TaskList: React.FC<TaskListProps> = ({ darkMode }) => {
  // Mock data structural array mirroring standard response models
  const mockTasks = [
    {
      title: 'Integrate React Bits Interactive Layouts',
      desc: 'Assemble premium metrics analytics boards with glass effects.',
      status: 'In Progress',
      border: 'border-l-blue-500',
      text: 'text-blue-400',
      bg: 'bg-blue-500/10',
    },
    {
      title: 'Configure Django CORS Whitelist',
      desc: 'Secure connection variables rules across API headers.',
      status: 'Pending',
      border: 'border-l-amber-500',
      text: 'text-amber-400',
      bg: 'bg-amber-500/10',
    },
    {
      title: 'Setup Postgres Docker Schema',
      desc: 'Verify local system transaction queries execute flawlessly.',
      status: 'Completed',
      border: 'border-l-emerald-500',
      text: 'text-emerald-400',
      bg: 'bg-emerald-500/10',
    },
  ];

  const columns = [
    { id: 'Pending', label: 'Pending (1)', color: 'bg-amber-500' },
    { id: 'In Progress', label: 'In Progress (1)', color: 'bg-blue-500' },
    { id: 'Completed', label: 'Completed (1)', color: 'bg-emerald-500' },
  ];

  return (
    <div className="w-full grid grid-cols-1 md:grid-cols-3 gap-6 items-start">
      {columns.map((col) => (
        <div
          key={col.id}
          /* ⚡ FIXED BELOW: min-h-0 for tight content fitting on mobile, md:min-h-[450px] for large layouts */
          className={`p-4 rounded-2xl border min-h-0 md:min-h-[450px] transition-colors ${
            darkMode ? 'bg-slate-900/20 border-slate-800/40' : 'bg-slate-100/60 border-slate-200'
          }`}
        >
          {/* Column Header */}
          <div
            className={`flex items-center gap-2 mb-4 pb-2 border-b ${
              darkMode ? 'border-slate-800/60' : 'border-slate-200'
            }`}
          >
            <span className={`h-2 w-2 rounded-full ${col.color}`} />
            <h3
              className={`font-bold text-sm tracking-wide ${darkMode ? 'text-slate-200' : 'text-slate-700'}`}
            >
              {col.label}
            </h3>
          </div>

          {/* Filtered Column Card Items Stack */}
          <div className="space-y-3">
            {mockTasks
              .filter((t) => t.status === col.id)
              .map((task, i) => (
                <div
                  key={i}
                  className={`p-4 rounded-xl border-l-4 ${task.border} border shadow-sm transition-transform hover:-translate-y-0.5 duration-200 ${
                    darkMode ? 'bg-slate-900/70 border-slate-800/80' : 'bg-white border-slate-200'
                  }`}
                >
                  <h4 className={`font-bold text-sm ${darkMode ? 'text-white' : 'text-slate-900'}`}>
                    {task.title}
                  </h4>
                  <p
                    className={`text-xs mt-1 line-clamp-2 ${darkMode ? 'text-slate-400' : 'text-slate-500'}`}
                  >
                    {task.desc}
                  </p>

                  <div
                    className={`flex justify-between items-center mt-3 pt-2 border-t ${
                      darkMode ? 'border-slate-800/40' : 'border-slate-100'
                    }`}
                  >
                    <span
                      className={`text-[10px] font-mono px-2 py-0.5 rounded border ${task.text} ${task.bg}`}
                    >
                      {task.status}
                    </span>
                  </div>
                </div>
              ))}
          </div>
        </div>
      ))}
    </div>
  );
};

export default TaskList;
