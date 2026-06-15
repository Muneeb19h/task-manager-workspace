// src/components/Dashboard/DashboardContainer.tsx
import React from 'react';
import { DashboardHeader } from './DashboardHeader';
import { StatsGrid } from './StatsGrid';
import { TaskBoardView } from './TaskBoardView';
import { TaskProgressWidget } from './TaskProgressWidget';
import type { DashboardContainerProps } from '../../types/component-props.types';

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
      {/* 1st Layer: Header expands across the absolute top */}
      <DashboardHeader
        darkMode={darkMode}
        totalTasks={taskCount.total}
        pendingTasks={taskCount.pending}
      />

      {/* Progress Telemetry Row Layer: Inserted cleanly to track actual completion rates */}
      <TaskProgressWidget darkMode={darkMode} tasks={tasks} />

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
