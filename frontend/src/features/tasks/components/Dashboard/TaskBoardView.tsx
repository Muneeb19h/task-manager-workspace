import React from 'react';
import type { Task, TaskStatus } from '../../types/task.types';
import type { TaskBoardViewProps } from '../../types/component-props.types';
import { FaCalendarAlt } from 'react-icons/fa';

export const TaskBoardView: React.FC<TaskBoardViewProps> = ({ darkMode, tasks, onEditSelect }) => {
  // Styling maps to cleanly match your original layout design configurations dynamically
  const statusStyles: Record<TaskStatus, { border: string; text: string; bg: string }> = {
    Pending: {
      border: 'border-l-amber-500',
      text: 'text-amber-400',
      bg: 'bg-amber-500/10',
    },
    'In Progress': {
      border: 'border-l-blue-500',
      text: 'text-blue-400',
      bg: 'bg-blue-500/10',
    },
    Completed: {
      border: 'border-l-emerald-500',
      text: 'text-emerald-400',
      bg: 'bg-emerald-500/10',
    },
  };

  // Computes column list datasets and counts straight from your live database array
  const getColumnData = (status: TaskStatus) => {
    const filtered = tasks.filter((t) => t.status === status);
    return {
      list: filtered,
      count: filtered.length,
    };
  };

  const columns = [
    { id: 'Pending' as TaskStatus, label: 'Pending', color: 'bg-amber-500' },
    { id: 'In Progress' as TaskStatus, label: 'In Progress', color: 'bg-blue-500' },
    { id: 'Completed' as TaskStatus, label: 'Completed', color: 'bg-emerald-500' },
  ];

  return (
    <div className="w-full space-y-6 animate-fadeIn">
      {/* Step 2: Columns layout wrapped separately to hold its structural 3-column split */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 items-start">
        {columns.map((col) => {
          const columnData = getColumnData(col.id);

          return (
            <div
              key={col.id}
              className={`p-4 rounded-2xl border min-h-0 md:min-h-[450px] flex flex-col transition-colors ${
                darkMode
                  ? 'bg-slate-900/20 border-slate-800/40'
                  : 'bg-slate-100/60 border-slate-200'
              }`}
            >
              {/* Column Header — Counts update dynamically now */}
              <div
                className={`flex items-center gap-2 mb-4 pb-2 border-b ${
                  darkMode ? 'border-slate-800/60' : 'border-slate-200'
                }`}
              >
                <span className={`h-2 w-2 rounded-full ${col.color}`} />
                <h3
                  className={`font-bold text-sm tracking-wide ${darkMode ? 'text-slate-200' : 'text-slate-700'}`}
                >
                  {col.label}{' '}
                  <span className="text-xs font-normal text-slate-400 ml-0.5">
                    ({columnData.count})
                  </span>
                </h3>
              </div>

              {/* Filtered Column Card Items Stack */}
              <div className="space-y-3 flex-1 overflow-y-auto max-h-[600px] pr-0.5">
                {columnData.list.length > 0 ? (
                  columnData.list.map((task) => {
                    const style = statusStyles[task.status];

                    return (
                      <div
                        key={task.id}
                        onClick={() => onEditSelect?.(task)}
                        className={`p-4 rounded-xl border-l-4 ${style.border} border shadow-sm transition-all hover:-translate-y-0.5 hover:scale-[1.01] duration-200 cursor-pointer ${
                          darkMode
                            ? 'bg-slate-900/70 border-slate-800/80'
                            : 'bg-white border-slate-200'
                        }`}
                      >
                        <h4
                          className={`font-bold text-sm ${darkMode ? 'text-white' : 'text-slate-900'}`}
                        >
                          {task.title}
                        </h4>

                        <p
                          className={`text-xs mt-1.5 line-clamp-2 leading-relaxed ${darkMode ? 'text-slate-400' : 'text-slate-500'}`}
                        >
                          {task.description || 'No description provided.'}
                        </p>

                        <div
                          className={`flex justify-between items-center mt-3 pt-2 border-t ${
                            darkMode ? 'border-slate-800/40' : 'border-slate-100'
                          }`}
                        >
                          <span
                            className={`text-[10px] font-mono px-2 py-0.5 rounded border ${style.text} ${style.bg}`}
                          >
                            {task.status}
                          </span>

                          {/* Renders the live dynamic target deadline string with Fa Icon */}
                          {task.dueDate && (
                            <span className="flex items-center gap-1 text-[10px] font-mono text-slate-400/80 tracking-tight">
                              <FaCalendarAlt className="text-[9px] opacity-70" /> {task.dueDate}
                            </span>
                          )}
                        </div>
                      </div>
                    );
                  })
                ) : (
                  /* Empty Column Fallback Display */
                  <div className="text-center py-10 text-xs text-slate-500 font-medium border border-dashed border-slate-800/20 rounded-xl">
                    No active tasks in scope
                  </div>
                )}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default TaskBoardView;
