/* eslint-disable @typescript-eslint/no-explicit-any */
import React, { useState } from 'react';
import type { TaskFormProps } from '../../types/layout';
import { FormSelect, type FormOption } from '../ui/FormSelect';
import {
  FaHourglassHalf,
  FaBolt,
  FaCheckCircle,
  FaArrowCircleDown,
  FaMinusCircle,
  FaExclamationCircle,
  FaTrashAlt,
  FaSave,
  FaPlus,
} from 'react-icons/fa';

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
  btnPrimary:
    'px-5 py-3 bg-indigo-600 hover:bg-indigo-500 text-white font-bold text-xs rounded-xl shadow-lg shadow-indigo-600/10 transition-all flex items-center justify-center gap-2',
  btnSecondary: (dark: boolean) =>
    `px-5 py-3 font-bold text-xs rounded-xl transition-all border ${
      dark
        ? 'border-slate-800 text-slate-400 hover:bg-slate-800/40 hover:text-slate-200'
        : 'border-slate-200 text-slate-600 hover:bg-slate-100 hover:text-slate-900'
    }`,
  btnDelete:
    'px-5 py-3 bg-rose-600/10 text-rose-500 hover:bg-rose-600 hover:text-white font-bold text-xs rounded-xl transition-all flex items-center justify-center gap-2 border border-rose-500/20',
};

export const TaskForm: React.FC<TaskFormProps> = ({
  darkMode,
  onTaskCreated,
  initialTask,
  onDelete,
}) => {
  const isUpdateMode = !!initialTask;

  const [title, setTitle] = useState(initialTask?.title || '');
  const [description, setDescription] = useState(initialTask?.description || '');
  const [status, setStatus] = useState(initialTask?.status || 'Pending');
  const [priority, setPriority] = useState(initialTask?.priority || 'Medium');
  const [dueDate, setDueDate] = useState(initialTask?.dueDate || '');

  // Status Options Map Configuration
  const statusOptions: FormOption[] = [
    {
      value: 'Pending',
      label: 'Pending',
      icon: <FaHourglassHalf className="text-amber-500 text-xs" />,
    },
    {
      value: 'In Progress',
      label: 'In Progress',
      icon: <FaBolt className="text-blue-400 text-xs" />,
    },
    {
      value: 'Completed',
      label: 'Completed',
      icon: <FaCheckCircle className="text-emerald-400 text-xs" />,
    },
  ];

  // Priority Options Map Configuration
  const priorityOptions: FormOption[] = [
    { value: 'Low', label: 'Low', icon: <FaArrowCircleDown className="text-slate-400 text-xs" /> },
    {
      value: 'Medium',
      label: 'Medium',
      icon: <FaMinusCircle className="text-amber-500 text-xs" />,
    },
    {
      value: 'High',
      label: 'High',
      icon: <FaExclamationCircle className="text-rose-500 text-xs" />,
    },
  ];

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    console.log('Submitting Task Data:', { title, description, status, priority, dueDate });
    onTaskCreated();
  };

  return (
    <div className={styles.card(darkMode)}>
      <div className="flex items-center justify-between mb-8 pb-4 border-b border-slate-800/10">
        <div className="flex items-center gap-2.5">
          <span
            className={`h-2.5 w-2.5 rounded-full ${isUpdateMode ? 'bg-amber-500' : 'bg-emerald-500'} animate-pulse`}
          />
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

        {/* Modern 3-Column Input Row */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 items-end">
          {/* Custom Status Component Selector */}
          <FormSelect
            labelTitle="Status"
            darkMode={darkMode}
            selectedValue={status}
            options={statusOptions}
            onSelectChange={(val) => setStatus(val as any)}
          />

          {/* Custom Priority Component Selector */}
          <FormSelect
            labelTitle="Priority"
            darkMode={darkMode}
            selectedValue={priority}
            options={priorityOptions}
            onSelectChange={(val) => setPriority(val as any)}
          />

          {/* Due Date Field Container */}
          <div className="space-y-2">
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

        <div className="flex flex-col md:flex-row justify-between items-center gap-4 pt-4 border-t border-slate-800/10">
          <div>
            {isUpdateMode && onDelete && (
              <button
                type="button"
                onClick={() => onDelete(initialTask.id)}
                className={styles.btnDelete}
              >
                <FaTrashAlt className="text-xs" /> Delete Task Entry
              </button>
            )}
          </div>

          <div className="flex items-center gap-3 justify-end w-full sm:w-auto">
            <button type="button" onClick={onTaskCreated} className={styles.btnSecondary(darkMode)}>
              Cancel
            </button>
            <button type="submit" className={styles.btnPrimary}>
              {isUpdateMode ? (
                <>
                  <FaSave className="text-xs" /> Save Changes
                </>
              ) : (
                <>
                  <FaPlus className="text-xs" /> Deploy Task
                </>
              )}
            </button>
          </div>
        </div>
      </form>
    </div>
  );
};

export default TaskForm;
