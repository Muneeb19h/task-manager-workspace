/* eslint-disable @typescript-eslint/no-unused-vars */
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

  // ⚡ Local states to handle submission flow changes dynamically
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [localError, setLocalError] = useState<string | null>(null);

  const isUpdateMode = !!editingTask;

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

  // Clear local validation alerts whenever input data changes
  const handleInputChange = (
    setter: React.Dispatch<React.SetStateAction<string>>,
    value: string
  ) => {
    setter(value);
    if (localError) setLocalError(null);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!title || !dueDate) return;

    setIsSubmitting(true);
    setLocalError(null);

    try {
      if (editingTask) {
        const result = await onUpdateTask(editingTask.id, {
          title,
          description,
          status,
          dueDate,
        });
        if (result.success) {
          setEditingTask(null);
          setActiveTab('all-tasks');
        } else {
          setLocalError(
            result.error || 'Failed to modify task properties. Please verify parameters or date rules.'
          );
        }
      } else {
        const result = await onCreateTask({ title, description, status, dueDate });
        if (result.success) {
          setEditingTask(null);
          setActiveTab('all-tasks');
        } else {
          setLocalError(
            result.error ||
              'Could not process task deployment entry. Verify authentication or form criteria.'
          );
        }
      }
    } catch (err) {
      setLocalError('An error occurred while saving the task registry configuration.');
    } finally {
      setIsSubmitting(false);
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
        {/* ⚡ Error Message Container display */}
        {localError && (
          <div className="p-4 mb-4 text-sm text-red-800 rounded-xl bg-red-50 border border-red-200/60 dark:bg-red-950/40 dark:text-red-400 dark:border-red-900/50">
            <span className="font-semibold">Validation Rejected:</span> {localError}
          </div>
        )}

        <div>
          <label className={styles.label(darkMode)}>Task Title</label>
          <input
            type="text"
            required
            disabled={isSubmitting}
            value={title}
            onChange={(e) => handleInputChange(setTitle, e.target.value)}
            className={styles.input(darkMode)}
          />
        </div>

        <div>
          <label className={styles.label(darkMode)}>Detailed Description</label>
          <textarea
            rows={3}
            disabled={isSubmitting}
            value={description}
            onChange={(e) => handleInputChange(setDescription, e.target.value)}
            className={styles.input(darkMode)}
          />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 items-end">
          <FormSelect
            labelTitle="Status"
            darkMode={darkMode}
            selectedValue={status}
            options={statusOptions}
            onSelectChange={(val: string) => setStatus(val as TaskStatus)}
          />

          <div className="space-y-2">
            <label className={styles.label(darkMode)}>Due Date</label>
            <input
              type="date"
              required
              disabled={isSubmitting}
              value={dueDate}
              onChange={(e) => handleInputChange(setDueDate, e.target.value)}
              className={styles.input(darkMode)}
            />
          </div>
        </div>

        <div className="flex flex-col md:flex-row justify-between items-center gap-4 pt-4 border-t border-slate-800/10">
          <div />

          <div className="flex items-center gap-3 justify-end w-full sm:w-auto">
            <button
              type="button"
              onClick={handleCancel}
              disabled={isSubmitting}
              className={styles.btnSecondary(darkMode)}
            >
              Cancel
            </button>
            <button type="submit" disabled={isSubmitting} className={styles.btnPrimary}>
              {isSubmitting ? (
                <span>Syncing System...</span>
              ) : isUpdateMode ? (
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
