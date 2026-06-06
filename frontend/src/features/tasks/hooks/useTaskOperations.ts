import { useState, useCallback } from 'react';
import { taskClient } from '../api/taskClient';
import type { Task, TaskStatus } from '../types/task.types';
import axios from 'axios';
import { useAuth } from '../../auth/context/AuthContext';

interface CreateTaskPayload {
  title: string;
  description?: string;
  status: TaskStatus;
  dueDate: string;
}

const getApiErrorMessage = (error: unknown, defaultMessage: string) => {
  if (!axios.isAxiosError(error)) return defaultMessage;
  const data = error.response?.data;
  if (!data) return defaultMessage;
  if (typeof data === 'string') return data;
  if ('detail' in data && typeof data.detail === 'string') return data.detail;

  const errors: string[] = [];

  if (Array.isArray(data) && data.length) {
    return data.map((item) => String(item)).join(' ');
  }

  const parseValue = (value: unknown, key: string) => {
    if (Array.isArray(value) && value.length) {
      errors.push(`${key}: ${String(value[0])}`);
    } else if (typeof value === 'string') {
      errors.push(`${key}: ${value}`);
    } else if (typeof value === 'object' && value !== null) {
      errors.push(`${key}: ${JSON.stringify(value)}`);
    }
  };

  Object.entries(data as Record<string, unknown>).forEach(([key, value]) => {
    parseValue(value, key.replace(/_/g, ' '));
  });

  if (errors.length > 0) return errors.join(' ');

  return defaultMessage;
};

export const useTaskOperations = () => {
  const { logout } = useAuth();
  const [tasks, setTasks] = useState<Task[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  // 1. GET ALL (TaskListCreateAPIView - GET)
  // Memoized using useCallback with an empty dependency array
  const fetchTasks = useCallback(async () => {
    setIsLoading(true);
    setError(null);
    try {
      const response = await taskClient.get<Task[]>('tasks/');
      setTasks(response.data);
    } catch (err: unknown) {
      const message = getApiErrorMessage(err, 'Failed to sync with task ledger records.');
      setError(message);
      if (axios.isAxiosError(err) && err.response?.status === 401) {
        logout();
      }
      console.error(err);
    } finally {
      setIsLoading(false);
    }
  }, [logout]); // Reference stays completely stable across app cycles

  // 2. CREATE NEW (TaskListCreateAPIView - POST)
  const createTask = useCallback(
    async (payload: CreateTaskPayload) => {
      setIsLoading(true);
      setError(null);
      try {
        const djangoPayload = {
          title: payload.title,
          description: payload.description || '',
          status: payload.status,
          due_date: payload.dueDate,
        };

        const response = await taskClient.post<Task>('tasks/', djangoPayload);
        setTasks((prev) => [...prev, response.data]);
        return { success: true };
      } catch (err: unknown) {
        console.error('Task create error', err);
        const message = getApiErrorMessage(err, 'Failed to save new task ledger entry.');
        setError(message);
        if (axios.isAxiosError(err) && err.response?.status === 401) {
          logout();
        }
        return { success: false, error: message };
      } finally {
        setIsLoading(false);
      }
    },
    [logout]
  );

  // 3. UPDATE TASK (TaskRetrieveUpdateDestroyAPIView - PATCH)
  const updateTask = useCallback(
    async (id: string, payload: Partial<Task>) => {
      setIsLoading(true);
      setError(null);
      try {
        const djangoPayload: Record<string, unknown> = {};
        if (payload.title !== undefined) djangoPayload.title = payload.title;
        if (payload.status !== undefined) djangoPayload.status = payload.status;
        if (payload.dueDate !== undefined) djangoPayload.due_date = payload.dueDate;

        if (payload.description !== undefined && payload.description.trim() !== '') {
          djangoPayload.description = payload.description;
        } else if (payload.description === '') {
          djangoPayload.description = null;
        }

        const response = await taskClient.patch<Task>(`tasks/${id}/`, djangoPayload);
        setTasks((prev) => prev.map((task) => (task.id === id ? response.data : task)));
        return { success: true };
      } catch (err: unknown) {
        console.error('Task update error', err);
        const message = getApiErrorMessage(err, 'Failed to push task state modification updates.');
        setError(message);
        if (axios.isAxiosError(err) && err.response?.status === 401) {
          logout();
        }
        return { success: false, error: message };
      } finally {
        setIsLoading(false);
      }
    },
    [logout]
  );

  // 4. DESTROY TASK (TaskRetrieveUpdateDestroyAPIView - DELETE)
  const deleteTask = useCallback(
    async (id: string) => {
      setIsLoading(true);
      setError(null);
      try {
        await taskClient.delete(`tasks/${id}/`);
        setTasks((prev) => prev.filter((task) => task.id !== id));
        return true;
      } catch (err: unknown) {
        const message = getApiErrorMessage(err, 'Failed to drop selected task reference record.');
        setError(message);
        if (axios.isAxiosError(err) && err.response?.status === 401) {
          logout();
        }
        return false;
      } finally {
        setIsLoading(false);
      }
    },
    [logout]
  );

  return { tasks, isLoading, error, fetchTasks, createTask, updateTask, deleteTask };
};
