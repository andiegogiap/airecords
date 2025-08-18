
import React, { useState } from 'react';
import { Page } from '../types';
import { BookOpenIcon, UsersIcon, OrchestrationIcon, WandIcon, FolderIcon, SettingsIcon, DevToolsIcon, GlobeIcon, XIcon } from './icons';

interface FloatingNavProps {
    currentPage: Page;
    onNavigate: (page: Page) => void;
}

const navItems: { page: Page; label: string; icon: React.ReactNode }[] = [
    { page: 'records', label: 'Records', icon: <BookOpenIcon className="w-6 h-6"/> },
    { page: 'refinery', label: 'Refinery', icon: <WandIcon className="w-6 h-6"/> },
    { page: 'agents', label: 'Agents', icon: <UsersIcon className="w-6 h-6"/> },
    { page: 'orchestration', label: 'Workbench', icon: <OrchestrationIcon className="w-6 h-6"/> },
    { page: 'files', label: 'GitHub Files', icon: <FolderIcon className="w-6 h-6"/> },
    { page: 'settings', label: 'Settings', icon: <SettingsIcon className="w-6 h-6"/> },
    { page: 'devtools', label: 'Dev Tools', icon: <DevToolsIcon className="w-6 h-6"/> },
];

const FloatingNav: React.FC<FloatingNavProps> = ({ currentPage, onNavigate }) => {
    const [isOpen, setIsOpen] = useState(false);

    const menuItems = navItems.map((item, index) => {
        const angle = -90 - (index * (110 / (navItems.length - 1)));
        const radius = 100;
        const x = radius * Math.cos(angle * Math.PI / 180);
        const y = radius * Math.sin(angle * Math.PI / 180);
        const isActive = currentPage === item.page;

        return (
            <button
                key={item.page}
                onClick={() => { onNavigate(item.page); setIsOpen(false); }}
                className={`absolute flex flex-col items-center justify-center w-20 h-20 rounded-full transition-all duration-300 ease-in-out hover:bg-[--neon-cyan]/20 ${isActive ? 'bg-[--neon-cyan]/20' : 'bg-[--card-bg-opaque]/90'}`}
                style={{
                    transform: isOpen ? `translate(${x}px, ${y}px) scale(1)` : 'translate(0, 0) scale(0)',
                    opacity: isOpen ? 1 : 0,
                    transitionDelay: isOpen ? `${index * 40}ms` : `${(navItems.length - index) * 40}ms`,
                    border: `1px solid ${isActive ? 'var(--neon-cyan)' : 'var(--card-border-color)'}`,
                    color: isActive ? 'var(--neon-cyan)' : 'var(--text-color)',
                }}
                title={item.label}
                aria-label={`Navigate to ${item.label}`}
            >
                {item.icon}
                <span className="text-[10px] mt-1">{item.label}</span>
            </button>
        );
    });

    return (
        <div className="fixed bottom-6 right-6 z-50 md:hidden">
            <div className="relative flex items-center justify-center">
                {/* Navigation Items */}
                {menuItems}

                {/* Main Orb Button */}
                <button
                    onClick={() => setIsOpen(!isOpen)}
                    className="relative w-16 h-16 bg-[--neon-cyan]/20 border-2 border-[--neon-cyan] rounded-full flex items-center justify-center text-[--neon-cyan] floating-nav-orb transition-transform duration-300 hover:scale-110"
                    aria-expanded={isOpen}
                    aria-label="Toggle navigation menu"
                >
                    <div className="absolute transition-all duration-300" style={{opacity: isOpen ? 1 : 0, transform: isOpen ? 'rotate(0)' : 'rotate(-90deg)'}}>
                       <XIcon className="w-8 h-8"/>
                    </div>
                     <div className="absolute transition-all duration-300" style={{opacity: isOpen ? 0 : 1, transform: isOpen ? 'rotate(90deg)' : 'rotate(0)'}}>
                       <GlobeIcon className="w-8 h-8"/>
                    </div>
                </button>
            </div>
        </div>
    );
};

export default FloatingNav;