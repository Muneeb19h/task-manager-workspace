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

// Internal interface matching the exact incoming JSON contract from your Django Serializer
interface DjangoTaskResponse {
  id: number | string;
  title: string;
  description: string;
  status: TaskStatus;
  due_date: string;
  created_at?: string;
  updated_at?: string;
}

export const useTaskOperations = () => {
  const [tasks, setTasks] = useState<Task[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  // Helper utility to safely map backend models to frontend types
  const mapDjangoTaskToFrontend = (backendTask: DjangoTaskResponse): Task => ({
    id: String(backendTask.id),
    title: backendTask.title,
    description: backendTask.description,
    status: backendTask.status,
    dueDate: backendTask.due_date, // ⚡ Maps snake_case to camelCase properties safely
  });

  // 1. GET ALL (TaskListCreateAPIView - GET)
  const fetchTasks = async () => {
    setIsLoading(true);
    setError(null);
    try {
      const response = await taskClient.get<DjangoTaskResponse[]>('tasks/');

      // Map every single backend item so it displays properly in AllTasksView
      const mappedTasks = response.data.map(mapDjangoTaskToFrontend);
      setTasks(mappedTasks);
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
        due_date: payload.dueDate, // Convert camelCase back to Django model field name
      };

      const response = await taskClient.post<DjangoTaskResponse>('tasks/', djangoPayload);
      const newMappedTask = mapDjangoTaskToFrontend(response.data);

      setTasks((prev) => [...prev, newMappedTask]);
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

      // Safeguard property conversions conditionally
      if (payload.title !== undefined) djangoPayload.title = payload.title;
      if (payload.description !== undefined) djangoPayload.description = payload.description;
      if (payload.status !== undefined) djangoPayload.status = payload.status;
      if (payload.dueDate !== undefined) djangoPayload.due_date = payload.dueDate;

      const response = await taskClient.patch<DjangoTaskResponse>(`tasks/${id}/`, djangoPayload);
      const updatedMappedTask = mapDjangoTaskToFrontend(response.data);

      setTasks((prev) => prev.map((task) => (task.id === id ? updatedMappedTask : task)));
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
