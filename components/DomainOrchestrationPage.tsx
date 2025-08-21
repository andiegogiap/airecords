import React, { useState, useEffect } from 'react';
import { LyraIcon, KaraIcon, SparklesIcon } from './icons';

const InfoCard: React.FC<{title: string, icon?: React.ReactNode, children: React.ReactNode}> = ({ title, icon, children }) => (
    <div className="bg-[--card-bg] backdrop-blur-md p-6 rounded-lg shadow-lg border border-[--card-border-color]">
        <h3 className="text-lg font-bold text-[--neon-cyan] text-glow-cyan mb-3 flex items-center gap-2">
            {icon}
            {title}
        </h3>
        <div className="text-gray-300 space-y-2 text-sm">{children}</div>
    </div>
);

const BenefitPill: React.FC<{children: React.ReactNode}> = ({children}) => (
    <div className="flex items-center gap-2 bg-green-900/40 text-green-300 text-sm font-semibold px-3 py-1.5 rounded-full">
        <SparklesIcon className="w-4 h-4"/>
        <span>{children}</span>
    </div>
);

const StatusIndicator: React.FC = () => (
    <div className="relative flex items-center" title="Status: Active">
        <span className="relative inline-flex h-3 w-3">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-green-400 opacity-75"></span>
            <span className="relative inline-flex rounded-full h-3 w-3 bg-green-500"></span>
        </span>
        <span className="ml-2 text-xs text-green-300">Active</span>
    </div>
);


const DomainOrchestrationPage: React.FC = () => {
    const [lastSyncTime, setLastSyncTime] = useState(new Date());

    useEffect(() => {
        const timer = setInterval(() => {
            setLastSyncTime(new Date());
        }, 5000); // Update every 5 seconds

        return () => clearInterval(timer);
    }, []);

    return (
        <div className="space-y-8">
             <style>{`
                .api-glow {
                    animation: api-pulse 2s infinite ease-in-out;
                }
                @keyframes api-pulse {
                    0%, 100% { text-shadow: 0 0 5px var(--neon-cyan), 0 0 10px var(--neon-cyan); }
                    50% { text-shadow: 0 0 10px var(--neon-cyan), 0 0 20px var(--neon-cyan); }
                }
            `}</style>
            <header className="text-center">
                <h2 className="text-3xl font-bold text-glow-primary text-[--primary-color] mb-2">
                    Cross-Domain AI Orchestration
                </h2>
                <p className="text-lg text-gray-400 max-w-3xl mx-auto">
                    A blueprint for seamless, supervised, and autonomous collaboration between AI agents across distinct operational domains.
                </p>
            </header>

            <div className="bg-black/30 p-6 rounded-lg border border-[--primary-color]/20 shadow-inner">
                <h3 className="text-xl font-bold text-center text-gray-200 mb-6">Operational Blueprint</h3>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 items-center">
                    {/* A2A Coordination Diagram */}
                    <div className="bg-[--card-bg] p-6 rounded-lg border border-[--card-border-color] flex flex-col items-center justify-center gap-4 h-full">
                       <div className="text-center">
                            <h4 className="font-bold text-[--neon-cyan] text-glow-cyan mb-1">Supervised Guidance</h4>
                            <p className="text-xs text-gray-400">GEMINI & OPENAI Meta-Agents</p>
                       </div>
                       <div className="w-full border-t-2 border-dashed border-gray-600 my-2"></div>
                       <div className="flex items-center justify-around w-full">
                           <div className="flex flex-col items-center gap-2">
                                <LyraIcon className="w-12 h-12 text-yellow-300"/>
                                <span className="font-bold text-yellow-300">Lyra</span>
                                <span className="text-xs text-gray-400">Domain A</span>
                                <StatusIndicator />
                           </div>
                           <div className="flex flex-col items-center text-cyan-400">
                                <span className="text-xl font-bold api-glow">&lt;- API -&gt;</span>
                                <span className="text-sm">A2A Sync</span>
                           </div>
                           <div className="flex flex-col items-center gap-2">
                                <KaraIcon className="w-12 h-12 text-rose-300"/>
                                <span className="font-bold text-rose-300">Kara</span>
                                <span className="text-xs text-gray-400">Domain B</span>
                                <StatusIndicator />
                           </div>
                       </div>
                        <div className="w-full border-t-2 border-dashed border-gray-600 my-2"></div>
                       <div className="text-center">
                            <h4 className="font-bold text-gray-200">Continuous Documentation Workflow</h4>
                            <p className="text-xs text-gray-400">Versioned & Automated</p>
                            <p className="text-xs text-gray-500 mt-2">Last Sync: {lastSyncTime.toLocaleTimeString()}</p>
                       </div>
                    </div>
                    
                    <div className="space-y-4">
                        <InfoCard title="API-Based Orchestration">
                            <p>Secure REST API endpoints facilitate all communication, ensuring real-time, traceable data transfer and task tracking between domains.</p>
                        </InfoCard>
                        <InfoCard title="Contextual Knowledge Management">
                           <p>Agents autonomously monitor, push, and pull knowledge base changes, ensuring harmonized information with full audit trails and rollback capabilities.</p>
                        </InfoCard>
                    </div>
                </div>
            </div>

            <div className="space-y-6">
                 <h3 className="text-xl font-bold text-center text-gray-200">Key Benefits</h3>
                 <div className="flex flex-wrap justify-center gap-4">
                    <BenefitPill>Zero-lag knowledge propagation</BenefitPill>
                    <BenefitPill>24/7 autonomous operation</BenefitPill>
                    <BenefitPill>Unified documentation standards</BenefitPill>
                    <BenefitPill>Meta-level context awareness</BenefitPill>
                 </div>
            </div>

            <div className="bg-black/20 p-6 rounded-md text-base text-center text-gray-300 border-t-2 border-b-2 border-double border-[--neon-cyan]">
                <p className="italic">"This system orchestrates agent-to-agent automation and knowledge management across two domains via API, leveraging supervised cross-relational intelligence from GEMINI and OPENAI for fully autonomous, contextual, and auditable updates and documentation workflows."</p>
            </div>
        </div>
    );
};

export default DomainOrchestrationPage;