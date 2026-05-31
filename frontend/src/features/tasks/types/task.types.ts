export type TaskStatus = 'Pending' | 'In Progress' | 'Completed';
export type FilterStatus = TaskStatus | 'All';
import type { TabId } from '../../../types/navigation.types';

export interface Task {
  id: string;
  title: string;
  description: string;
  status: TaskStatus;
  priority: 'Low' | 'Medium' | 'High';
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
}

export interface TaskFormProps {
  darkMode: boolean;
  onTaskCreated: () => void;
  initialTask?: Task;
  onDelete?: (id: string) => void;
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
