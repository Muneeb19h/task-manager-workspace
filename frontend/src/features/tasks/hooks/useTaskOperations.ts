import { useState } from 'react';
import { taskClient } from '../api/taskClient';
import type { Task, TaskStatus } from '../types/task.types';
import axios from 'axios';

interface CreateTaskPayload {
  title: string;
  description?: string;
  status: TaskStatus;
  dueDate: string;
}

export const useTaskOperations = () => {
  const [tasks, setTasks] = useState<Task[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  // 1. GET ALL (TaskListCreateAPIView - GET)
  const fetchTasks = async () => {
    setIsLoading(true);
    setError(null);
    try {
      //interceptor automatically returns a fully mapped Task[] array here!
      const response = await taskClient.get<Task[]>('tasks/');
      setTasks(response.data);
    } catch (err: unknown) {
      if (axios.isAxiosError(err)) {
        setError(err.response?.data?.detail || 'Failed to sync with task ledger records.');
      } else {
        setError('An unexpected database exception occurred.');
      }
      console.error(err);
    } finally {
      setIsLoading(false);
    }
  };

  // 2. CREATE NEW (TaskListCreateAPIView - POST)
  const createTask = async (payload: CreateTaskPayload) => {
    setIsLoading(true);
    setError(null);
    try {
      const djangoPayload = {
        title: payload.title,
        description: payload.description || '',
        status: payload.status,
        due_date: payload.dueDate, // Converting frontend camelCase form data to backend snake_case
      };

      //Interceptor returns a single cleanly mapped Task object
      const response = await taskClient.post<Task>('tasks/', djangoPayload);
      setTasks((prev) => [...prev, response.data]);
      return true;
    } catch (err: unknown) {
      if (axios.isAxiosError(err)) {
        setError(err.response?.data?.detail || 'Failed to save new task ledger entry.');
      }
      return false;
    } finally {
      setIsLoading(false);
    }
  };

  // 3. UPDATE TASK (TaskRetrieveUpdateDestroyAPIView - PATCH)
  const updateTask = async (id: string, payload: Partial<Task>) => {
    setIsLoading(true);
    setError(null);
    try {
      const djangoPayload: Record<string, unknown> = {};

      if (payload.title !== undefined) djangoPayload.title = payload.title;
      if (payload.description !== undefined) djangoPayload.description = payload.description;
      if (payload.status !== undefined) djangoPayload.status = payload.status;
      if (payload.dueDate !== undefined) djangoPayload.due_date = payload.dueDate;
      if (payload.description !== undefined && payload.description.trim() !== '') {
        djangoPayload.description = payload.description;
      } else if (payload.description === '') {
        // If they explicitly cleared it, pass null or omit based on model configurations
        djangoPayload.description = null;
      }
      // Interceptor returns a single cleanly mapped Task object
      const response = await taskClient.patch<Task>(`tasks/${id}/`, djangoPayload);
      setTasks((prev) => prev.map((task) => (task.id === id ? response.data : task)));
      return true;
    } catch (err: unknown) {
      if (axios.isAxiosError(err)) {
        setError(err.response?.data?.detail || 'Failed to push task state modification updates.');
      }
      return false;
    } finally {
      setIsLoading(false);
    }
  };

  // 4. DESTROY TASK (TaskRetrieveUpdateDestroyAPIView - DELETE)
  const deleteTask = async (id: string) => {
    setIsLoading(true);
    setError(null);
    try {
      await taskClient.delete(`tasks/${id}/`);
      setTasks((prev) => prev.filter((task) => task.id !== id));
      return true;
    } catch (err: unknown) {
      if (axios.isAxiosError(err)) {
        setError(err.response?.data?.detail || 'Failed to drop selected task reference record.');
      }
      return false;
    } finally {
      setIsLoading(false);
    }
  };

  return { tasks, isLoading, error, fetchTasks, createTask, updateTask, deleteTask };
};
