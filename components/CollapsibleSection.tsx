
import React, { useState } from 'react';
import { ChevronDownIcon } from './icons';

interface CollapsibleSectionProps {
    title: string;
    children: React.ReactNode;
    defaultOpen?: boolean;
}

const CollapsibleSection: React.FC<CollapsibleSectionProps> = ({ title, children, defaultOpen = false }) => {
    const [isOpen, setIsOpen] = useState(defaultOpen);

    return (
        <div className="border border-[--card-border-color] rounded-lg bg-black/20 overflow-hidden transition-all duration-300">
            <button
                onClick={() => setIsOpen(!isOpen)}
                className="w-full flex justify-between items-center p-4 bg-[--card-bg]/50 hover:bg-[--card-bg] transition-colors focus:outline-none focus:ring-2 focus:ring-inset focus:ring-[--primary-color]"
                aria-expanded={isOpen}
            >
                <h3 className="font-semibold text-gray-200 text-left">{title}</h3>
                <ChevronDownIcon className={`w-5 h-5 text-gray-400 transition-transform duration-200 ${isOpen ? 'rotate-180' : ''}`} />
            </button>
            <div 
                style={{
                    display: 'grid',
                    gridTemplateRows: isOpen ? '1fr' : '0fr',
                    transition: 'grid-template-rows 0.3s ease-out',
                }}
            >
                <div className="overflow-hidden">
                    <div className="p-4 border-t border-[--card-border-color]/50 text-gray-300 text-sm leading-relaxed">
                        {children}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default CollapsibleSection;