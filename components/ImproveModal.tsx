
import React, { useState, useEffect } from 'react';
import { AppRecord, Suggestion, Category } from '../types';
import * as geminiService from '../services/geminiService';
import { XIcon } from './icons';

interface ImproveModalProps {
    record: AppRecord;
    onClose: () => void;
    onSave: (id: string, data: Omit<AppRecord, 'id'>) => void;
}

const ImproveModal: React.FC<ImproveModalProps> = ({ record, onClose, onSave }) => {
    const [suggestion, setSuggestion] = useState<Suggestion | null>(null);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState('');

    const [name, setName] = useState(record.name);
    const [description, setDescription] = useState(record.description);
    const [category, setCategory] = useState(record.category);
    const [bookmarkOnSave, setBookmarkOnSave] = useState(false);

    useEffect(() => {
        const fetchSuggestion = async () => {
            setIsLoading(true);
            setError('');
            try {
                const result = await geminiService.generateRecordSuggestions(record);
                setSuggestion(result);
                setName(result.name);
                setDescription(result.description);
                setCategory(result.category);
            } catch (err) {
                const message = err instanceof Error ? err.message : 'Unknown error';
                setError(`Failed to get suggestions from AI: ${message}`);
            } finally {
                setIsLoading(false);
            }
        };
        fetchSuggestion();
    }, [record]);

    const handleSave = () => {
        const finalData: Omit<AppRecord, 'id'> = {
            ...record,
            name,
            description,
            category,
            isBookmarked: bookmarkOnSave || record.isBookmarked,
        };
        // The 'id' property should not be in the payload for updateRecord
        delete (finalData as any).id;
        onSave(record.id, finalData);
    };
    
    const inputClasses = "w-full px-3 py-2 border rounded-md shadow-sm focus:ring-1 focus:ring-[--primary-color] focus:border-[--primary-color] transition bg-black/30 border-gray-600 text-white placeholder-gray-500";
    const originalValueClasses = "text-xs text-gray-400 mt-1 pl-1 italic truncate";
    
    const renderContent = () => {
        if (isLoading) return <div className="text-center p-8">Analyzing record with AI...</div>;
        if (error) return <div className="text-center p-8 text-red-400">{error}</div>;

        return (
            <form onSubmit={(e) => { e.preventDefault(); handleSave(); }} className="space-y-4">
                 <div>
                    <label htmlFor="improve-name" className="block text-sm font-medium text-gray-300 mb-1">Suggested Name</label>
                    <input id="improve-name" type="text" value={name} onChange={e => setName(e.target.value)} className={inputClasses} />
                    <p className={originalValueClasses}>Original: {record.name}</p>
                 </div>
                 <div>
                    <label htmlFor="improve-desc" className="block text-sm font-medium text-gray-300 mb-1">Suggested Description</label>
                    <textarea id="improve-desc" value={description} onChange={e => setDescription(e.target.value)} rows={4} className={inputClasses}></textarea>
                    <p className={originalValueClasses}>Original: {record.description}</p>
                 </div>
                 <div>
                    <label htmlFor="improve-category" className="block text-sm font-medium text-gray-300 mb-1">Suggested Category</label>
                    <select id="improve-category" value={category} onChange={e => setCategory(e.target.value as Category)} className={inputClasses}>
                        {Object.values(Category).map(cat => <option key={cat} value={cat}>{cat}</option>)}
                    </select>
                     <p className={originalValueClasses}>Original: {record.category}</p>
                 </div>
            </form>
        );
    }

    return (
        <div className="fixed inset-0 bg-black/80 backdrop-blur-sm flex items-center justify-center z-50 p-4" onClick={onClose}>
            <div className="bg-[--card-bg-opaque] border border-[--card-border-color] rounded-lg shadow-2xl w-full max-w-2xl animate-scale-in" onClick={e => e.stopPropagation()}>
                <header className="flex justify-between items-center p-4 border-b border-[--primary-color]/30">
                    <h2 className="text-xl font-bold text-glow-primary text-[--primary-color]">AI Improvement</h2>
                    <button onClick={onClose}><XIcon className="w-6 h-6"/></button>
                </header>
                <div className="p-6">
                    {renderContent()}
                </div>
                <footer className="p-4 border-t border-[--primary-color]/30 flex justify-between items-center">
                    <div className="flex items-center">
                        <input type="checkbox" id="bookmark-on-save" checked={bookmarkOnSave} onChange={e => setBookmarkOnSave(e.target.checked)} className="h-4 w-4 rounded border-gray-300 text-[--primary-color] focus:ring-[--primary-color] bg-gray-700" />
                        <label htmlFor="bookmark-on-save" className="ml-2 block text-sm text-gray-300">Bookmark on save</label>
                    </div>
                    <div className="flex gap-4">
                        <button type="button" onClick={onClose} className="px-4 py-2 text-sm font-medium text-gray-200 bg-gray-700 border border-gray-600 rounded-md shadow-sm hover:bg-gray-600">Cancel</button>
                        <button type="button" onClick={handleSave} disabled={isLoading} className="px-6 py-2 text-sm font-semibold text-black bg-[--primary-color] rounded-md shadow-lg hover:bg-[--primary-color-hover] transition shadow-[0_0_8px_var(--primary-color)] disabled:opacity-50">Apply & Save</button>
                    </div>
                </footer>
            </div>
             <style>{`
                @keyframes scale-in {
                    from { transform: scale(0.95); opacity: 0; }
                    to { transform: scale(1); opacity: 1; }
                }
                .animate-scale-in {
                    animation: scale-in 0.2s ease-out forwards;
                }
            `}</style>
        </div>
    );
};

export default ImproveModal;
