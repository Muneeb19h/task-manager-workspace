import React from 'react';
import { DashboardHeader } from './DashboardHeader';
import { StatsGrid } from './StatsGrid';
import { TaskBoardView } from './TaskBoardView';
import type { Task, FilterStatus } from '../../types/task.types';

interface DashboardContainerProps {
  darkMode: boolean;
  tasks: Task[];
  setActiveTab: (tab: 'dashboard' | 'all-tasks' | 'add-task') => void;
  setStatusFilter: (filter: FilterStatus) => void;
  onEditSelect: (task: Task) => void;
  taskCount: {
    total: number;
    pending: number;
    inProgress: number;
    completed: number;
  };
}

export const DashboardContainer: React.FC<DashboardContainerProps> = ({
  darkMode,
  tasks,
  setActiveTab,
  setStatusFilter,
  onEditSelect,
  taskCount,
}) => {
  return (
    <div className="w-full space-y-8 animate-fadeIn">
      {/* s1st Layer: Header expands across the absolute top */}
      <DashboardHeader
        darkMode={darkMode}
        totalTasks={taskCount.total}
        pendingTasks={taskCount.pending}
      />

      {/* 2nd Layer: Numeric analytics counters */}
      <StatsGrid
        darkMode={darkMode}
        setActiveTab={setActiveTab}
        setStatusFilter={setStatusFilter}
        tasksCount={taskCount}
      />

      {/* 3rd Layer: Grid tracking board columns */}
      <TaskBoardView darkMode={darkMode} tasks={tasks} onEditSelect={onEditSelect} />
    </div>
  );
};

export default DashboardContainer;
