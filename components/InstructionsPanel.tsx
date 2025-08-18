import React, { useState, useEffect } from 'react';
import * as instructionService from '../services/instructionService';
import { SettingsIcon, XIcon } from './icons';

const InstructionsPanel: React.FC = () => {
    const [isOpen, setIsOpen] = useState(false);
    const [aiInstruction, setAiInstruction] = useState('');
    const [systemInstruction, setSystemInstruction] = useState('');
    const [savedMessage, setSavedMessage] = useState('');

    useEffect(() => {
        if (isOpen) {
            setAiInstruction(instructionService.getAiSupervisorInstruction());
            setSystemInstruction(instructionService.getSystemOrchestratorInstruction());
        }
    }, [isOpen]);

    const handleSave = () => {
        instructionService.setAiSupervisorInstruction(aiInstruction);
        instructionService.setSystemOrchestratorInstruction(systemInstruction);
        setSavedMessage('Instructions saved successfully!');
        setTimeout(() => setSavedMessage(''), 3000);
    };

    return (
        <>
            <button
                onClick={() => setIsOpen(true)}
                className="fixed top-1/2 -translate-y-1/2 right-0 z-40 bg-[--card-bg] text-white p-2 rounded-l-lg shadow-lg border-y border-l border-[--card-border-color] hover:bg-[--primary-color]/20 transition-colors"
                aria-label="Open Custom Instructions Panel"
            >
                <SettingsIcon className="w-6 h-6" />
            </button>

            {/* Backdrop */}
            <div
                className={`fixed inset-0 bg-black/60 z-40 transition-opacity ${isOpen ? 'opacity-100' : 'opacity-0 pointer-events-none'}`}
                onClick={() => setIsOpen(false)}
            />

            {/* Panel */}
            <div
                className={`fixed top-0 right-0 h-full w-full max-w-lg bg-[--background-dark] z-50 shadow-2xl transition-transform duration-300 ease-in-out border-l-2 border-[--primary-color] flex flex-col ${isOpen ? 'translate-x-0' : 'translate-x-full'}`}
            >
                {/* Header */}
                <div className="flex justify-between items-center p-4 border-b border-[--card-border-color] flex-shrink-0">
                    <h2 className="text-xl font-bold text-glow-primary text-[--primary-color]">Custom Instructions</h2>
                    <button onClick={() => setIsOpen(false)} className="p-1 rounded-full hover:bg-gray-700">
                        <XIcon className="w-6 h-6" />
                    </button>
                </div>

                {/* Content */}
                <div className="p-6 overflow-y-auto space-y-6 flex-grow">
                    <div>
                        <label className="block text-lg font-semibold text-gray-200 mb-2">AI Supervisor (Lyra)</label>
                        <p className="text-sm text-gray-400 mb-2">Defines the primary persona, skills, and response style for the main AI agent.</p>
                        <textarea
                            value={aiInstruction}
                            onChange={(e) => setAiInstruction(e.target.value)}
                            rows={15}
                            className="w-full p-3 font-mono text-sm border rounded-md bg-black/30 border-gray-600 text-gray-200 focus:ring-1 focus:ring-[--primary-color] focus:border-[--primary-color] transition"
                        />
                    </div>
                    <div>
                        <label className="block text-lg font-semibold text-gray-200 mb-2">System Orchestrator</label>
                        <p className="text-sm text-gray-400 mb-2">High-level directives for how the entire system should manage workflows and agents.</p>
                        <textarea
                            value={systemInstruction}
                            onChange={(e) => setSystemInstruction(e.target.value)}
                            rows={8}
                            className="w-full p-3 font-mono text-sm border rounded-md bg-black/30 border-gray-600 text-gray-200 focus:ring-1 focus:ring-[--primary-color] focus:border-[--primary-color] transition"
                        />
                    </div>
                </div>
                
                {/* Footer */}
                <div className="p-4 border-t border-[--card-border-color] flex-shrink-0 flex justify-end items-center gap-4">
                     {savedMessage && <span className="text-green-400 text-sm">{savedMessage}</span>}
                    <button
                        onClick={handleSave}
                        className="px-6 py-2 font-semibold text-black bg-[--primary-color] rounded-md shadow-lg hover:bg-[--primary-color-hover] transition shadow-[0_0_8px_var(--primary-color)]"
                    >
                        Save Instructions
                    </button>
                </div>
            </div>
        </>
    );
};

export default InstructionsPanel;
