import React, { useState } from 'react';
import { allAgents } from '../services/agents';
import { workflows } from '../services/workflows';
import { Page, Workflow } from '../types';
import AgentProfileCard from './AgentProfileCard';
import InputDialog from './InputDialog';

interface AgentsPageProps {
  onNavigate: (page: Page) => void;
}

const AgentsPage: React.FC<AgentsPageProps> = ({ onNavigate }) => {
  const [isInputDialogOpen, setIsInputDialogOpen] = useState(false);
  const [currentWorkflow, setCurrentWorkflow] = useState<Workflow | null>(null);

  const handleStartWorkflow = (workflow: Workflow) => {
    if (workflow.action.requiresInput) {
      setCurrentWorkflow(workflow);
      setIsInputDialogOpen(true);
    } else {
      // For commands without input, immediately set and navigate
      sessionStorage.setItem('commandToRun', workflow.action.command);
      onNavigate('records');
    }
  };

  const handleInputDialogSubmit = (inputValue: string) => {
    if (currentWorkflow) {
      const command = `${currentWorkflow.action.command} ${inputValue}`;
      sessionStorage.setItem('commandToRun', command);
      onNavigate('records');
    }
    // Reset state
    setIsInputDialogOpen(false);
    setCurrentWorkflow(null);
  };

  const handleInputDialogCancel = () => {
    setIsInputDialogOpen(false);
    setCurrentWorkflow(null);
  };

  return (
    <>
      {isInputDialogOpen && currentWorkflow && (
        <InputDialog
          prompt={currentWorkflow.action.inputPrompt || 'Enter value:'}
          onConfirm={handleInputDialogSubmit}
          onCancel={handleInputDialogCancel}
        />
      )}
      <div className="bg-[--card-bg-opaque] p-4 sm:p-6 rounded-lg shadow-lg max-w-full mx-auto">
        <h2 className="text-2xl font-bold text-glow-primary text-[--primary-color] mb-2">
          Agent Command Center
        </h2>
        <p className="text-gray-400 mb-6 border-b border-[--primary-color]/30 pb-4">
          Meet the AI agents. Select an agent to learn about their specialties and hand off tasks by starting one of their associated workflows.
        </p>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {allAgents.map(agent => (
            <AgentProfileCard 
              key={agent.id} 
              agent={agent} 
              workflows={workflows}
              onStartWorkflow={handleStartWorkflow} 
            />
          ))}
        </div>
      </div>
    </>
  );
};

export default AgentsPage;
