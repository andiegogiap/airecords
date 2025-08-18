
import React, { useState } from 'react';
import * as geminiService from '../services/geminiService';
import { WebsiteAnalysis } from '../types';
import { SparklesIcon } from './icons';
import CollapsibleSection from './CollapsibleSection';

// This is the combined result type we will use in the component's state
type AnalysisResult = WebsiteAnalysis & {
    snapshotUrl: string;
};

const OrchestrationPage: React.FC = () => {
    const [url, setUrl] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [analysis, setAnalysis] = useState<AnalysisResult | null>(null);
    
    const isValidUrl = (urlString: string) => {
        try {
            // Use a forgiving regex to allow URLs without protocol for user convenience
            if (!urlString.startsWith('http://') && !urlString.startsWith('https://')) {
                urlString = 'https://' + urlString;
            }
            new URL(urlString);
            return true;
        } catch (e) {
            return false;
        }
    }

    const handleAnalyze = async (e: React.FormEvent) => {
        e.preventDefault();
        setError(null);
        setAnalysis(null);

        if (!url || !isValidUrl(url)) {
            setError('Please enter a valid URL (e.g., example.com)');
            return;
        }

        setIsLoading(true);
        try {
            let fullUrl = url;
            if (!url.startsWith('http://') && !url.startsWith('https://')) {
                fullUrl = 'https://' + url;
            }
            const analysisResult = await geminiService.analyzeWebsite(fullUrl);
            const snapshotUrl = `https://s0.wordpress.com/mshots/v1/${encodeURIComponent(fullUrl)}?w=1200&h=900`;
            
            setAnalysis({
                ...analysisResult,
                snapshotUrl,
            });

        } catch (err) {
            const message = err instanceof Error ? err.message : 'An unknown error occurred during analysis.';
            setError(`Analysis failed: ${message}`);
            console.error(err);
        } finally {
            setIsLoading(false);
        }
    };

    const renderAnalysis = () => {
        if (isLoading) {
            return (
                <div className="flex flex-col items-center justify-center h-full text-center text-gray-400">
                    <SparklesIcon className="w-16 h-16 text-[--primary-color] animate-pulse mb-4"/>
                    <p className="font-semibold text-lg">Analyzing website...</p>
                    <p>This may take a moment.</p>
                </div>
            );
        }

        if (error) {
            return <div className="p-4 bg-red-900/50 text-red-300 rounded-md">{error}</div>;
        }

        if (!analysis) {
            return (
                 <div className="flex flex-col items-center justify-center h-full text-center text-gray-400">
                    <p>Enter a URL to begin your site analysis.</p>
                </div>
            );
        }

        return (
            <div className="space-y-8">
                {/* Top Section: 1x2 */}
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-start">
                    <div className="bg-black/20 p-2 border border-[--card-border-color] rounded-lg">
                        <img src={analysis.snapshotUrl} alt={`Snapshot of ${url}`} className="rounded-md w-full" />
                    </div>
                    <div>
                        <h3 className="text-xl font-bold text-gray-100 mb-2">Description</h3>
                        <p className="text-gray-300 leading-relaxed">{analysis.description}</p>
                        
                        <h3 className="text-xl font-bold text-gray-100 mt-6 mb-2">Key Pages / Site Map</h3>
                        <blockquote className="border-l-4 border-[--primary-color] pl-4 text-gray-400 italic space-y-1">
                            {analysis.pages.map((page, index) => <p key={index}>{page}</p>)}
                        </blockquote>
                    </div>
                </div>

                {/* Middle Section: In-depth Analysis */}
                <div>
                    <h2 className="text-2xl font-bold text-glow-cyan text-[--neon-cyan] mb-4">In-Depth Analysis</h2>
                    <div className="space-y-4">
                        {analysis.inDepthAnalysis.map((item, index) => (
                            <CollapsibleSection key={index} title={item.title}>
                                <p className="whitespace-pre-wrap">{item.content}</p>
                            </CollapsibleSection>
                        ))}
                    </div>
                </div>
                
                {/* Bottom Section: Tech Stack */}
                 <div>
                    <h2 className="text-2xl font-bold text-glow-cyan text-[--neon-cyan] mb-4">Identified Technology Stack</h2>
                    <div className="flex flex-wrap gap-3">
                        {analysis.techStack.length > 0 ? analysis.techStack.map((tech, index) => (
                            <span key={index} className="px-3 py-1.5 text-sm font-semibold rounded-full bg-gray-700 text-gray-200">
                                {tech}
                            </span>
                        )) : <p className="text-sm text-gray-400">No specific technologies identified.</p>}
                    </div>
                </div>
            </div>
        );
    };

    return (
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
            {/* Left Menu Form */}
            <div className="md:col-span-1">
                <div className="bg-[--card-bg] backdrop-blur-xl border border-[--card-border-color] p-6 rounded-lg shadow-lg sticky top-24">
                    <h2 className="text-xl font-bold text-glow-primary text-[--primary-color] mb-4">
                        Site Analysis
                    </h2>
                    <form onSubmit={handleAnalyze} className="space-y-4">
                        <div>
                            <label htmlFor="url-input" className="block text-sm font-medium text-gray-300 mb-1">Website URL</label>
                            <input 
                                type="text" 
                                id="url-input"
                                value={url}
                                onChange={e => setUrl(e.target.value)}
                                placeholder="example.com"
                                required
                                className="w-full px-3 py-2 border rounded-md shadow-sm focus:ring-1 focus:ring-[--primary-color] focus:border-[--primary-color] transition bg-black/30 border-gray-600 text-white placeholder-gray-500 disabled:opacity-50"
                                disabled={isLoading}
                            />
                        </div>
                        <button
                            type="submit"
                            disabled={isLoading}
                            className="w-full flex items-center justify-center gap-2 px-6 py-2 font-semibold text-black bg-[--primary-color] rounded-md shadow-lg hover:bg-[--primary-color-hover] transition disabled:opacity-50 disabled:cursor-wait shadow-[0_0_8px_var(--primary-color)]"
                        >
                            <SparklesIcon className="w-5 h-5"/>
                            {isLoading ? 'Analyzing...' : 'Analyze Website'}
                        </button>
                    </form>
                </div>
            </div>
            
            {/* Right Main Page */}
            <div className="md:col-span-3">
                <div className="bg-[--card-bg] backdrop-blur-xl border border-[--card-border-color] p-6 rounded-lg shadow-lg min-h-[80vh]">
                   {renderAnalysis()}
                </div>
            </div>
        </div>
    );
};

export default OrchestrationPage;
