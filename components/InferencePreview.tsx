import React, { useState, useEffect } from 'react';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import { AppRecord } from '../types';
import * as githubService from '../services/fileService'; // Repurposed for GitHub
import * as beautify from 'js-beautify';
import { Prism as SyntaxHighlighter } from 'react-syntax-highlighter';
import { vscDarkPlus } from 'react-syntax-highlighter/dist/esm/styles/prism';

interface InferencePreviewProps {
    record: AppRecord;
    onFinalize: (record: AppRecord) => void;
}

type Tab = 'preview' | 'htmlSource' | 'summary' | 'plan' | 'requirements';

const InferencePreview: React.FC<InferencePreviewProps> = ({ record, onFinalize }) => {
    const [activeTab, setActiveTab] = useState<Tab>('preview');
    const [files, setFiles] = useState<{ yaml: string, json: string, md: string } | null>(null);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [beautifiedHtml, setBeautifiedHtml] = useState('');

    useEffect(() => {
        if (record.generatedHtmlPreview) {
            setBeautifiedHtml(beautify.html(record.generatedHtmlPreview, {
                indent_size: 2,
                wrap_line_length: 120,
                preserve_newlines: false,
            }));
        }

        const fetchFiles = async () => {
            if (!record.generatedFileIds) {
                 setIsLoading(false);
                 return;
            }
            if (!githubService.isConfigured()) {
                setError("GitHub is not configured. Cannot fetch files.");
                setIsLoading(false);
                return;
            }
            setIsLoading(true);
            setError(null);
            try {
                const [yamlContent, jsonContent, mdContent] = await Promise.all([
                    githubService.getFileContent(record.generatedFileIds.yaml),
                    githubService.getFileContent(record.generatedFileIds.json),
                    githubService.getFileContent(record.generatedFileIds.md),
                ]);
                setFiles({
                    yaml: yamlContent,
                    json: jsonContent,
                    md: mdContent,
                });
            } catch (err) {
                console.error("Failed to fetch generated files from GitHub:", err);
                setError(err instanceof Error ? err.message : "Could not load one or more files from the repository.");
            } finally {
                setIsLoading(false);
            }
        };
        fetchFiles();
    }, [record.generatedFileIds, record.generatedHtmlPreview]);

    const renderTabContent = () => {
        if (activeTab !== 'preview' && activeTab !== 'htmlSource') {
            if (isLoading) {
                return <div className="p-4 text-center">Loading file contents from GitHub...</div>;
            }
            if (error) {
                 return <div className="p-4 text-center text-red-400">{error}</div>;
            }
            if (!files) {
                 return <div className="p-4 text-center text-gray-500">File contents could not be loaded.</div>;
            }
        }

        switch (activeTab) {
            case 'preview':
                return (
                    <iframe
                        srcDoc={record.generatedHtmlPreview || ''}
                        title="Live HTML Preview"
                        className="w-full h-full border-0 bg-white"
                        sandbox="allow-scripts"
                    />
                );
            case 'htmlSource':
                return (
                    <SyntaxHighlighter language="html" style={vscDarkPlus} customStyle={{ margin: 0, height: '100%', backgroundColor: '#1e1e1e' }} showLineNumbers>
                        {beautifiedHtml}
                    </SyntaxHighlighter>
                );
            case 'summary':
                return (
                    <div className="prose prose-sm sm:prose-base prose-invert max-w-none p-4">
                        <ReactMarkdown remarkPlugins={[remarkGfm]}>{files!.md}</ReactMarkdown>
                    </div>
                );
            case 'plan':
                return <pre className="whitespace-pre-wrap text-sm p-4 font-mono"><code>{files!.yaml}</code></pre>;
            case 'requirements':
                 return <pre className="whitespace-pre-wrap text-sm p-4 font-mono"><code>{files!.json}</code></pre>;
            default:
                return null;
        }
    };
    
    const TabButton: React.FC<{tab: Tab, label: string}> = ({ tab, label }) => (
         <button
            onClick={() => setActiveTab(tab)}
            className={`px-4 py-2 text-sm font-semibold rounded-t-md transition-colors ${
                activeTab === tab
                ? 'bg-[--primary-color] text-black shadow-[0_0_8px_var(--primary-color)]'
                : 'bg-transparent text-gray-400 hover:bg-[--primary-color]/20'
            }`}
        >
            {label}
        </button>
    );

    return (
        <div className="flex flex-col h-full bg-[--card-bg] backdrop-blur-xl border border-[--card-border-color] rounded-md">
            <header className="p-4 border-b border-gray-700">
                <h3 className="font-bold text-lg text-gray-100">{record.name}</h3>
                <p className="text-sm text-gray-400">Workflow Preview</p>
            </header>
            <div className="border-b border-gray-700 flex-shrink-0">
                <nav className="flex space-x-2 px-4">
                    <TabButton tab="preview" label="Preview" />
                    <TabButton tab="htmlSource" label="HTML Source" />
                    <TabButton tab="summary" label="Summary (MD)" />
                    <TabButton tab="plan" label="Plan (YAML)" />
                    <TabButton tab="requirements" label="Reqs (JSON)" />
                </nav>
            </div>
            <main className="flex-grow overflow-auto bg-black/30">
                {renderTabContent()}
            </main>
            <footer className="p-4 border-t border-gray-700 flex-shrink-0 flex justify-end">
                <button
                    onClick={() => onFinalize(record)}
                     className="px-6 py-2 text-sm font-semibold text-black bg-green-500 rounded-md shadow-sm hover:bg-green-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500 shadow-[0_0_8px_#39ff14]"
                >
                    Finalize & Complete
                </button>
            </footer>
        </div>
    );
};

export default InferencePreview;