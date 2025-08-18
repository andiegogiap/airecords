import React from 'react';
import { SparklesIcon } from './icons';

const SettingsPage: React.FC = () => {
  return (
    <div className="bg-[--card-bg] backdrop-blur-md border border-[--card-border-color] p-6 rounded-lg shadow-lg max-w-2xl mx-auto">
      <h2 className="text-2xl font-bold text-glow-primary text-[--primary-color] mb-6 border-b border-[--primary-color]/30 pb-3">
        Application Settings
      </h2>
      <div className="space-y-8">
        <div className="p-4 rounded-lg bg-black/30">
          <h3 className="text-lg font-semibold flex items-center gap-2">
            <SparklesIcon className="w-5 h-5 text-[--neon-cyan]"/>
            <span>Current Theme: CyberGlow Neon</span>
          </h3>
          <p className="mt-2 text-gray-400">
            The application is styled with a custom high-contrast neon theme for optimal visibility and a futuristic feel.
          </p>
        </div>

        <div className="flex items-center justify-between">
          <span className="font-medium text-gray-300">
            Primary Accent Color
          </span>
          <div className="flex items-center gap-3">
             <span className="text-sm uppercase tracking-widest text-[--primary-color]">Magenta</span>
             <div className="w-10 h-10 p-1 rounded-md" style={{backgroundColor: 'var(--primary-color)'}}></div>
          </div>
        </div>
        
        <div className="flex items-center justify-between">
            <span className="font-medium text-gray-300">
                Accent Palette
            </span>
            <div className="flex items-center gap-2">
                <div className="w-8 h-8 rounded-full" style={{backgroundColor: 'var(--neon-cyan)'}}></div>
                <div className="w-8 h-8 rounded-full" style={{backgroundColor: 'var(--neon-green)'}}></div>
                <div className="w-8 h-8 rounded-full" style={{backgroundColor: 'var(--neon-blue)'}}></div>
                <div className="w-8 h-8 rounded-full" style={{backgroundColor: 'var(--neon-pink)'}}></div>
            </div>
        </div>

        <div className="bg-black/20 p-4 rounded-md text-sm text-gray-400 border-l-4 border-[--neon-cyan]">
            <p>This theme is fixed and does not require any configuration. Enjoy the vibe!</p>
        </div>
      </div>
    </div>
  );
};

export default SettingsPage;