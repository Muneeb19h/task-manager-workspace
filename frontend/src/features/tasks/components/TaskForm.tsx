import React, { useState } from 'react';
import type { TaskFormProps, TaskStatus } from '../types/task.types';
import { FormSelect } from '../../../components/ui/FormSelect';
import { taskFormStyles as styles } from '../styles/TaskForm.styles';
import { FaHourglassHalf, FaBolt, FaCheckCircle, FaSave, FaPlus } from 'react-icons/fa';

export const TaskForm: React.FC<TaskFormProps> = ({
  darkMode,
  editingTask,
  setEditingTask,
  onCreateTask,
  onUpdateTask,
  setActiveTab,
}) => {
  const [title, setTitle] = useState(editingTask ? editingTask.title : '');
  const [description, setDescription] = useState(editingTask ? editingTask.description : '');
  const [status, setStatus] = useState<TaskStatus>(editingTask ? editingTask.status : 'Pending');
  const [dueDate, setDueDate] = useState(editingTask ? editingTask.dueDate : '');

  const isUpdateMode = !!editingTask;

  // Status Options Map Configuration
  const statusOptions = [
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

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!title || !dueDate) return;

    // 💡 FIX: Removed the unused standalone variable tracking to satisfy the compiler rule.
    if (editingTask) {
      const isUpdated = await onUpdateTask(editingTask.id, { title, description, status, dueDate });
      if (isUpdated) {
        setEditingTask(null);
        setActiveTab('all-tasks');
      }
    } else {
      const isCreated = await onCreateTask({ title, description, status, dueDate });
      if (isCreated) {
        setEditingTask(null);
        setActiveTab('all-tasks');
      }
    }
  };

  const handleCancel = () => {
    setEditingTask(null);
    setActiveTab('all-tasks');
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
            onSelectChange={(val: string) => setStatus(val as TaskStatus)}
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
          <div />

          <div className="flex items-center gap-3 justify-end w-full sm:w-auto">
            <button type="button" onClick={handleCancel} className={styles.btnSecondary(darkMode)}>
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
