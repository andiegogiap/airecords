import React, { useEffect } from 'react';
import { BookOpenIcon } from './icons';

interface GuideModalProps {
  isOpen: boolean;
  onClose: () => void;
}

const Code: React.FC<{ children: React.ReactNode }> = ({ children }) => (
    <code className="bg-gray-700 text-red-400 font-mono text-sm px-1.5 py-0.5 rounded-md border border-gray-600">
        {children}
    </code>
);

const GuideModal: React.FC<GuideModalProps> = ({ isOpen, onClose }) => {
    useEffect(() => {
        if (isOpen) {
            document.body.style.overflow = 'hidden';
            const handleEsc = (event: KeyboardEvent) => {
                if (event.key === 'Escape') {
                  onClose();
                }
            };
            window.addEventListener('keydown', handleEsc);
            return () => window.removeEventListener('keydown', handleEsc);
        }
        document.body.style.overflow = 'auto';
    }, [isOpen, onClose]);

    if (!isOpen) {
        return null;
    }

  return (
    <div
      className="fixed inset-0 bg-black/80 backdrop-blur-sm flex items-center justify-center z-50 p-4 transition-opacity duration-300 animate-fade-in"
      onClick={onClose}
      role="dialog"
      aria-modal="true"
      aria-labelledby="guide-title"
    >
      <div
        className="relative bg-[--card-bg-opaque] rounded-xl shadow-2xl w-full max-w-4xl h-[90vh] flex flex-col animate-scale-in border border-[--card-border-color]"
        onClick={(e) => e.stopPropagation()}
      >
        <header className="flex items-center justify-between p-4 border-b border-[--primary-color]/30 flex-shrink-0">
            <div className="flex items-center gap-3">
                <BookOpenIcon className="w-8 h-8 text-[--primary-color]" />
                <h2 id="guide-title" className="text-2xl font-bold text-glow-primary text-[--primary-color]">
                    Application Guide
                </h2>
            </div>
            <button
            onClick={onClose}
            className="w-9 h-9 bg-gray-700 text-gray-300 rounded-full text-2xl font-bold flex items-center justify-center z-10 hover:bg-gray-600 transition-colors"
            aria-label="Close guide"
            >
            &times;
            </button>
        </header>
        <main className="flex-grow p-6 overflow-y-auto space-y-8 text-gray-300 leading-relaxed">
            <section>
                <h3 className="text-xl font-bold text-[--neon-cyan] text-glow-cyan mb-3">Welcome to the AI Family Command Center</h3>
                <p>Hello! I'm <span className="font-bold text-gray-100">Atlas</span>, your guide to this application. My purpose is to help you understand the full capabilities of the AI agent team and how to orchestrate them to achieve your goals. This guide will walk you through the core concepts, a typical workflow, and a cheatsheet of all available commands.</p>
            </section>
            
            <section>
                <h3 className="text-xl font-bold text-[--neon-cyan] text-glow-cyan mb-3">Step-by-Step: From Idea to Launch</h3>
                <p className="mb-4">Let's walk through a common use-case: generating a project specification, creating launch copy for it, and getting it approved.</p>
                <ol className="list-decimal list-inside space-y-4">
                    <li>
                        <strong className="text-gray-200">1. The Idea: Generate a Project Specification</strong><br/>
                        Start by selecting the "Project Spec Pipeline" workflow. When prompted, enter a topic for your project (e.g., "new user dashboard"). This will trigger the <Code>/spec_flow</Code> command. Agents <strong className="text-cyan-300">Adam</strong> and <strong className="text-purple-300">David</strong> will collaborate to create three files: <Code>plan.yaml</Code>, <Code>requirements.json</Code>, and <Code>summary.md</Code>.
                    </li>
                    <li>
                        <strong className="text-gray-200">2. The Creative Touch: Draft Launch Copy</strong><br/>
                        Next, choose the "Dude: Craft Launch Copy" workflow. You'll be prompted for SEO hashtags (e.g., <Code>#NewFeature #Dashboard</Code>). Agent <strong className="text-sky-300">Dude</strong> will then work with <strong className="text-orange-300">Lyra</strong> to find a punchy stat and generate social media copy for LinkedIn and X.
                    </li>
                     <li>
                        <strong className="text-gray-200">3. The Artifacts: Review the Output</strong><br/>
                        After each workflow, new "Workflow Output" records appear at the bottom of the page, complete with an AI-generated image and summary. The files from the spec flow can be found in the "Files" tab.
                    </li>
                    <li>
                        <strong className="text-gray-200">4. The Final Say: Executive Approval</strong><br/>
                        Finally, run the "ANDIE: Executive Approval" workflow. You'll be asked to <Code>approve</Code> or <Code>reject</Code> the latest AI-generated asset (your launch copy). <strong className="text-yellow-200">ANDIE</strong> will update the record's title with a status tag and create a new system log of the decision.
                    </li>
                </ol>
            </section>

            <section>
                <h3 className="text-xl font-bold text-[--neon-cyan] text-glow-cyan mb-3">How It Works: The Orchestration Process</h3>
                <ul className="space-y-3">
                   <li><strong>Workflows & Agents:</strong> The cards on the main page are your entry points. Each card is tied to a command and a set of AI agents who are pre-configured with specific roles and goals.</li>
                   <li><strong>Command Console:</strong> This is the heart of the operation. It shows a real-time log of the user's commands and the agents' responses and actions. You can also type commands directly here.</li>
                   <li><strong>AI Service (<Code>geminiService.ts</Code>):</strong> All AI-powered tasks (text generation, image generation, JSON creation) are handled by this service, which communicates with the Google Gemini API.</li>
                   <li><strong>Data Persistence (<Code>dbService.ts</Code> & <Code>fileService.ts</Code>):</strong> The application uses IndexedDB to store data directly in your browser. "Workflow Outputs" are stored as records via <Code>dbService</Code>, and generated documents like YAML or Markdown are stored via <Code>fileService</Code>. This ensures your work is saved between sessions without needing a backend server.</li>
                </ul>
            </section>

            <section>
                <h3 className="text-xl font-bold text-[--neon-cyan] text-glow-cyan mb-3">Command Cheatsheet</h3>
                <div className="space-y-3">
                    <div>
                        <Code>/guide</Code>
                        <p className="pl-2 text-sm">Displays this guide and cheatsheet.</p>
                    </div>
                     <div>
                        <Code>/spec_flow &lt;topic&gt;</Code>
                        <p className="pl-2 text-sm">Generates project specification documents for the given topic.</p>
                    </div>
                     <div>
                        <Code>/marketing_flow</Code>
                        <p className="pl-2 text-sm">Runs the full marketing video generation simulation.</p>
                    </div>
                     <div>
                        <Code>/lyra_tasksource</Code>
                        <p className="pl-2 text-sm">Runs a standalone data ingestion task by agent Lyra.</p>
                    </div>
                     <div>
                        <Code>/dude_craft_copy &lt;hashtags&gt;</Code>
                        <p className="pl-2 text-sm">Generates social media launch copy using the provided hashtags.</p>
                    </div>
                     <div>
                        <Code>/andie_signoff &lt;approve|reject&gt;</Code>
                        <p className="pl-2 text-sm">Approves or rejects the last AI-generated asset.</p>
                    </div>
                     <div>
                        <Code>/help</Code>
                        <p className="pl-2 text-sm">Displays a short help message.</p>
                    </div>
                     <div>
                        <Code>/clear</Code>
                        <p className="pl-2 text-sm">Clears all logs from the command console.</p>
                    </div>
                </div>
            </section>
        </main>
      </div>
      <style>{`
        @keyframes fade-in {
            from { opacity: 0; }
            to { opacity: 1; }
        }
        @keyframes scale-in {
            from { transform: scale(0.95); opacity: 0; }
            to { transform: scale(1); opacity: 1; }
        }
        .animate-fade-in {
            animation: fade-in 0.2s ease-out forwards;
        }
        .animate-scale-in {
            animation: scale-in 0.2s ease-out forwards;
        }
      `}</style>
    </div>
  );
};

export default GuideModal;