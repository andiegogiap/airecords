
import React, { useState } from 'react';
import { Page } from './types';
import Header from './components/Header';
import RecordsPage from './components/RecordsPage';
import RefineryPage from './components/RefineryPage';
import AgentsPage from './components/AgentsPage';
import OrchestrationPage from './components/OrchestrationPage';
import FilesPage from './components/FilesPage';
import SettingsPage from './components/SettingsPage';
import DevToolsPage from './components/DevToolsPage';
import FloatingNav from './components/FloatingNav';
import InstructionsPanel from './components/InstructionsPanel';
import DomainOrchestrationPage from './components/DomainOrchestrationPage';


function App() {
  const [currentPage, setCurrentPage] = useState<Page>('records');

  const renderPage = () => {
    switch (currentPage) {
      case 'records':
        return <RecordsPage onNavigate={setCurrentPage} />;
      case 'refinery':
        return <RefineryPage />;
      case 'agents':
        return <AgentsPage onNavigate={setCurrentPage} />;
      case 'orchestration':
        return <OrchestrationPage />;
      case 'domainOrchestration':
        return <DomainOrchestrationPage />;
      case 'files':
        return <FilesPage />;
      case 'settings':
        return <SettingsPage />;
      case 'devtools':
        return <DevToolsPage />;
      default:
        return <RecordsPage onNavigate={setCurrentPage} />;
    }
  };

  return (
    <div className="min-h-screen text-[--text-color] flex flex-col">
      <Header currentPage={currentPage} onNavigate={setCurrentPage} />
      <main id="app" className="p-4 sm:p-6 max-w-[95%] mx-auto w-full flex-grow">
        {renderPage()}
      </main>
      <FloatingNav currentPage={currentPage} onNavigate={setCurrentPage} />
      <InstructionsPanel />
      <footer className="py-4 text-center">
        <p className="text-xs text-gray-500 font-mono">
            System USER: user_a95bfb54 | Session ID: session_1ab89b9e-e17
        </p>
      </footer>
    </div>
  );
}

export default App;