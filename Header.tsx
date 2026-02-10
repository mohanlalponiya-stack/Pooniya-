
import React from 'react';
import { AppTab } from '../types';

interface HeaderProps {
  activeTab: AppTab;
  setActiveTab: (tab: AppTab) => void;
}

const Header: React.FC<HeaderProps> = ({ activeTab, setActiveTab }) => {
  const tabs = [
    { id: AppTab.EDITOR, label: 'Image Editor', icon: '🎨' },
    { id: AppTab.GENERATOR, label: 'Generator Pro', icon: '🚀' },
    { id: AppTab.CHAT, label: 'AI Chat', icon: '💬' },
    { id: AppTab.ASSISTANT, label: 'Fast Assistant', icon: '⚡' },
  ];

  return (
    <header className="sticky top-0 z-50 glass-effect border-b border-slate-800 px-6 py-4 flex items-center justify-between">
      <div className="flex items-center gap-2">
        <div className="w-10 h-10 bg-yellow-400 rounded-xl flex items-center justify-center text-2xl shadow-lg shadow-yellow-500/20">
          👑
        </div>
        <div>
          <h1 className="text-xl font-bold bg-gradient-to-r from-yellow-200 to-yellow-500 bg-clip-text text-transparent">
            Mohan Lal jaat
          </h1>
          <p className="text-[10px] text-slate-400 uppercase tracking-widest font-semibold">Creative AI Suite</p>
        </div>
      </div>

      <nav className="hidden md:flex items-center gap-1 bg-slate-900/50 p-1 rounded-xl border border-slate-800">
        {tabs.map((tab) => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id)}
            className={`px-4 py-2 rounded-lg text-sm font-medium transition-all duration-200 flex items-center gap-2 ${
              activeTab === tab.id
                ? 'bg-yellow-500 text-slate-900 shadow-lg'
                : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800'
            }`}
          >
            <span>{tab.icon}</span>
            {tab.label}
          </button>
        ))}
      </nav>

      <div className="flex items-center gap-4">
        <div className="hidden lg:block text-right">
          <p className="text-xs text-slate-400">Model Status</p>
          <div className="flex items-center gap-2 justify-end">
            <span className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></span>
            <span className="text-xs font-medium text-slate-200">AI Core Online</span>
          </div>
        </div>
      </div>
    </header>
  );
};

export default Header;
