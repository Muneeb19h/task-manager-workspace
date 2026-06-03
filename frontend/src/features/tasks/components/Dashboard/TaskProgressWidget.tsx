// src/components/Dashboard/TaskProgressWidget.tsx
import React from 'react';
import type { Task } from '../../types/task.types'; // Adjust this import path relative to your types file location
import { styles } from '../../styles/TaskProgressWidget.styles';

interface TaskProgressWidgetProps {
  darkMode: boolean;
  tasks: Task[];
}

export const TaskProgressWidget: React.FC<TaskProgressWidgetProps> = ({ darkMode, tasks }) => {
  const totalTasks = tasks.length;

  const completedTasks = tasks.filter((t) => t.status === 'Completed').length;
  const inProgressTasks = tasks.filter((t) => t.status === 'In Progress').length;
  const pendingTasks = tasks.filter((t) => t.status === 'Pending').length;

  const completionPercentage = totalTasks > 0 ? Math.round((completedTasks / totalTasks) * 100) : 0;

  return (
    <div className={styles.container(darkMode)}>
      <div className={styles.headerWrapper}>
        <div className={styles.titleWrapper}>
          <h3 className={styles.title}>System Completion Metrics</h3>
          <p className={styles.subtitle}>Operational throughput summary node</p>
        </div>
        <span className={styles.percentageText}>{completionPercentage}%</span>
      </div>

      <div className={styles.track(darkMode)}>
        <div className={styles.fill} style={{ width: `${completionPercentage}%` }} />
      </div>

      <div className={styles.metricsGrid}>
        <div className={styles.metricBlock}>
          <span className={styles.metricLabel}>Pending</span>
          <span className={styles.metricValue('text-amber-500')}>{pendingTasks}</span>
        </div>
        <div className={styles.metricBlock}>
          <span className={styles.metricLabel}>In Flight</span>
          <span className={styles.metricValue('text-sky-400')}>{inProgressTasks}</span>
        </div>
        <div className={styles.metricBlock}>
          <span className={styles.metricLabel}>Resolved</span>
          <span className={styles.metricValue('text-emerald-500')}>
            {completedTasks} of {totalTasks}
          </span>
        </div>
      </div>
    </div>
  );
};

export default TaskProgressWidget;
