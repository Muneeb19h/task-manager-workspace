import React from 'react';

interface TaskFormProps {
  darkMode: boolean;
  onTaskCreated: () => void;
}

export const TaskForm: React.FC<TaskFormProps> = ({ darkMode, onTaskCreated }) => {
  return (
    <div className={`border rounded-2xl p-6 shadow-2xl transition-colors ${
      darkMode ? 'bg-slate-900/40 border-slate-800/60' : 'bg-white border-slate-200'
    }`}>
      <div className="flex items-center gap-2 mb-6">
        <span className="h-2 w-2 rounded-full bg-blue-500 animate-pulse" />
        <h2 className={`text-xl font-bold tracking-tight ${darkMode ? 'text-white' : 'text-slate-900'}`}>Create New Task</h2>
      </div>
      
      <div className="space-y-4">
        <p className="text-sm text-slate-400 italic">Form fields will cleanly render inside this isolated view window panel container.</p>
        <button 
          onClick={onTaskCreated}
          className="mt-4 px-4 py-2 bg-indigo-600 text-white rounded-xl text-xs font-bold shadow"
        >
          Return to Dashboard
        </button>
      </div>
    </div>
  );
};

export default TaskForm;