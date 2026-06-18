import React, { useState } from 'react';
import {
  FaTrash,
  FaSyncAlt,
  FaEdit,
  FaSearchMinus,
  FaTimes,
  FaSearch,
  FaUserPlus,
  FaTasks,
  FaChartBar,
} from 'react-icons/fa';
import type { AllTasksProps, Task } from '../types/task.types';
import { CustomStatusSelect } from './CustomStatusSelect';
import { ShareTaskModal } from './ShareTaskModal';
import { TaskAnalytics } from './TaskAnalytics'; // 🌟 Import your clean analytics component
import { styles } from '../styles/AllTaskView.styles';

export const AllTasksView: React.FC<AllTasksProps> = ({
  darkMode,
  tasks,
  statusFilter,
  setStatusFilter,
  onEditSelect,
  onDeleteTask,
  onUpdateStatus,
}) => {
  // Navigation layout toggle tab state: 'list' for tracking registries, 'analytics' for Recharts charts
  const [activeTab, setActiveTab] = useState<'list' | 'analytics'>('list');
  const [selectedTask, setSelectedTask] = useState<Task | null>(null);
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [sharingTask, setSharingTask] = useState<Task | null>(null);

  const filteredTasks = tasks.filter((task) => {
    const matchesStatus = statusFilter === 'All' || task.status === statusFilter;
    const normalizedQuery = searchQuery.toLowerCase().trim();
    const matchesSearch =
      task.title.toLowerCase().includes(normalizedQuery) ||
      (task.description && task.description.toLowerCase().includes(normalizedQuery));

    return matchesStatus && matchesSearch;
  });

  const activeTaskDetails = tasks.find((t) => t.id === selectedTask?.id) || selectedTask;

  const handleStatusCycle = async (task: Task) => {
    let nextStatus: 'Pending' | 'In Progress' | 'Completed' = 'Pending';
    if (task.status === 'Pending') nextStatus = 'In Progress';
    if (task.status === 'In Progress') nextStatus = 'Completed';

    const success = await onUpdateStatus(task.id, { status: nextStatus });
    if (success) {
      setSelectedTask({ ...task, status: nextStatus });
    }
  };

  const handleDeleteTrigger = async (id: string) => {
    const success = await onDeleteTask(id);
    if (success) {
      setSelectedTask(null);
    }
  };

  const handleShareSuccess = (updatedTask: Task): void => {
    if (selectedTask?.id === updatedTask.id) {
      setSelectedTask(updatedTask);
    }
  };

  return (
    <div className={styles.container}>
      {/* Top Navigation Subsystem Bar */}
      <div className={styles.navContainer(darkMode)}>
        <button
          onClick={() => setActiveTab('list')}
          className={styles.navButton(activeTab === 'list', darkMode)}
        >
          <FaTasks className="w-3.5 h-3.5" />
          <span>Active Workspaces</span>
        </button>

        <button
          onClick={() => setActiveTab('analytics')}
          className={styles.navButton(activeTab === 'analytics', darkMode)}
        >
          <FaChartBar className="w-3.5 h-3.5" />
          <span>Metrics & Analytics</span>
        </button>
      </div>

      {/* Conditional View Switch Layer */}
      {activeTab === 'analytics' ? (
        /* Analytics Panel Tab Viewport */
        <div className="animate-fadeIn">
          <TaskAnalytics darkMode={darkMode} />
        </div>
      ) : (
        /* Standard Task Management Grid List (Original Content) */
        <div className="space-y-6">
          {/* Dynamic Selector Header */}
          <div className={styles.headerCard(darkMode)}>
            <div className={styles.headerTextWrapper}>
              <h2 className={styles.headerTitle}>System Records Ledger</h2>
              <p className={styles.headerSubtitle}>
                Reviewing all data matching active scope filter indices.
              </p>
            </div>

            {/* Search Bar Input */}
            <div className={styles.searchContainer}>
              <div className={styles.searchIconContainer}>
                <FaSearch className={styles.searchIcon(darkMode)} />
              </div>
              <input
                type="text"
                placeholder="Search task title or description..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className={styles.searchInput(darkMode)}
              />
              {searchQuery && (
                <button
                  onClick={() => setSearchQuery('')}
                  className={styles.searchClearBtn}
                  title="Clear Search"
                >
                  <FaTimes className={styles.searchClearIcon} />
                </button>
              )}
            </div>

            <CustomStatusSelect
              darkMode={darkMode}
              statusFilter={statusFilter}
              setStatusFilter={setStatusFilter}
            />
          </div>

          {/* Main Layout Split-Screen */}
          <div className={styles.mainGrid}>
            {/* Left Side Table: Task List */}
            <div className={styles.tableContainer(darkMode)}>
              <div className={styles.tableWrapper}>
                <table className={styles.tableElement}>
                  <thead className={styles.tableHeader(darkMode)}>
                    <tr>
                      <th className={styles.tableHeaderCell}>Task Details</th>
                      <th className={styles.tableHeaderCell}>Due Date</th>
                      <th className={styles.tableHeaderCell} style={{ textAlign: 'right' }}>
                        Actions
                      </th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-800/10">
                    {filteredTasks.length > 0 ? (
                      filteredTasks.map((task) => {
                        const isActive = activeTaskDetails?.id === task.id;
                        return (
                          <tr
                            key={task.id}
                            onClick={() => setSelectedTask(task)}
                            className={styles.tableRow(isActive, darkMode)}
                          >
                            <td className={styles.tableBodyCell}>
                              <div className={styles.taskTitle}>{task.title}</div>
                              <div className={styles.taskMetaStatus}>{task.status}</div>
                            </td>
                            <td className={styles.taskDueDate}>{task.dueDate}</td>
                            <td className={styles.actionsCell} onClick={(e) => e.stopPropagation()}>
                              <button onClick={() => onEditSelect(task)} className={styles.editBtn}>
                                <FaEdit className="text-xs" /> Edit
                              </button>
                            </td>
                          </tr>
                        );
                      })
                    ) : (
                      <tr>
                        <td colSpan={3} className={styles.tableEmptyRow}>
                          No system task records found matching current query boundaries.
                        </td>
                      </tr>
                    )}
                  </tbody>
                </table>
              </div>
            </div>

            {/* Right Side Column: Task Details Panel */}
            <div className={styles.detailsPanel(!!selectedTask, darkMode)}>
              {selectedTask && activeTaskDetails ? (
                <div className="space-y-4 flex flex-col h-full justify-between">
                  <div className="space-y-4">
                    <div className={styles.detailsHeader}>
                      <div>
                        <span className={styles.detailsSubHeading}>Selected Identity Node</span>
                        <h3 className={styles.detailsTitle}>{activeTaskDetails.title}</h3>
                      </div>
                      <button
                        onClick={() => setSelectedTask(null)}
                        className={styles.detailsCloseBtn}
                        title="Close Details"
                      >
                        <FaTimes className="text-xs" />
                      </button>
                    </div>

                    <div>
                      <h4 className={styles.sectionLabel(darkMode)}>Functional Blueprint Scope</h4>
                      <p className={styles.descriptionBox(darkMode)}>
                        {activeTaskDetails.description ||
                          'No metadata description constraints attached to this system entry.'}
                      </p>
                    </div>

                    <div className={styles.metadataGrid}>
                      <div>
                        <span className={styles.metaLabel}>Status State</span>
                        <button
                          onClick={() => handleStatusCycle(activeTaskDetails)}
                          className={styles.statusCycleLink}
                        >
                          {activeTaskDetails.status}{' '}
                          <FaSyncAlt className="text-[10px] anarchist-spin-hover" />
                        </button>
                      </div>
                      <div>
                        <span className={styles.metaLabel}>Deadline target</span>
                        <span className={styles.dueDateText}>{activeTaskDetails.dueDate}</span>
                      </div>
                    </div>
                  </div>

                  {/* Action Utilities Footer Container */}
                  <div className="flex items-center space-x-3 pt-4 border-t border-slate-800/10 dark:border-slate-800/40">
                    <button
                      onClick={() => setSharingTask(activeTaskDetails)}
                      className="px-4 py-2.5 bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-bold rounded-xl transition-all duration-150 flex items-center space-x-2 border border-slate-700/60 shadow-sm"
                    >
                      <FaUserPlus className="text-xs text-indigo-400" />
                      <span>Share Node</span>
                    </button>

                    <button
                      onClick={() => handleDeleteTrigger(activeTaskDetails.id)}
                      className={`${styles.deleteBtn} flex-1`}
                    >
                      <FaTrash className="text-xs" /> Delete Task Entry
                    </button>
                  </div>
                </div>
              ) : (
                <div className={styles.offlineWrapper}>
                  <div className={styles.offlineHeader}>
                    <FaSearchMinus className={styles.offlineIcon} /> Task Details Stream Offline
                  </div>
                  <p className={styles.offlineText}>
                    Select any task row tracking entity node on the left list to initialize details
                    view telemetry.
                  </p>
                </div>
              )}
            </div>
          </div>
        </div>
      )}

      {/* Share Workspace Modal Overlay Context */}
      <ShareTaskModal
        isOpen={sharingTask !== null}
        onClose={() => setSharingTask(null)}
        task={sharingTask || (activeTaskDetails as Task)}
        onShareSuccess={(updatedTask: Task) => handleShareSuccess(updatedTask)}
      />
    </div>
  );
};

export default AllTasksView;
