import { type NavigationConfig } from '../../../types/navigation.types';
import { type ThemeConfig } from '../../../types/theme.types';
import { type FilterStatus } from '../../../features/tasks/types/task.types';

export interface SidebarProps extends NavigationConfig, ThemeConfig {
  statusFilter: FilterStatus;
  setStatusFilter: (status: FilterStatus) => void;
}
