import React, { useState, useEffect, useRef } from 'react';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import { ConsoleLog } from '../types';

interface CommandConsoleProps {
  logs: ConsoleLog[];
  onCommand: (command: string) => void;
  isLoading: boolean;
}

const CommandConsole: React.FC<CommandConsoleProps> = ({ logs, onCommand, isLoading }) => {
  const [input, setInput] = useState('');
  const [history, setHistory] = useState<string[]>([]);
  const [historyIndex, setHistoryIndex] = useState(-1);
  const endOfLogsRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    endOfLogsRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [logs]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const command = input.trim();
    if (!command) return;

    onCommand(command);
    setHistory(prev => [command, ...prev]);
    setHistoryIndex(-1);
    setInput('');
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'ArrowUp') {
        e.preventDefault();
        if (history.length > 0) {
            const newIndex = Math.min(historyIndex + 1, history.length - 1);
            setHistoryIndex(newIndex);
            setInput(history[newIndex]);
        }
    } else if (e.key === 'ArrowDown') {
        e.preventDefault();
        if (historyIndex > 0) {
            const newIndex = Math.max(historyIndex - 1, 0);
            setHistoryIndex(newIndex);
            setInput(history[newIndex]);
        } else {
            setHistoryIndex(-1);
            setInput('');
        }
    }
  }

  const getLogColor = (type: ConsoleLog['type']) => {
    switch (type) {
      case 'error': return 'text-red-400';
      case 'success': return 'text-green-400';
      case 'info': return 'text-cyan-400';
      default: return 'text-gray-300';
    }
  };
  
  const getAgentColor = (agent: string) => {
    switch(agent) {
        case 'Andoy': return 'text-yellow-300 font-bold';
        case 'Adam': return 'text-cyan-300 font-bold';
        case 'David': return 'text-purple-300 font-bold';
        case 'User': return 'text-gray-400';
        case 'Lyra': return 'text-orange-300 font-bold';
        case 'Kara': return 'text-rose-300 font-bold';
        case 'Sophia': return 'text-teal-300 font-bold';
        case 'Cecilia': return 'text-indigo-300 font-bold';
        case 'Stan': return 'text-lime-300 font-bold';
        case 'Dude': return 'text-sky-300 font-bold';
        case 'ANDIE': return 'text-yellow-200 font-bold';
        case 'GUAC': return 'text-emerald-300 font-bold';
        case 'Atlas': return 'text-gray-200 font-bold';
        case 'Critica': return 'text-fuchsia-300 font-bold';
        default: return 'text-pink-300 font-bold';
    }
  }

  return (
    <div className="bg-black/50 backdrop-blur-sm rounded-lg shadow-lg flex flex-col h-[calc(100vh-10rem)] max-h-[800px] font-mono text-sm sticky top-24 border border-[--primary-color]/30">
      <div className="p-3 bg-black/30 rounded-t-lg text-gray-300 text-xs font-sans border-b border-[--primary-color]/30">Command Console</div>
      <div className="flex-grow p-4 overflow-y-auto space-y-2">
        {logs.map((log, index) => (
          <div key={index} className="flex items-start gap-2">
            <span className={`${getAgentColor(log.agent)} flex-shrink-0`}>[{log.agent}]</span>
            <div className={`leading-snug ${getLogColor(log.type)}`}>
              <ReactMarkdown
                remarkPlugins={[remarkGfm]}
                components={{
                    p: ({node, ...props}) => <p {...props} className="m-0" />,
                    a: ({node, ...props}) => <a {...props} target="_blank" rel="noopener noreferrer" className="text-cyan-400 hover:underline" />,
                    code: ({node, className, children, ...props}) => (
                        <code className="bg-gray-700/50 text-red-400 font-mono text-xs px-1 py-0.5 rounded" {...props}>
                            {children}
                        </code>
                    ),
                    pre: ({node, ...props}) => <pre {...props} className="bg-black/30 p-2 my-1 rounded-md overflow-x-auto" />,
                    ul: ({node, ...props}) => <ul {...props} className="list-disc list-inside" />,
                    ol: ({node, ...props}) => <ol {...props} className="list-decimal list-inside" />,
                    li: ({node, ...props}) => <li {...props} className="my-0.5" />,
                }}
              >
                  {log.message}
              </ReactMarkdown>
            </div>
          </div>
        ))}
        <div ref={endOfLogsRef} />
      </div>
      <form onSubmit={handleSubmit} className="p-2 border-t border-[--primary-color]/30">
        <div className="flex items-center">
            <span className="text-[--primary-color] pl-2 pr-1 text-glow-primary">&gt;</span>
            <input
                type="text"
                value={input}
                onChange={(e) => setInput(e.target.value)}
                onKeyDown={handleKeyDown}
                disabled={isLoading}
                placeholder={isLoading ? 'Running command...' : 'Type a command...'}
                className="w-full bg-transparent text-gray-300 focus:outline-none placeholder-gray-500"
                autoFocus
            />
        </div>
      </form>
    </div>
  );
};

export default CommandConsole;