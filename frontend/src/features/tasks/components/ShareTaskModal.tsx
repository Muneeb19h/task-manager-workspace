import React, { useState, useEffect, useRef } from 'react';
import { FaUserPlus, FaTimes, FaSpinner } from 'react-icons/fa';
import type { Task } from '../types/task.types';
import type {
  ShareTaskModalProps,
  SystemUser,
  ExtendedTaskPayload,
} from '../types/component-props.types';
// Import your verified api client
import { taskClient } from '../api/taskClient';

export const ShareTaskModal: React.FC<ShareTaskModalProps> = ({
  isOpen,
  onClose,
  task,
  onShareSuccess,
}) => {
  const [users, setUsers] = useState<SystemUser[]>([]);
  const [selectedUserIds, setSelectedUserIds] = useState<number[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const [successMsg, setSuccessMsg] = useState<string | null>(null);
  const currentTimeoutRef = useRef<number | null>(null);

  useEffect(() => {
    const loadUsers = async () => {
      if (!isOpen) return;
      setIsLoading(true);
      setError(null);
      setSuccessMsg(null);

      try {
        // Query users through axios instance
        const response = await taskClient.get('users/');

        // Log the raw server payload directly to your console to view field naming keys
        console.log('--- API Users Endpoint Payload Matrix ---', response.data);

        let userArray: SystemUser[] = [];

        // Defensively parse plain arrays vs. Django REST Framework paginated or enveloped results
        if (Array.isArray(response.data)) {
          userArray = response.data;
        } else if (response.data && typeof response.data === 'object') {
          const dataObj = response.data as Record<string, unknown>;
          if (Array.isArray(dataObj.results)) {
            userArray = dataObj.results as SystemUser[];
          } else if (Array.isArray(dataObj.users)) {
            userArray = dataObj.users as SystemUser[];
          }
        }

        setUsers(userArray);

        const extendedTask = task as unknown as ExtendedTaskPayload;
        if (extendedTask.shared_with) {
          const preSelected = extendedTask.shared_with.map((u) =>
            typeof u === 'object' && u !== null ? u.id : u
          );
          setSelectedUserIds(preSelected);
        }
      } catch (err: unknown) {
        console.error('User list assignment exception:', err);
        setError('Could not access system user directory.');
      } finally {
        setIsLoading(false);
      }
    };

    loadUsers();

    return () => {
      if (currentTimeoutRef.current) {
        window.clearTimeout(currentTimeoutRef.current);
      }
    };
  }, [isOpen, task]);
  const handleCheckboxChange = (userId: number) => {
    setSelectedUserIds((prev) =>
      prev.includes(userId) ? prev.filter((id) => id !== userId) : [...prev, userId]
    );
  };

  const handleShareSubmit = async () => {
    setIsLoading(true);
    setError(null);
    setSuccessMsg(null);

    try {
      // Put updates through axios instance
      const response = await taskClient.put<ExtendedTaskPayload>(`tasks/${task.id}/share/`, {
        user_ids: selectedUserIds,
      });

      setSuccessMsg('Task collaboration matrix updated successfully!');

      if (onShareSuccess && response.data.task) {
        onShareSuccess(response.data.task);
      }

      currentTimeoutRef.current = window.setTimeout(() => {
        onClose();
      }, 1200);
    } catch (err: unknown) {
      console.error(err);
      setError('Share action failure.');
    } finally {
      setIsLoading(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm">
      <div className="w-full max-w-md overflow-hidden rounded-2xl bg-slate-900 border border-slate-800 text-slate-100 shadow-2xl p-6 relative">
        <button
          onClick={onClose}
          className="absolute top-4 right-4 text-slate-400 hover:text-white transition-colors"
          disabled={isLoading}
        >
          <FaTimes className="w-4 h-4" />
        </button>

        <div className="flex items-center space-x-3 mb-4">
          <div className="p-2.5 bg-indigo-600/20 text-indigo-400 rounded-xl">
            <FaUserPlus className="w-5 h-5" />
          </div>
          <div>
            <h3 className="text-lg font-bold">Share Workspace Task</h3>
            <p className="text-xs text-slate-400">Select teammates to collaborate on this item.</p>
          </div>
        </div>

        {error && (
          <div className="p-3 mb-4 bg-rose-500/10 border border-rose-500/20 text-rose-400 text-xs font-semibold rounded-xl">
            {error}
          </div>
        )}
        {successMsg && (
          <div className="p-3 mb-4 bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 text-xs font-semibold rounded-xl">
            {successMsg}
          </div>
        )}

        <div className="max-h-48 overflow-y-auto my-4 border border-slate-800 rounded-xl divide-y divide-slate-800/60 p-2 bg-slate-950/40">
          {isLoading && users.length === 0 ? (
            <div className="flex items-center justify-center py-8 text-xs text-slate-400 space-x-2">
              <FaSpinner className="animate-spin text-indigo-400" />
              <span>Querying network nodes...</span>
            </div>
          ) : users.length === 0 ? (
            <div className="text-center py-8 text-xs text-slate-500">
              No other system users found.
            </div>
          ) : (
            users.map((u) => {
              // 🌟 Defend against empty strings by scanning fallback properties dynamically
              // Supports u.username, u.name, or absolute fallbacks
              const displayName = u.username || u.name || `User ID: ${u.id}`;

              return (
                <label
                  key={u.id}
                  className="flex items-center space-x-3 p-2.5 rounded-lg hover:bg-slate-800/40 cursor-pointer transition-colors"
                >
                  <input
                    type="checkbox"
                    disabled={isLoading || !!successMsg}
                    checked={selectedUserIds.includes(u.id)}
                    onChange={() => handleCheckboxChange(u.id)}
                    className="rounded border-slate-700 bg-slate-800 text-indigo-600 focus:ring-indigo-500 focus:ring-offset-slate-900 w-4 h-4"
                  />
                  <span className="text-sm font-medium text-slate-300">@{displayName}</span>
                </label>
              );
            })
          )}
        </div>

        <div className="flex items-center justify-end space-x-3 mt-6 border-t border-slate-800/60 pt-4">
          <button
            onClick={onClose}
            disabled={isLoading}
            className="px-4 py-2 bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs font-bold rounded-xl transition-colors"
          >
            Cancel
          </button>
          <button
            onClick={handleShareSubmit}
            disabled={isLoading || !!successMsg}
            className="px-5 py-2 bg-indigo-600 hover:bg-indigo-500 disabled:opacity-50 text-xs font-bold text-white rounded-xl shadow-lg shadow-indigo-600/10 transition-all flex items-center space-x-2"
          >
            {isLoading && <FaSpinner className="animate-spin" />}
            <span>{isLoading ? 'Saving...' : 'Save Changes'}</span>
          </button>
        </div>
      </div>
    </div>
  );
};
