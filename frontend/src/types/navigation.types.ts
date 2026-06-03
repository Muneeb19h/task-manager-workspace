export type TabId = 'dashboard' | 'add-task' | 'all-tasks' | 'profile';

export interface NavigationConfig {
  activeTab: TabId;
  setActiveTab: (tab: TabId) => void;
}
