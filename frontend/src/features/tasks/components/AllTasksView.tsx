import React, { useState } from 'react';
import type { AllTasksProps, Task } from '../types/task.types';
import { CustomStatusSelect } from './CustomStatusSelect';

export const AllTasksView: React.FC<AllTasksProps> = ({
  darkMode,
  tasks,
  statusFilter,
  setStatusFilter,
  onEditSelect,
}) => {
  const [selectedTask, setSelectedTask] = useState<Task | null>(null);

  // Filter tasks dynamically using state parameter bounds
  const filteredTasks = tasks.filter(
    (task) => statusFilter === 'All' || task.status === statusFilter
  );

  return (
    <div className="space-y-6 animate-fadeIn">
      {/* Dynamic Selector Header */}
      <div
        className={`p-4 rounded-xl border flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 ${
          darkMode ? 'bg-slate-900/60 border-slate-800' : 'bg-white border-slate-200'
        }`}
      >
        <div>
          <h2 className="text-lg font-black tracking-tight">System Records Ledger</h2>
          <p className="text-xs text-slate-400">
            Reviewing all data matching active scope filter indices.
          </p>
        </div>

        <CustomStatusSelect
          darkMode={darkMode}
          statusFilter={statusFilter}
          setStatusFilter={setStatusFilter}
        />
      </div>

      {/* Main Structural Layout Split-Screen */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 items-start">
        {/* Left Side Table: Task List */}
        <div
          className={`lg:col-span-2 rounded-2xl border overflow-hidden ${
            darkMode ? 'bg-slate-900/40 border-slate-800/60' : 'bg-white border-slate-200'
          }`}
        >
          <div className="overflow-x-auto">
            <table className="w-full text-left text-sm">
              <thead
                className={`text-xs font-black uppercase tracking-wider border-b ${
                  darkMode
                    ? 'bg-slate-950/60 border-slate-800 text-slate-400'
                    : 'bg-slate-50 border-slate-200 text-slate-500'
                }`}
              >
                <tr>
                  <th className="p-4">Task Details</th>
                  <th className="p-4">Priority</th>
                  <th className="p-4">Due Date</th>
                  <th className="p-4 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-800/10">
                {filteredTasks.map((task) => (
                  <tr
                    key={task.id}
                    onClick={() => setSelectedTask(task)}
                    className={`cursor-pointer transition-colors ${
                      selectedTask?.id === task.id
                        ? darkMode
                          ? 'bg-indigo-600/10'
                          : 'bg-indigo-50'
                        : darkMode
                          ? 'hover:bg-slate-800/20'
                          : 'hover:bg-slate-50'
                    }`}
                  >
                    <td className="p-4">
                      <div className="font-bold tracking-tight">{task.title}</div>
                      <div className="text-xs text-slate-400 font-mono mt-0.5">{task.status}</div>
                    </td>
                    <td className="p-4">
                      <span
                        className={`text-[10px] px-2.5 py-1 rounded-full font-bold uppercase tracking-wider ${
                          task.priority === 'High'
                            ? 'bg-rose-500/10 text-rose-500'
                            : 'bg-slate-500/10 text-slate-400'
                        }`}
                      >
                        {task.priority}
                      </span>
                    </td>
                    <td className="p-4 font-mono text-xs">{task.dueDate}</td>
                    <td className="p-4 text-right" onClick={(e) => e.stopPropagation()}>
                      <button
                        onClick={() => onEditSelect(task)}
                        className="px-3 py-1.5 bg-indigo-600 hover:bg-indigo-500 text-white rounded-lg text-xs font-bold shadow"
                      >
                        ⚙️ Edit
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Right Side Column: Task Details Panel */}
        <div
          className={`p-6 rounded-2xl border transition-all ${
            selectedTask
              ? darkMode
                ? 'bg-slate-900/60 border-slate-800 shadow-2xl'
                : 'bg-white border-slate-200 shadow-xl'
              : 'opacity-50 border-dashed border-slate-700/40 text-center py-12'
          }`}
        >
          {selectedTask ? (
            <div className="space-y-4">
              <div className="flex justify-between items-start border-b border-slate-800/10 pb-3">
                <div>
                  <span className="text-[10px] font-mono font-bold tracking-widest text-indigo-500 uppercase">
                    Selected Identity Node
                  </span>
                  <h3 className="text-base font-black tracking-tight mt-1">{selectedTask.title}</h3>
                </div>
                <button
                  onClick={() => setSelectedTask(null)}
                  className="text-slate-400 hover:text-white text-xs"
                >
                  ✕
                </button>
              </div>

              <div>
                <h4 className="text-xs font-bold text-slate-400 uppercase tracking-wide mb-1">
                  Functional Blueprint Scope
                </h4>
                <p className="text-xs leading-relaxed text-slate-300 bg-slate-950/40 p-3 rounded-xl border border-slate-800/40">
                  {selectedTask.description ||
                    'No metadata description constraints attached to this system entry.'}
                </p>
              </div>

              <div className="grid grid-cols-2 gap-3 text-xs pt-2">
                <div>
                  <span className="block text-[10px] text-slate-400 font-bold uppercase">
                    Status State
                  </span>
                  <span className="font-medium mt-1 inline-block">{selectedTask.status}</span>
                </div>
                <div>
                  <span className="block text-[10px] text-slate-400 font-bold uppercase">
                    Deadline target
                  </span>
                  <span className="font-mono mt-1 inline-block">{selectedTask.dueDate}</span>
                </div>
              </div>
            </div>
          ) : (
            <div className="text-slate-500 text-xs font-medium">
              <div>🔍 Task Details Stream Offline</div>
              <p className="mt-1 text-[11px] text-slate-400/60 font-normal">
                Select any task row tracking entity node on the left list to initialize details view
                telemetry.
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default AllTasksView;
