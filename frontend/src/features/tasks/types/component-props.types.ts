import type { Task, FilterStatus, TasksCount, TaskStatus } from './task.types';
import type { TabId } from '../../../types/navigation.types';

export interface NotificationItem {
  id: number;
  message: string;
  is_read: boolean;
  created_at: string;
}

export interface SystemUser {
  id: number;
  username: string;
  name?: string;
}

export interface ExtendedTaskPayload {
  shared_with?: Array<{ id: number; username: string } | number>;
  task?: Task;
}

export interface CreateTaskPayload {
  title: string;
  description?: string;
  status: TaskStatus;
  dueDate: string;
}

export interface ShareTaskModalProps {
  isOpen: boolean;
  onClose: () => void;
  task: Task;
  onShareSuccess?: (updatedTask: Task) => void;
}

export interface NotificationBellProps {
  darkMode: boolean;
}

export interface DashboardContainerProps {
  darkMode: boolean;
  tasks: Task[];
  setActiveTab: (tab: TabId) => void;
  setStatusFilter: (filter: FilterStatus) => void;
  onEditSelect: (task: Task) => void;
  taskCount: TasksCount;
}

export interface DashboardHeaderProps {
  darkMode: boolean;
  totalTasks: number;
  pendingTasks: number;
}

export interface TaskBoardViewProps {
  darkMode: boolean;
  tasks: Task[];
  onEditSelect?: (task: Task) => void;
}

export interface TaskProgressWidgetProps {
  darkMode: boolean;
  tasks: Task[];
}
