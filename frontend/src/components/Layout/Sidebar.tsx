import React, { useState } from 'react';
import type { SidebarProps } from './types/sidebar.types';
import type { TabId } from '../../types/navigation.types';
import { sidebarStyles as styles } from './Sidebar.styles';
import { useAuth } from '../../features/auth/context/AuthContext'; // 🌟 Import your authentication core context hook
import {
  FaThLarge,
  FaListUl,
  FaPlusCircle,
  FaSun,
  FaMoon,
  FaBars,
  FaTimes,
  FaCheckDouble,
} from 'react-icons/fa';

interface MenuItem {
  id: TabId;
  label: string;
  icon: React.ReactNode;
}

export const Sidebar: React.FC<SidebarProps> = ({
  activeTab,
  setActiveTab,
  darkMode,
  setDarkMode,
  setStatusFilter,
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const { user } = useAuth(); // 🌟 Extract user session data

  const menuItems: MenuItem[] = [
    { id: 'dashboard', label: 'Dashboard', icon: <FaThLarge /> },
    { id: 'all-tasks', label: 'All Tasks', icon: <FaListUl /> },
    { id: 'add-task', label: 'Add Task', icon: <FaPlusCircle /> },
  ];

  const handleNavClick = (id: TabId) => {
    setActiveTab(id);
    if (id === 'all-tasks') {
      setStatusFilter('All');
    }
    setIsOpen(false);
  };

  // Shared function to route users back home cleanly when clicking the brand logo
  const handleLogoRedirect = () => {
    setActiveTab('dashboard');
    setStatusFilter('All');
    setIsOpen(false);
  };

  return (
    <>
      {/* Mobile Context Menu Header */}
      <header
        className={`lg:hidden w-full p-4 flex items-center justify-between border-b sticky top-0 z-40 backdrop-blur-md ${
          darkMode
            ? 'bg-slate-900/80 border-slate-800 text-white'
            : 'bg-slate-100/80 border-slate-200 text-slate-900'
        }`}
      >
        {/* CLICKABLE LOGO FOR MOBILE SCREEN */}
        <div
          onClick={handleLogoRedirect}
          className="flex items-center gap-2.5 cursor-pointer group"
          title="Go to Dashboard Home"
        >
          <div className="h-8 w-8 rounded-lg bg-gradient-to-tr from-indigo-500 to-purple-500 flex items-center justify-center text-white shadow-md font-bold text-sm transform group-hover:scale-105 transition-transform duration-200">
            <FaCheckDouble className="text-xs" />
          </div>
          <span className="text-lg font-black tracking-tight group-hover:text-indigo-400 transition-colors duration-200">
            TaskManager
          </span>
        </div>

        <button
          type="button"
          onClick={() => setIsOpen(!isOpen)}
          className={`p-2 rounded-xl border transition-colors ${
            darkMode
              ? 'bg-slate-800/60 border-slate-700 text-slate-200'
              : 'bg-slate-200/60 border-slate-300 text-slate-700'
          }`}
          aria-label="Toggle Menu"
        >
          {isOpen ? <FaTimes size={18} /> : <FaBars size={18} />}
        </button>
      </header>

      {/* Backdrop Underlay Filter Overlay */}
      {isOpen && (
        <div
          onClick={() => setIsOpen(false)}
          className="fixed inset-0 z-40 bg-slate-950/40 backdrop-blur-sm lg:hidden transition-opacity duration-300"
        />
      )}

      {/* Main Drawer Interface Element */}
      <aside className={styles.container(darkMode, isOpen)}>
        <div>
          <div className="flex items-center justify-between mb-8 px-2">
            {/* CLICKABLE LOGO FOR DESKTOP DRAWER */}
            <div
              onClick={handleLogoRedirect}
              className="flex items-center gap-3 cursor-pointer group w-full"
              title="Go to Dashboard Home"
            >
              <div className="h-9 w-9 rounded-xl bg-gradient-to-tr from-indigo-500 to-purple-500 flex items-center justify-center text-white shadow-lg shadow-indigo-500/20 font-bold transform group-hover:scale-105 transition-transform duration-200">
                <FaCheckDouble className="text-sm" />
              </div>
              <span
                className={`${styles.brandText(darkMode)} group-hover:text-indigo-400 transition-colors duration-200`}
              >
                TaskManager
              </span>
            </div>

            <button
              onClick={() => setIsOpen(false)}
              className={`lg:hidden p-1.5 rounded-lg border ${
                darkMode ? 'border-slate-800 text-slate-400' : 'border-slate-200 text-slate-500'
              }`}
            >
              <FaTimes size={14} />
            </button>
          </div>

          <nav className="space-y-1.5">
            {menuItems.map((item) => (
              <button
                key={item.id}
                onClick={() => handleNavClick(item.id)}
                className={styles.navButton(activeTab === item.id, darkMode)}
              >
                <span className="text-sm transition-transform group-hover:scale-110 duration-200">
                  {item.icon}
                </span>
                {item.label}
              </button>
            ))}
          </nav>
        </div>

        <div className="space-y-4">
          <div className={styles.themeWidget(darkMode)}>
            <span className={styles.themeWidgetText(darkMode)}>
              {darkMode ? (
                <>
                  <FaMoon className="text-indigo-400" /> Dark Mode
                </>
              ) : (
                <>
                  <FaSun className="text-amber-500" /> Light Mode
                </>
              )}
            </span>
            <button
              type="button"
              onClick={() => setDarkMode(!darkMode)}
              className="w-11 h-6 bg-indigo-600 rounded-full p-0.5 transition-colors relative shadow-inner outline-none"
            >
              <div
                className={`w-5 h-5 bg-white rounded-full shadow-md transform transition-transform duration-200 flex items-center justify-center text-[10px] ${
                  darkMode ? 'translate-x-5' : 'translate-x-0'
                }`}
              >
                {darkMode ? (
                  <FaMoon className="text-indigo-600 text-[9px]" />
                ) : (
                  <FaSun className="text-amber-500 text-[9px]" />
                )}
              </div>
            </button>
          </div>

          {/* 🌟 Upgraded Interactive Bottom Identity Card Component */}
          {/* Note: In your routing types, ensure 'profile' is added to TabId string types! */}
          <div
            onClick={() => handleNavClick('profile' as TabId)}
            className={styles.profileContainer(activeTab === 'profile', darkMode)}
          >
            <div className={styles.profileIconContainer(activeTab === 'profile', darkMode)}>
              {/* Render User initial capital node tag letter dynamically */}
              {user?.username?.charAt(0).toUpperCase() || 'D'}
            </div>
            <div className="truncate">
              <div className={styles.profileName(darkMode)}>
                {user?.username
                  ? user.username.charAt(0).toUpperCase() + user.username.slice(1)
                  : 'Developer'}
              </div>
              <div className="text-[10px] text-indigo-500 font-bold tracking-wider font-mono uppercase">
                Active Operator
              </div>
            </div>
          </div>
        </div>
      </aside>
    </>
  );
};

export default Sidebar;
