import React from 'react';
import { Agent, Workflow } from '../types';
import { SparklesIcon } from './icons';

interface AgentProfileCardProps {
    agent: Agent;
    workflows: Workflow[];
    onStartWorkflow: (workflow: Workflow) => void;
}

const AgentProfileCard: React.FC<AgentProfileCardProps> = ({ agent, workflows, onStartWorkflow }) => {
    const associatedWorkflows = workflows.filter(wf => agent.associatedWorkflowIds.includes(wf.id));
    const agentColorRGB = agent.color.match(/\w\w/g)?.map(x => parseInt(x, 16)).join(', ');

    return (
        <div 
            className="bg-[--card-bg] backdrop-blur-md rounded-lg flex flex-col border border-[--card-border-color] transition-all duration-300 hover:border-[--hover-glow] hover:shadow-[0_0_20px_var(--hover-glow)]"
            style={{ '--hover-glow': agent.color, borderTop: `4px solid ${agent.color}`, boxShadow: `0 0 10px rgba(${agentColorRGB}, 0.2)` } as React.CSSProperties}
        >
            <div className="p-5 flex-grow flex flex-col">
                <div className="flex items-start gap-4 mb-4">
                    <div 
                        className="w-16 h-16 rounded-full flex-shrink-0 flex items-center justify-center"
                        style={{ backgroundColor: `${agent.color}20` }}
                    >
                       <agent.avatar className="w-9 h-9" style={{ color: agent.color }} />
                    </div>
                    <div>
                        <h3 className="text-xl font-bold" style={{ color: agent.color, textShadow: `0 0 8px ${agent.color}` }}>
                            {agent.name}
                        </h3>
                        <p className="text-gray-300 text-sm leading-relaxed">
                            {agent.description}
                        </p>
                    </div>
                </div>

                <div className="mb-4 flex-grow">
                    <h4 className="text-xs font-semibold text-gray-400 uppercase tracking-wider mb-2">Specialties</h4>
                     <div className="flex flex-wrap gap-2">
                        {agent.specialties.map(specialty => (
                            <span key={specialty} className="px-2.5 py-1 text-xs font-semibold rounded-full bg-gray-700 text-gray-200">
                                {specialty}
                            </span>
                        ))}
                    </div>
                </div>

                {associatedWorkflows.length > 0 && (
                    <div className="mt-auto pt-4 border-t border-gray-700/50">
                        <h4 className="text-xs font-semibold text-gray-400 uppercase tracking-wider mb-3">Handoff Tasks</h4>
                        <div className="space-y-2">
                            {associatedWorkflows.map(wf => (
                                <button 
                                    key={wf.id}
                                    onClick={() => onStartWorkflow(wf)}
                                    className="w-full text-left p-2.5 rounded-md bg-black/30 hover:bg-black/50 transition-colors group"
                                >
                                    <div className="flex items-center justify-between">
                                        <span className="font-semibold text-sm text-gray-200 group-hover:text-[--primary-color] transition-colors">{wf.name}</span>
                                        <SparklesIcon className="w-5 h-5 text-gray-500 group-hover:text-[--primary-color] transition-colors" />
                                    </div>
                                </button>
                            ))}
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
};

export default AgentProfileCard;