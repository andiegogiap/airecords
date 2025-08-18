import React from 'react';
import { Workflow } from '../types';
import { SparklesIcon } from './icons'; // Using sparkles as a generic "AI" icon

interface WorkflowCardProps {
  workflow: Workflow;
  onStart: (workflow: Workflow) => void;
  isDisabled: boolean;
}

const WorkflowCard: React.FC<WorkflowCardProps> = ({ workflow, onStart, isDisabled }) => {
  const workflowColorRGB = workflow.color.match(/\w\w/g)?.map(x => parseInt(x, 16)).join(', ');

  return (
    <div
      className="bg-[--card-bg] backdrop-blur-md rounded-lg transition-all duration-300 flex flex-col border border-[--card-border-color] hover:border-[--hover-glow] hover:shadow-[0_0_20px_var(--hover-glow)]"
      style={{ '--hover-glow': workflow.color, borderTop: `4px solid ${workflow.color}`, boxShadow: `0 0 10px rgba(${workflowColorRGB}, 0.2)` } as React.CSSProperties}
    >
      <div className="p-5 flex-grow flex flex-col">
        <div className="flex-grow">
          <h3 className="mb-2 text-lg font-bold text-gray-100" style={{ color: workflow.color, textShadow: `0 0 8px ${workflow.color}`}}>
            {workflow.name}
          </h3>
          <p className="text-gray-300 text-sm leading-relaxed mb-4">
            {workflow.description}
          </p>
          <div className="mb-4">
            <span className="text-xs font-semibold text-gray-400 uppercase">Agents Involved</span>
            <div className="flex flex-wrap gap-2 mt-2">
              {workflow.agents.map(agent => (
                <span key={agent} className="px-2 py-1 text-xs font-semibold text-black rounded-full" style={{backgroundColor: workflow.color}}>
                  {agent}
                </span>
              ))}
            </div>
          </div>
        </div>
        <div className="mt-4 pt-4 border-t border-gray-700/50 flex justify-end">
          <button
            onClick={() => onStart(workflow)}
            disabled={isDisabled}
            className="flex items-center gap-2 px-4 py-2 text-sm font-semibold text-black rounded-md shadow-lg focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-[--background-dark] transition-all disabled:opacity-70 disabled:cursor-wait"
            style={{
                backgroundColor: workflow.color,
                boxShadow: `0 0 12px ${workflow.color}`,
                '--tw-ring-color': workflow.color
            } as React.CSSProperties}
          >
            <SparklesIcon className="w-4 h-4" />
            Start Workflow
          </button>
        </div>
      </div>
    </div>
  );
};

export default WorkflowCard;