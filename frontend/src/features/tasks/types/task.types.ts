export type TaskStatus = 'Pending' | 'In Progress' | 'Completed';
export type FilterStatus = TaskStatus | 'All';
import type { TabId } from '../../../types/navigation.types';

export interface Task {
  id: string;
  title: string;
  description: string;
  status: TaskStatus;
  dueDate: string;
}

export interface TasksCount {
  total: number;
  pending: number;
  inProgress: number;
  completed: number;
}

export interface TaskListProps {
  darkMode: boolean;
}

export interface AllTasksProps {
  darkMode: boolean;
  tasks: Task[];
  statusFilter: FilterStatus;
  setStatusFilter: (status: FilterStatus) => void;
  onEditSelect: (task: Task) => void;
  onDeleteTask: (id: string) => Promise<boolean>;
  onUpdateStatus: (id: string, payload: Partial<Task>) => Promise<boolean>;
}

export interface TaskFormProps {
  darkMode: boolean;
  editingTask: Task | null;
  setEditingTask: (task: Task | null) => void;
  onCreateTask: (payload: {
    title: string;
    description?: string;
    status: TaskStatus;
    dueDate: string;
  }) => Promise<{ success: boolean; error?: string }>;
  onUpdateTask: (
    id: string,
    payload: Partial<Task>
  ) => Promise<{ success: boolean; error?: string }>;
  setActiveTab: (tab: 'dashboard' | 'all-tasks' | 'add-task') => void;
}

export interface StatsGridProps {
  darkMode: boolean;
  setActiveTab: (tab: TabId) => void;
  setStatusFilter: (status: FilterStatus) => void;
  tasksCount: TasksCount;
}

export interface CustomStatusSelectProps {
  darkMode: boolean;
  statusFilter: FilterStatus;
  setStatusFilter: (status: FilterStatus) => void;
}
