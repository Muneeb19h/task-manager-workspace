export type TabId = 'dashboard' | 'add-task' | 'all-tasks';
export type TaskStatus = 'Pending' | 'In Progress' | 'Completed';
export type FilterStatus = TaskStatus | 'All';

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
//=================================//
//Globarl Configrations
export interface ThemeConfig {
  darkMode: boolean;
  setDarkMode: (value: boolean) => void;
}

export interface NavigationConfig {
  activeTab: TabId;
  setActiveTab: (tab: TabId) => void;
  statusFilter: FilterStatus;
  setStatusFilter: (status: FilterStatus) => void;
}
//+================================//
//Components Prop interfaces
export interface SidebarProps extends NavigationConfig, ThemeConfig {}

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
  initialTask?: Task; // If provided, form automatically switches to "Update" mode
  onDelete?: (id: string) => void;
}

export interface StatsGridProps {
  darkMode: boolean;
  setActiveTab: (tab: TabId) => void;
  setStatusFilter: (status: FilterStatus) => void;
  tasksCount: TasksCount;
}

//+++=========================================??//
//Cusom UI Components Inerfaces//
export interface CustomStatusSelectProps {
  darkMode: boolean;
  statusFilter: FilterStatus;
  setStatusFilter: (status: FilterStatus) => void;
}

export interface FormOption {
  value: string;
  label: string;
  icon: React.ReactNode;
}

export interface FormSelectProps {
  labelTitle: string;
  darkMode: boolean;
  selectedValue: string;
  options: FormOption[];
  onSelectChange: (value: string) => void;
}
