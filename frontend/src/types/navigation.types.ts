export type TabId = 'dashboard' | 'add-task' | 'all-tasks';

export interface NavigationConfig {
  activeTab: TabId;
  setActiveTab: (tab: TabId) => void;
}
