
export type TabId = 'dashboard' | 'add-task' | 'all-tasks';
export type TaskStatus='Pending'|'In Progress'|'Completed';
export type FilterStatus=TaskStatus|'All'

export interface ThemeConfig {
  darkMode: boolean;
  setDarkMode: (value: boolean) => void;
}

export interface NavigationConfig {
  activeTab: TabId;
  setActiveTab: (tab: TabId) => void;
  // Track which status filter is actively applied to the main workspace list
  statusFilter: FilterStatus | 'All';
  setStatusFilter: (status: FilterStatus) => void;
}


export interface Task {
  id: string;
  title: string;
  description: string;
  status: 'Pending' | 'In Progress' | 'Completed';
  priority: 'Low' | 'Medium' | 'High';
  dueDate:string;

}

export interface TaskFormProps {
  darkMode: boolean;
  onTaskCreated: () => void;
  initialTask?: Task; // If provided, form automatically switches to "Update" mode
  onDelete?: (id: string) => void;
}

// Combines both layouts cleanly for component prop handling
export interface SidebarProps extends NavigationConfig, ThemeConfig {}