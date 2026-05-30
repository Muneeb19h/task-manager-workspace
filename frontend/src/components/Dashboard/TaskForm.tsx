/* eslint-disable @typescript-eslint/no-explicit-any */

import React, { useState } from 'react';
import type { TaskFormProps } from '../../types/layout';

const styles = {
  card: (dark: boolean) => 
    `border rounded-2xl p-6 shadow-2xl transition-all duration-300 ${
      dark ? 'bg-slate-900/40 border-slate-800/60' : 'bg-white border-slate-200'
    }`,
  heading: (dark: boolean) => 
    `text-xl font-black tracking-tight ${dark ? 'text-white' : 'text-slate-900'}`,
  label: (dark: boolean) => 
    `block text-xs font-bold uppercase tracking-wider mb-2 ${dark ? 'text-slate-400' : 'text-slate-600'}`,
  input: (dark: boolean) => 
    `w-full px-4 py-3 rounded-xl border text-sm transition-all focus:outline-none focus:ring-2 focus:ring-indigo-500/20 ${
      dark 
        ? 'bg-slate-950/60 border-slate-800 text-slate-100 focus:border-indigo-500 color-scheme-dark' 
        : 'bg-slate-50 border-slate-200 text-slate-900 focus:border-indigo-600'
    }`,
  btnPrimary: "px-5 py-3 bg-indigo-600 hover:bg-indigo-500 text-white font-bold text-xs rounded-xl shadow-lg shadow-indigo-600/10 transition-all flex items-center justify-center gap-2",
  btnSecondary: (dark: boolean) => 
    `px-5 py-3 font-bold text-xs rounded-xl transition-all border ${
      dark ? 'border-slate-800 text-slate-400 hover:bg-slate-800/40 hover:text-slate-200' : 'border-slate-200 text-slate-600 hover:bg-slate-100 hover:text-slate-900'
    }`,
  btnDelete: "px-5 py-3 bg-rose-600/10 text-rose-500 hover:bg-rose-600 hover:text-white font-bold text-xs rounded-xl transition-all flex items-center justify-center gap-2 border border-rose-500/20"
};

export const TaskForm: React.FC<TaskFormProps> = ({ darkMode, onTaskCreated, initialTask, onDelete }) => {
  const isUpdateMode = !!initialTask;

  const [title, setTitle] = useState(initialTask?.title || '');
  const [description, setDescription] = useState(initialTask?.description || '');
  const [status, setStatus] = useState(initialTask?.status || 'Pending');
  const [priority, setPriority] = useState(initialTask?.priority || 'Medium');
  // New State Variable Added Here:
  const [dueDate, setDueDate] = useState(initialTask?.dueDate || '');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    console.log('Submitting Task Data:', { title, description, status, priority, dueDate });
    onTaskCreated();
  };

  return (
    <div className={styles.card(darkMode)}>
      <div className="flex items-center justify-between mb-8 pb-4 border-b border-slate-800/10">
        <div className="flex items-center gap-2.5">
          <span className={`h-2.5 w-2.5 rounded-full ${isUpdateMode ? 'bg-amber-500' : 'bg-emerald-500'} animate-pulse`} />
          <h2 className={styles.heading(darkMode)}>
            {isUpdateMode ? 'Modify Task Properties' : 'Create New Task'}
          </h2>
        </div>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        <div>
          <label className={styles.label(darkMode)}>Task Title</label>
          <input 
            type="text"
            required
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            className={styles.input(darkMode)}
          />
        </div>

        <div>
          <label className={styles.label(darkMode)}>Detailed Description</label>
          <textarea 
            rows={3}
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            className={styles.input(darkMode)}
          />
        </div>

        {/* 🛠️ Dynamic 3-Column Input Row */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <div>
            <label className={styles.label(darkMode)}>Status</label>
            <select value={status} onChange={(e) => setStatus(e.target.value as any)} className={styles.input(darkMode)}>
              <option value="Pending">⌛ Pending</option>
              <option value="In Progress">⚡ In Progress</option>
              <option value="Completed">✅ Completed</option>
            </select>
          </div>

          <div>
            <label className={styles.label(darkMode)}>Priority</label>
            <select value={priority} onChange={(e) => setPriority(e.target.value as any)} className={styles.input(darkMode)}>
              <option value="Low">🟢 Low</option>
              <option value="Medium">🟡 Medium</option>
              <option value="High">🔴 High</option>
            </select>
          </div>

          {/* 📅 NEW DUE DATE FIELD CONTAINER */}
          <div>
            <label className={styles.label(darkMode)}>Due Date</label>
            <input 
              type="date"
              required
              value={dueDate}
              onChange={(e) => setDueDate(e.target.value)}
              className={styles.input(darkMode)}
            />
          </div>
        </div>

        <div className="flex flex-col sm:flex-row justify-between items-slate gap-4 pt-4 border-t border-slate-800/10">
          <div>
            {isUpdateMode && onDelete && (
              <button type="button" onClick={() => onDelete(initialTask.id)} className={styles.btnDelete}>
                🗑️ Delete Task Entry
              </button>
            )}
          </div>

          <div className="flex items-center gap-3 justify-end">
            <button type="button" onClick={onTaskCreated} className={styles.btnSecondary(darkMode)}>Cancel</button>
            <button type="submit" className={styles.btnPrimary}>
              {isUpdateMode ? '💾 Save Changes' : '➕ Deploy Task'}
            </button>
          </div>
        </div>
      </form>
    </div>
  );
};

export default TaskForm;