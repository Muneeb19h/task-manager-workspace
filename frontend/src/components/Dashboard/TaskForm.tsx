import React from 'react';

export const TaskForm: React.FC = () => {
  return (
    <div className="bg-slate-900/40 backdrop-blur-md border border-slate-800/60 rounded-2xl p-6 shadow-2xl relative lg:sticky lg:top-8">
      <div className="flex items-center gap-2 mb-6">
        <span className="h-2 w-2 rounded-full bg-blue-500 animate-pulse" />
        <h2 className="text-xl font-bold tracking-tight text-white">Create Task</h2>
      </div>
      
      <div className="space-y-4">
        <p className="text-xs text-slate-400 italic">Form inputs layout section...</p>
      </div>
    </div>
  );
};

export default TaskForm;