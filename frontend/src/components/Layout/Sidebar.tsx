import React from 'react';

export const Sidebar: React.FC = () => {
  const menuItems = [
    { label: 'Dashboard', icon: '📊', active: true },
    { label: 'All Tasks', icon: '📝', active: false },
    { label: 'Add Task', icon: '➕', active: false },
    { label: 'Settings', icon: '⚙️', active: false },
  ];

  return (
    <aside className="w-full lg:w-64 bg-slate-900/60 backdrop-blur-xl border-b lg:border-b-0 lg:border-r border-slate-800/80 p-6 flex flex-col justify-between shrink-0 lg:min-h-screen">
      <div>
        {/* Workspace Brand Title Header */}
        <div className="flex items-center gap-3 mb-8 px-2">
          <div className="h-9 w-9 rounded-xl bg-gradient-to-tr from-indigo-500 to-purple-500 flex items-center justify-center text-white shadow-lg shadow-indigo-500/20">
            ✓
          </div>
          <span className="text-xl font-black tracking-tight text-white">TaskManager</span>
        </div>

        {/* Dynamic Navigation Map Menu List */}
        <nav className="space-y-1.5">
          {menuItems.map((item, index) => (
            <button
              key={index}
              className={`w-full flex items-center gap-3.5 px-4 py-3 rounded-xl text-sm font-semibold tracking-wide transition-all duration-200 group text-left ${
                item.active
                  ? 'bg-gradient-to-r from-indigo-600/20 to-purple-600/10 text-indigo-400 border border-indigo-500/20 shadow-md shadow-indigo-500/5'
                  : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/40 border border-transparent'
              }`}
            >
              <span className={`text-base transition-transform group-hover:scale-110 duration-200 ${item.active ? 'opacity-100' : 'opacity-70'}`}>
                {item.icon}
              </span>
              {item.label}
            </button>
          ))}
        </nav>
      </div>

      {/* User Session Profile Foot Widget Card */}
      <div className="mt-8 pt-4 border-t border-slate-800/60 flex items-center gap-3 px-2">
        <div className="h-10 w-10 rounded-full bg-slate-800 border border-slate-700 overflow-hidden flex items-center justify-center text-lg shadow-inner">
          👤
        </div>
        <div>
          <div className="text-xs font-bold text-slate-200">Developer Profile</div>
          <div className="text-[10px] text-indigo-400 font-medium tracking-wider font-mono">SYSTEM INTERN</div>
        </div>
      </div>
    </aside>
  );
};

export default Sidebar;