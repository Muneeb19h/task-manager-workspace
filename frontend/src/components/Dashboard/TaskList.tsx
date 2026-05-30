import React from 'react';

export const TaskList: React.FC = () => {
  return (
    <div className="bg-slate-900/20 backdrop-blur-md border border-slate-800/40 rounded-2xl p-6 shadow-2xl min-h-[500px]">
      <div className="flex justify-between items-center mb-6 border-b border-slate-800/80 pb-4">
        <div className="flex items-center gap-2">
          <span className="h-2 w-2 rounded-full bg-indigo-500" />
          <h2 className="text-xl font-bold tracking-tight text-white">Live Workspace Items</h2>
        </div>
      </div>

      <div className="space-y-4">
        <div className="group relative bg-slate-900/60 backdrop-blur-sm border-l-4 border-l-amber-500 border border-slate-800/80 rounded-xl p-5 hover:border-slate-700/80 transition-all duration-300 shadow-lg">
          <div className="flex justify-between items-start">
            <div>
              <h3 className="font-bold text-lg text-white group-hover:text-amber-400 transition-colors">
                Integrate React Bits Interactive Layouts
              </h3>
              <p className="text-sm text-slate-400 mt-1">
                Assemble premium metrics analytics boards and pair them with dynamic CSS glass effects.
              </p>
            </div>
            <span className="text-xs bg-amber-500/10 text-amber-400 px-2.5 py-1 rounded border border-amber-500/20 font-medium font-mono">
              In Progress
            </span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default TaskList;