

import React, { useState, useEffect, useMemo } from 'react';
import { useRecords } from '../hooks/useRecords';
import * as geminiService from '../services/geminiService';
import Editor from '@monaco-editor/react';
import { AppRecord, Category } from '../types';
import { SparklesIcon, BookmarkIcon, SaveIcon } from './icons';
import * as beautify from 'js-beautify';

const loadingMessages = [
    "Contacting AI Web Designer...",
    "Reviewing bookmarked records...",
    "Drafting initial HTML structure...",
    "Applying glass morphism styles...",
    "Embedding interactive JavaScript...",
    "Polishing the final layout...",
    "Almost there, finalizing the page...",
];

const RefineryPage: React.FC = () => {
    const { records, addRecord, toggleBookmark } = useRecords();
    const [prompt, setPrompt] = useState('Create a detailed profile page summarizing all key aspects of the selected records.');
    const [generatedHtml, setGeneratedHtml] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState('');
    const [loadingMessage, setLoadingMessage] = useState(loadingMessages[0]);
    
    const bookmarkedRecords = useMemo(() => records.filter(r => r.isBookmarked), [records]);

    useEffect(() => {
        let interval: number;
        if (isLoading) {
            let i = 0;
            setLoadingMessage(loadingMessages[i]);
            interval = window.setInterval(() => {
                i = (i + 1) % loadingMessages.length;
                setLoadingMessage(loadingMessages[i]);
            }, 2500);
        }
        return () => window.clearInterval(interval);
    }, [isLoading]);

    const handleGenerate = async () => {
        if (!prompt || bookmarkedRecords.length === 0) {
            setError('Please write a prompt and bookmark at least one record from the Records page.');
            return;
        }
        setIsLoading(true);
        setError('');
        try {
            // FIX: Removed `generatedHtml` from the call to prevent the exponential prompt growth bug.
            const html = await geminiService.generateRefinedHtmlPage(bookmarkedRecords, prompt);
            const beautified = beautify.html(html, { indent_size: 2, preserve_newlines: false });
            setGeneratedHtml(beautified);
        } catch (err) {
            const message = err instanceof Error ? err.message : 'Unknown error';
            setError(`Failed to generate page: ${message}`);
        } finally {
            setIsLoading(false);
        }
    }
    
    const handleSave = async () => {
        if (!generatedHtml) {
            alert("Nothing to save. Please generate a page first.");
            return;
        }
        const name = window.prompt("Enter a name for this new refined record:", `Refined Page - ${new Date().toLocaleDateString()}`);
        if (!name) return;
        
        setIsLoading(true);
        try {
            const imagePrompt = `An abstract digital art piece representing the concept of data synthesis and web page creation. Keywords: ${prompt}`;
            const imageUrl = await geminiService.generateImage(imagePrompt, undefined, '16:9');
            
            await addRecord({
                name,
                description: `Refined page based on ${bookmarkedRecords.length} records. User prompt: "${prompt}"`,
                category: Category.AI,
                generatedHtmlPreview: generatedHtml,
                imageUrl,
                status: 'default',
            });
            alert('Saved as new record on the Records page!');
        } catch(err) {
            const message = err instanceof Error ? err.message : 'Unknown error';
            alert(`Failed to save record: ${message}`);
        } finally {
            setIsLoading(false);
        }
    }

    return (
        <div className="space-y-6">
             <style>{`
                @keyframes loading-bar {
                    0% { transform: translateX(-100%); }
                    100% { transform: translateX(100%); }
                }
                .animate-loading-bar {
                    animation: loading-bar 2s linear infinite;
                }
            `}</style>
            <div className="bg-[--card-bg] backdrop-blur-xl border border-[--card-border-color] p-6 rounded-lg shadow-lg">
                <h2 className="text-2xl font-bold text-glow-primary text-[--primary-color] mb-3">AI Refinery</h2>
                <p className="text-gray-400 mb-4">Select records by bookmarking them on the Records page. Then, write a prompt to instruct the AI on how to synthesize them into a single HTML page. You can regenerate to iterate on the result.</p>
                
                {/* Inputs */}
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                    <div className="lg:col-span-1 space-y-4">
                        <div>
                            <label className="flex items-center gap-2 text-sm font-medium text-gray-300 mb-1">
                                <BookmarkIcon className="w-4 h-4"/>
                                <span>Bookmarked Records ({bookmarkedRecords.length})</span>
                            </label>
                            <div className="bg-black/30 p-2 rounded-md border border-gray-700 max-h-48 overflow-y-auto">
                               {bookmarkedRecords.length > 0 ? (
                                   <ul className="space-y-1">
                                       {bookmarkedRecords.map(r => (
                                           <li key={r.id} className="text-sm text-gray-300 p-1.5 rounded flex justify-between items-center bg-gray-800/50">
                                               <span className="truncate">{r.name}</span>
                                               <button onClick={() => toggleBookmark(r.id)} title="Remove bookmark" className="text-gray-500 hover:text-white">&times;</button>
                                           </li>
                                       ))}
                                   </ul>
                               ) : <p className="text-xs text-gray-500 text-center p-4">No records bookmarked.</p>}
                            </div>
                        </div>
                        <div>
                             <label htmlFor="refine-prompt" className="block text-sm font-medium text-gray-300 mb-1">Refinement Prompt</label>
                             <textarea id="refine-prompt" value={prompt} onChange={e => setPrompt(e.target.value)} rows={5} className="w-full px-3 py-2 border rounded-md shadow-sm bg-black/30 border-gray-600 text-white placeholder-gray-500 focus:ring-1 focus:ring-[--primary-color] focus:border-[--primary-color] transition"/>
                        </div>
                        <div className="flex flex-col gap-2">
                            <button onClick={handleGenerate} disabled={isLoading || bookmarkedRecords.length === 0} className="w-full flex items-center justify-center gap-2 px-6 py-2 font-semibold text-black bg-[--primary-color] rounded-md shadow-lg hover:bg-[--primary-color-hover] transition disabled:opacity-50 disabled:cursor-not-allowed shadow-[0_0_8px_var(--primary-color)]">
                                <SparklesIcon className={`w-5 h-5 ${isLoading ? 'animate-spin' : ''}`}/>
                                {isLoading ? 'Generating...' : (generatedHtml ? 'Regenerate' : 'Generate Page')}
                            </button>
                            <button onClick={handleSave} disabled={isLoading || !generatedHtml} className="w-full flex items-center justify-center gap-2 px-6 py-2 font-semibold text-black bg-[--neon-green] rounded-md shadow-lg hover:bg-green-500 transition disabled:opacity-50 disabled:cursor-not-allowed shadow-[0_0_8px_var(--neon-green)]">
                                <SaveIcon className="w-5 h-5"/>
                                Save as New Record
                            </button>
                        </div>
                    </div>
                    {/* Outputs */}
                    <div className="lg:col-span-2 grid grid-cols-1 grid-rows-2 gap-6 h-[70vh] min-h-[500px] relative">
                        {isLoading && (
                            <div className="absolute inset-0 bg-black/70 backdrop-blur-sm z-10 flex flex-col items-center justify-center gap-4 rounded-md">
                                <SparklesIcon className="w-12 h-12 text-[--primary-color] animate-pulse" />
                                <p className="text-lg font-semibold text-gray-200 transition-opacity duration-500">{loadingMessage}</p>
                                <div className="w-3/4 h-1 bg-gray-700 rounded-full overflow-hidden">
                                    <div className="h-full bg-[--primary-color] animate-loading-bar rounded-full"></div>
                                </div>
                            </div>
                        )}
                        <div className="flex flex-col bg-[--card-bg] backdrop-blur-xl border border-[--card-border-color] rounded-md overflow-hidden">
                           <h3 className="text-sm p-2 bg-black/50 border-b border-gray-700 text-gray-300">Raw HTML Output</h3>
                           <Editor
                                theme="vs-dark"
                                language="html"
                                value={generatedHtml}
                                onChange={(value) => setGeneratedHtml(value || '')}
                                options={{ minimap: { enabled: false }, wordWrap: 'on' }}
                                loading={<div className="text-center p-4 text-gray-500">Editor loading...</div>}
                           />
                        </div>
                        <div className="flex flex-col bg-white rounded-md border border-gray-700 overflow-hidden">
                            <h3 className="text-sm p-2 bg-black/50 border-b border-gray-700 text-gray-300">Live Preview</h3>
                            <iframe
                                srcDoc={generatedHtml}
                                title="Live Preview"
                                className="w-full h-full border-0"
                                sandbox="allow-scripts"
                            />
                        </div>
                    </div>
                </div>

                {error && <div className="mt-4 p-3 bg-red-900/50 text-red-300 text-sm rounded-md">{error}</div>}
            </div>
        </div>
    );
};

export default RefineryPage;
