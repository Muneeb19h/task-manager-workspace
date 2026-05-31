import React, { useState } from 'react';
import type { TaskFormProps, TaskStatus, FormOption } from '../../types/layout';
import { FormSelect } from '../ui/FormSelect';
import { taskFormStyles as styles } from './TaskForm.styles';
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

export const TaskForm: React.FC<TaskFormProps> = ({
  darkMode,
  onTaskCreated,
  initialTask,
  onDelete,
}) => {
  const isUpdateMode = !!initialTask;

  const [title, setTitle] = useState(initialTask?.title || '');
  const [description, setDescription] = useState(initialTask?.description || '');
  const [status, setStatus] = useState<TaskStatus>(initialTask?.status || 'Pending');
  const [priority, setPriority] = useState<'Low' | 'Medium' | 'High'>(
    initialTask?.priority || 'Medium'
  );
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
            // ⚡ Type-safe handler conversion without using raw 'as any' casting tricks
            onSelectChange={(val) => setStatus(val as TaskStatus)}
          />

          {/* Custom Priority Component Selector */}
          <FormSelect
            labelTitle="Priority"
            darkMode={darkMode}
            selectedValue={priority}
            options={priorityOptions}
            // ⚡ Type-safe handler conversion without using raw 'as any' casting tricks
            onSelectChange={(val) => setPriority(val as 'Low' | 'Medium' | 'High')}
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
