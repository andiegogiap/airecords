import React, { useState, useEffect, useRef, useCallback } from 'react';
import Editor from '@monaco-editor/react';
import { FolderIcon, FileIcon, SaveIcon, TrashIcon } from './icons';
import * as githubService from '../services/fileService'; // Repurposed fileService

type GitHubContent = {
  name: string;
  path: string;
  sha: string;
  size: number;
  type: 'file' | 'dir';
  html_url: string;
};

const GitHubPage: React.FC = () => {
    const [token, setToken] = useState(localStorage.getItem('github_token') || '');
    const [owner, setOwner] = useState(localStorage.getItem('github_owner') || '');
    const [repo, setRepo] = useState(localStorage.getItem('github_repo') || '');
    const [isAuthenticated, setIsAuthenticated] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [isLoading, setIsLoading] = useState(false);
    
    const [fileTree, setFileTree] = useState<GitHubContent[]>([]);
    const [currentPath, setCurrentPath] = useState('');
    const [selectedFile, setSelectedFile] = useState<GitHubContent | null>(null);
    const [fileContent, setFileContent] = useState('');
    const [isDirty, setIsDirty] = useState(false);

    useEffect(() => {
        if (githubService.isConfigured()) {
            handleAuth();
        }
    }, []);

    const handleAuth = async () => {
        setIsLoading(true);
        setError(null);
        localStorage.setItem('github_token', token);
        localStorage.setItem('github_owner', owner);
        localStorage.setItem('github_repo', repo);

        try {
            await githubService.getRepo();
            setIsAuthenticated(true);
            loadContents('');
        } catch (err) {
            setError(err instanceof Error ? err.message : "Authentication failed. Check token, owner, and repo name.");
            setIsAuthenticated(false);
            localStorage.removeItem('github_token');
        } finally {
            setIsLoading(false);
        }
    };

    const loadContents = async (path: string) => {
        setIsLoading(true);
        setError(null);
        try {
            const contents = await githubService.getContents(path);
            setFileTree(contents);
            setCurrentPath(path);
            setSelectedFile(null);
            setFileContent('');
        } catch (err) {
            setError(err instanceof Error ? err.message : "Could not load contents.");
        } finally {
            setIsLoading(false);
        }
    };

    const handleFileClick = async (file: GitHubContent) => {
        if (file.type === 'dir') {
            loadContents(file.path);
        } else {
            if (isDirty && !window.confirm("You have unsaved changes. Discard them?")) return;
            setIsLoading(true);
            setSelectedFile(file);
            try {
                const content = await githubService.getFileContent(file.path);
                setFileContent(content);
                setIsDirty(false);
            } catch (err) {
                setError(err instanceof Error ? err.message : "Could not load file content.");
            } finally {
                setIsLoading(false);
            }
        }
    };

    const handleSave = async () => {
        if (!selectedFile || !isDirty) return;
        
        const commitMessage = prompt("Enter commit message:", `Update ${selectedFile.name}`);
        if (!commitMessage) return;

        setIsLoading(true);
        try {
            const result = await githubService.createOrUpdateFile(selectedFile.path, fileContent, commitMessage, selectedFile.sha);
            setSelectedFile(prev => prev ? { ...prev, sha: result.content.sha } : null);
            setIsDirty(false);
            // Optimistically update file in tree if needed, or just reload current path
            loadContents(currentPath);
        } catch (err) {
            setError(err instanceof Error ? err.message : "Failed to save file.");
        } finally {
            setIsLoading(false);
        }
    };
    
    const handleLogout = () => {
        localStorage.removeItem('github_token');
        localStorage.removeItem('github_owner');
        localStorage.removeItem('github_repo');
        setIsAuthenticated(false);
        setToken('');
        setOwner('');
        setRepo('');
        setFileTree([]);
        setCurrentPath('');
        setSelectedFile(null);
    }
    
    const renderAuth = () => (
        <div className="max-w-md mx-auto p-8 bg-[--card-bg] backdrop-blur-xl border border-[--card-border-color] rounded-lg shadow-lg">
            <h3 className="text-xl font-bold text-glow-primary text-[--primary-color] mb-4">Connect to GitHub</h3>
            <p className="text-gray-400 mb-6 text-sm">Provide a Personal Access Token (classic) with `repo` scope to access and manage a repository.</p>
            {error && <div className="bg-red-900/50 text-red-300 p-3 rounded-md mb-4">{error}</div>}
            <form onSubmit={(e) => { e.preventDefault(); handleAuth(); }} className="space-y-4">
                <input type="text" value={owner} onChange={e => setOwner(e.target.value)} placeholder="Repository Owner (e.g., google)" required className="w-full px-3 py-2 border rounded-md bg-black/30 border-gray-600 text-white placeholder-gray-500 focus:ring-[--primary-color] focus:border-[--primary-color]"/>
                <input type="text" value={repo} onChange={e => setRepo(e.target.value)} placeholder="Repository Name (e.g., gemini-api-php)" required className="w-full px-3 py-2 border rounded-md bg-black/30 border-gray-600 text-white placeholder-gray-500 focus:ring-[--primary-color] focus:border-[--primary-color]"/>
                <input type="password" value={token} onChange={e => setToken(e.target.value)} placeholder="GitHub Personal Access Token" required className="w-full px-3 py-2 border rounded-md bg-black/30 border-gray-600 text-white placeholder-gray-500 focus:ring-[--primary-color] focus:border-[--primary-color]"/>
                <button type="submit" disabled={isLoading || !token || !owner || !repo} className="w-full px-6 py-2 font-semibold text-black bg-[--primary-color] rounded-md shadow-lg hover:bg-[--primary-color-hover] transition disabled:opacity-50 disabled:cursor-not-allowed shadow-[0_0_8px_var(--primary-color)]">
                    {isLoading ? 'Connecting...' : 'Connect to Repository'}
                </button>
            </form>
        </div>
    );
    
    const renderExplorer = () => (
        <div className="bg-[--card-bg] backdrop-blur-xl border border-[--card-border-color] p-4 sm:p-6 rounded-lg shadow-lg max-w-full mx-auto min-h-[80vh]">
            <h2 className="text-2xl font-bold text-glow-primary text-[--primary-color] mb-4 border-b border-[--primary-color]/30 pb-3 flex justify-between items-center">
                GitHub Explorer: {owner}/{repo}
                <button onClick={handleLogout} className="px-3 py-1.5 text-sm font-medium text-gray-200 bg-gray-700 border border-gray-600 rounded-md hover:bg-gray-600">Logout</button>
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 h-[70vh]">
                <div className="md:col-span-1 border-r border-gray-700 pr-4 overflow-y-auto">
                    <div className="space-y-1">
                        {currentPath && (
                             <button onClick={() => loadContents(currentPath.substring(0, currentPath.lastIndexOf('/')))} className="flex items-center gap-2 px-2 py-1.5 rounded-md text-sm w-full text-left hover:bg-gray-800/60 text-gray-300">
                                <FolderIcon className="w-5 h-5 text-gray-400"/>
                                <span>..</span>
                            </button>
                        )}
                        {isLoading && !fileTree.length && <p>Loading...</p>}
                        {fileTree.map(item => (
                            <button key={item.sha} onClick={() => handleFileClick(item)} className={`flex items-center gap-3 w-full text-left px-2 py-1.5 rounded-md text-sm transition-colors ${selectedFile?.path === item.path ? 'bg-[--primary-color]/20' : 'hover:bg-gray-800/60'}`}>
                                {item.type === 'dir' ? <FolderIcon className="w-5 h-5 text-cyan-400 flex-shrink-0" /> : <FileIcon className="w-5 h-5 text-gray-400 flex-shrink-0" />}
                                <span className={`truncate font-semibold ${selectedFile?.path === item.path ? 'text-gray-100' : 'text-gray-300'}`}>{item.name}</span>
                            </button>
                        ))}
                    </div>
                </div>
                <div className="md:col-span-2 overflow-hidden flex flex-col bg-black/30 rounded-md border border-gray-700">
                    {selectedFile ? (
                        <>
                            <div className="flex justify-between items-center p-2 border-b border-gray-700 flex-shrink-0">
                                <span className="font-semibold text-gray-300">{selectedFile.name}</span>
                                <button onClick={handleSave} disabled={!isDirty || isLoading} className="flex items-center gap-1.5 px-3 py-1 text-sm font-semibold text-black bg-[--primary-color] rounded-md hover:bg-[--primary-color-hover] disabled:opacity-50 disabled:cursor-not-allowed transition shadow-[0_0_8px_var(--primary-color)]">
                                    <SaveIcon className="w-4 h-4"/>
                                    {isLoading ? 'Saving...' : 'Commit Changes'}
                                </button>
                            </div>
                            <Editor
                                height="100%"
                                theme="vs-dark"
                                path={selectedFile.path}
                                value={fileContent}
                                onChange={(value) => { setFileContent(value || ''); setIsDirty(true); }}
                                onMount={(editor) => editor.focus()}
                                options={{ minimap: { enabled: false } }}
                                loading={<p>Loading editor...</p>}
                            />
                        </>
                    ) : (
                        <div className="flex items-center justify-center h-full text-gray-500 flex-col gap-4 text-center">
                            <FolderIcon className="w-16 h-16 text-gray-600"/>
                            <p>Select a file to view or edit.</p>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );

    return isAuthenticated ? renderExplorer() : renderAuth();
};

export default GitHubPage;