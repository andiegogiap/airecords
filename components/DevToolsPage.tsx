import React, { useState } from 'react';
import { clearAllRecordsDB, addRecordDB, getAllRecords } from '../services/dbService';
import { initialRecordsForSeed } from '../services/initialData';
import Editor from '@monaco-editor/react';
import { AppRecord } from '../types';

const DevToolsPage: React.FC = () => {
    const [message, setMessage] = useState('');
    const [jsonContent, setJsonContent] = useState('');
    const [isJsonEditorVisible, setIsJsonEditorVisible] = useState(false);

    const resetMessage = () => {
        setTimeout(() => setMessage(''), 5000);
    }

    const handleClearRecords = async () => {
        if(window.confirm('Are you sure you want to delete ALL records? This cannot be undone.')) {
            try {
                await clearAllRecordsDB();
                setMessage('All records have been cleared. Refresh the page to see changes.');
                resetMessage();
            } catch (error) {
                setMessage('Error clearing records. See console for details.');
                console.error(error);
                resetMessage();
            }
        }
    }
    
    const handleSeedData = async () => {
        if(window.confirm('This will delete all current records and re-seed with initial data. Continue?')) {
            try {
                await clearAllRecordsDB();
                for (const record of initialRecordsForSeed) {
                    await addRecordDB(record);
                }
                setMessage('Database has been cleared and re-seeded. Refresh the page to see changes.');
                resetMessage();
            } catch(error) {
                setMessage('Error seeding data. See console for details.');
                console.error(error);
                resetMessage();
            }
        }
    }

    const loadRecordsAsJson = async () => {
        try {
            const records = await getAllRecords();
            setJsonContent(JSON.stringify(records, null, 2));
            setIsJsonEditorVisible(true);
        } catch (error) {
             setMessage('Error loading records as JSON. See console.');
             console.error(error);
             resetMessage();
        }
    }

    const applyJsonToDb = async () => {
        if (!window.confirm('This will OVERWRITE the entire database with the content from the editor. This is a destructive action. Are you sure?')) {
            return;
        }
        try {
            const records: AppRecord[] = JSON.parse(jsonContent);
            if (!Array.isArray(records)) {
                throw new Error("JSON is not a valid array of records.");
            }
            await clearAllRecordsDB();
            for (const record of records) {
                // simple validation
                if (record.id && record.name) {
                    await addRecordDB(record);
                }
            }
            setMessage('Successfully applied JSON to the database. Refresh to see changes.');
            setIsJsonEditorVisible(false);
            resetMessage();
        } catch(error) {
            setMessage(`Error applying JSON: ${error instanceof Error ? error.message : 'Unknown error'}. Check console.`);
            console.error(error);
            resetMessage();
        }
    }

    const getMessageColor = () => {
        return message.startsWith('Error') ? 'bg-red-900/50 text-red-200' : 'bg-green-900/50 text-green-200';
    }

    return (
        <div className="bg-[--card-bg] backdrop-blur-xl border border-[--card-border-color] p-6 rounded-lg shadow-lg max-w-4xl mx-auto">
            <h2 className="text-2xl font-bold text-glow-primary text-[--primary-color] mb-6 border-b border-[--primary-color]/30 pb-3">
                Developer Tools
            </h2>
            <div className="space-y-6">
                <p className="text-sm text-gray-400">Use these tools to manage the application's local state. Actions here are destructive and cannot be undone.</p>
                
                {message && (
                    <div className={`p-3 rounded-md text-sm ${getMessageColor()} transition-opacity duration-300`}>
                        {message}
                    </div>
                )}

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <button onClick={handleSeedData} className="px-4 py-2 font-semibold text-black bg-blue-500 rounded-md hover:bg-blue-600 transition shadow-[0_0_8px_var(--neon-blue)]">
                        Reset & Seed Data
                    </button>
                    <button onClick={handleClearRecords} className="px-4 py-2 font-semibold text-black bg-red-500 rounded-md hover:bg-red-600 transition shadow-[0_0_8px_#f00]">
                        Clear All Records
                    </button>
                </div>

                <div className="border-t border-gray-700 pt-6">
                    <h3 className="text-lg font-semibold text-gray-200 mb-2">Database JSON Editor</h3>
                    <p className="text-sm text-gray-400 mb-4">Load all records from the database as editable JSON. Apply changes to overwrite the entire DB.</p>
                    
                    {!isJsonEditorVisible ? (
                        <button onClick={loadRecordsAsJson} className="px-4 py-2 font-semibold text-black bg-purple-500 rounded-md hover:bg-purple-600 transition shadow-[0_0_8px_#c000ff]">
                            Load Records as JSON
                        </button>
                    ) : (
                        <div className="space-y-4">
                            <div className="h-96 w-full bg-black/30 rounded-md border border-gray-600">
                                <Editor
                                    height="100%"
                                    theme="vs-dark"
                                    language="json"
                                    value={jsonContent}
                                    onChange={(value) => setJsonContent(value || '')}
                                    options={{ minimap: { enabled: false } }}
                                />
                            </div>
                            <div className="flex gap-4 justify-end">
                                <button onClick={() => setIsJsonEditorVisible(false)} className="px-4 py-2 font-semibold text-gray-300 bg-gray-600 rounded-md hover:bg-gray-700 transition">
                                    Cancel
                                </button>
                                <button onClick={applyJsonToDb} className="px-4 py-2 font-semibold text-black bg-green-500 rounded-md hover:bg-green-600 transition shadow-[0_0_8px_#39ff14]">
                                    Apply Changes to DB
                                </button>
                            </div>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}

export default DevToolsPage;