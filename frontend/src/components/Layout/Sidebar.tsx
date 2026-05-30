import React from 'react';
import type { SidebarProps, TabId } from '../../types/layout';
import { 
  FaThLarge, 
  FaListUl, 
  FaPlusCircle, 
  FaSun, 
  FaMoon, 
  FaUserAlt 
} from 'react-icons/fa';

//  Clean Style Extraction Layer
const styles = {
  container: (dark: boolean) => 
    `w-full lg:w-64 p-6 flex flex-col justify-between shrink-0 lg:min-h-screen transition-colors duration-300 border-b lg:border-b-0 lg:border-r ${
      dark ? 'bg-slate-900/60 backdrop-blur-xl border-slate-800/80' : 'bg-slate-100 backdrop-blur-xl border-slate-200'
    }`,
  brandText: (dark: boolean) => 
    `text-xl font-black tracking-tight ${dark ? 'text-white' : 'text-slate-900'}`,
  navButton: (isSelected: boolean, dark: boolean) => 
    `w-full flex items-center gap-3.5 px-4 py-3 rounded-xl text-sm font-semibold tracking-wide transition-all duration-200 group text-left ${
      isSelected
        ? 'bg-indigo-600 text-white shadow-lg shadow-indigo-600/20'
        : dark
          ? 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/40'
          : 'text-slate-600 hover:text-slate-900 hover:bg-slate-200/60'
    }`,
  themeWidget: (dark: boolean) => 
    `p-3 rounded-xl flex items-center justify-between border transition-colors ${
      dark ? 'bg-slate-950/40 border-slate-800/60' : 'bg-slate-200/40 border-slate-300/60'
    }`,
  themeWidgetText: (dark: boolean) => 
    `text-xs font-bold tracking-wide flex items-center gap-2 ${dark ? 'text-slate-400' : 'text-slate-600'}`,
  profileContainer: (dark: boolean) => 
    `pt-4 border-t flex items-center gap-3 px-2 ${dark ? 'border-slate-800/60' : 'border-slate-200'}`,
  profileIconContainer: (dark: boolean) => 
    `h-10 w-10 rounded-full flex items-center justify-center text-sm shadow-inner ${
      dark ? 'bg-slate-800 border border-slate-700 text-slate-400' : 'bg-slate-200 border border-slate-300 text-slate-500'
    }`,
  profileName: (dark: boolean) => 
    `text-xs font-bold ${dark ? 'text-slate-200' : 'text-slate-800'}`
};

interface MenuItem {
  id: TabId;
  label: string;
  icon: React.ReactNode; // Updated to accept icon elements
}

export const Sidebar: React.FC<SidebarProps> = ({ activeTab, setActiveTab, darkMode, setDarkMode }) => {
  // Configured with clean vector icons
  const menuItems: MenuItem[] = [
    { id: 'dashboard', label: 'Dashboard', icon: <FaThLarge /> },
    { id: 'all-tasks', label: 'All Tasks', icon: <FaListUl /> },
    { id: 'add-task', label: 'Add Task', icon: <FaPlusCircle /> },
  ];

  return (
    <aside className={styles.container(darkMode)}>
      <div>
        {/* Brand Header */}
        <div className="flex items-center gap-3 mb-8 px-2">
          <div className="h-9 w-9 rounded-xl bg-gradient-to-tr from-indigo-500 to-purple-500 flex items-center justify-center text-white shadow-lg shadow-indigo-500/20 font-bold">
            ✓
          </div>
          <span className={styles.brandText(darkMode)}>TaskManager</span>
        </div>

        {/* Navigation Map */}
        <nav className="space-y-1.5">
          {menuItems.map((item) => (
            <button
              key={item.id}
              onClick={() => setActiveTab(item.id)}
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

      {/* Footer System Status Panel */}
      <div className="space-y-4">
        {/* Toggle Switch Widget */}
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
            <div className={`w-5 h-5 bg-white rounded-full shadow-md transform transition-transform duration-200 flex items-center justify-center text-[10px] ${
              darkMode ? 'translate-x-5' : 'translate-x-0'
            }`}>
              {darkMode ? <FaMoon className="text-indigo-600 text-[9px]" /> : <FaSun className="text-amber-500 text-[9px]" />}
            </div>
          </button>
        </div>

        {/* User Card */}
        <div className={styles.profileContainer(darkMode)}>
          <div className={styles.profileIconContainer(darkMode)}>
            <FaUserAlt />
          </div>
          <div>
            <div className={styles.profileName(darkMode)}>Developer Profile</div>
            <div className="text-[10px] text-indigo-500 font-medium tracking-wider font-mono">SYSTEM INTERN</div>
          </div>
        </div>
      </div>
    </aside>
  );
};

export default Sidebar;