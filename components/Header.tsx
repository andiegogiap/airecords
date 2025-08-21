import React from 'react';
import { Page } from '../types';
import { BookOpenIcon, UsersIcon, OrchestrationIcon, WandIcon, FolderIcon, SettingsIcon, DevToolsIcon, GlobeIcon } from './icons';

interface HeaderProps {
    currentPage: Page;
    onNavigate: (page: Page) => void;
}

const NavButton: React.FC<{
    page: Page;
    label: string;
    icon: React.ReactNode;
    currentPage: Page;
    onNavigate: (page: Page) => void;
}> = ({ page, label, icon, currentPage, onNavigate }) => {
    const isActive = currentPage === page;
    const activeClasses = "text-[--primary-color] bg-[--primary-color]/10 border-[--primary-color]/50 shadow-[0_0_15px_var(--primary-color)]";
    const inactiveClasses = "text-gray-400 hover:text-white hover:bg-white/5 border-transparent";
    return (
        <button
            onClick={() => onNavigate(page)}
            className={`flex flex-col items-center justify-center text-center px-2 py-2 rounded-lg border text-xs font-semibold transition-all duration-200 w-24 h-20 ${isActive ? activeClasses : inactiveClasses}`}
            aria-current={isActive ? 'page' : undefined}
        >
            {icon}
            <span className="mt-1">{label}</span>
        </button>
    );
};


const Header: React.FC<HeaderProps> = ({ currentPage, onNavigate }) => {
    const navItems: { page: Page; label: string; icon: React.ReactNode }[] = [
        { page: 'records', label: 'Records', icon: <BookOpenIcon className="w-6 h-6"/> },
        { page: 'refinery', label: 'Refinery', icon: <WandIcon className="w-6 h-6"/> },
        { page: 'agents', label: 'Agents', icon: <UsersIcon className="w-6 h-6"/> },
        { page: 'domainOrchestration', label: 'Orchestration', icon: <OrchestrationIcon className="w-6 h-6"/> },
        { page: 'orchestration', label: 'Site Analysis', icon: <GlobeIcon className="w-6 h-6"/> },
        { page: 'files', label: 'GitHub Files', icon: <FolderIcon className="w-6 h-6"/> },
        { page: 'settings', label: 'Settings', icon: <SettingsIcon className="w-6 h-6"/> },
        { page: 'devtools', label: 'Dev Tools', icon: <DevToolsIcon className="w-6 h-6"/> },
    ];
    
  return (
    <header className="bg-gradient-to-b from-black/50 to-transparent text-white shadow-md sticky top-0 z-40 backdrop-blur-lg">
      <div className="px-4 sm:px-6 lg:px-8 py-4 flex flex-col md:flex-row items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <a href="/" aria-label="Home">
            <img
              src="https://andiegogiap.com/assets/aionex-icon-256.png"
              alt="AIONEX Logo"
              style={{ height: '40px', width: 'auto', display: 'block' }}
              loading="eager"
              decoding="async"
            />
          </a>
          <h1 className="text-2xl sm:text-3xl font-bold tracking-widest text-glow-primary text-[--primary-color]">
            AI-Enhanced Records Manager
          </h1>
        </div>
        <nav className="hidden md:flex flex-wrap justify-center gap-2">
            {navItems.map(item => (
                <NavButton key={item.page} {...item} currentPage={currentPage} onNavigate={onNavigate} />
            ))}
        </nav>
      </div>
    </header>
  );
};

export default Header;