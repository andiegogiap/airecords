

import React from 'react';
import { AppRecord, Category } from '../types';
import { PencilIcon, TrashIcon, RefreshIcon, BookmarkIcon, LightbulbIcon, WandIcon } from './icons';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';

interface RecordCardProps {
  record: AppRecord;
  onEdit: (record: AppRecord) => void;
  onDelete: (id: string) => void;
  onImageClick: (url: string) => void;
  onRegenerateImage: (record: AppRecord) => void;
  isRegenerating: boolean;
  onToggleBookmark: (id: string) => void;
  onImprove: (record: AppRecord) => void;
  onRefine: (record: AppRecord) => void;
}

const categoryStyles: { [key in Category]: string } = {
  [Category.USER]: 'bg-blue-500/30 text-blue-300 ring-1 ring-blue-500',
  [Category.AI]: 'bg-purple-500/30 text-purple-300 ring-1 ring-purple-500',
  [Category.SYSTEM]: 'bg-green-500/30 text-green-300 ring-1 ring-green-500',
};

const RecordCard: React.FC<RecordCardProps> = ({ record, onEdit, onDelete, onImageClick, onRegenerateImage, isRegenerating, onToggleBookmark, onImprove, onRefine }) => {
  return (
    <div className="bg-[--card-bg] backdrop-blur-xl rounded-lg shadow-[0_0_10px_rgba(0,255,255,0.1)] hover:shadow-[0_0_25px_rgba(0,255,255,0.3)] transition-shadow duration-300 flex flex-col border border-[--card-border-color] hover:border-[--neon-cyan]/70 relative">
      <button 
        onClick={() => onToggleBookmark(record.id)} 
        className="absolute top-3 right-3 z-10 p-1.5 rounded-full bg-black/30 hover:bg-black/70 transition-colors"
        aria-label={record.isBookmarked ? "Remove bookmark" : "Add bookmark"}
        title={record.isBookmarked ? "Remove bookmark" : "Add bookmark"}
      >
        <BookmarkIcon className={`w-5 h-5 transition-colors ${record.isBookmarked ? 'fill-yellow-400 text-yellow-400' : 'text-gray-400 hover:text-white'}`} />
      </button>

      {record.imageUrl && (
          <button 
            onClick={() => onImageClick(record.imageUrl!)} 
            className="w-full aspect-video block overflow-hidden rounded-t-lg group"
            aria-label={`View image for ${record.name}`}
          >
            <img 
              src={record.imageUrl} 
              alt={`Generated visual for ${record.name}`}
              className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300" 
            />
          </button>
      )}
      <div className="p-5 flex-grow flex flex-col">
        <div className="flex-grow">
          <span className={`inline-block px-2.5 py-0.5 text-xs font-semibold rounded-full ${categoryStyles[record.category]}`}>
            {record.category}
          </span>
          <h3 className="mt-3 mb-2 text-lg font-bold text-gray-100">
            {record.name}
          </h3>
          <div className="text-gray-300 text-sm leading-relaxed prose prose-sm prose-invert max-w-none">
            <ReactMarkdown remarkPlugins={[remarkGfm]}>
              {record.description || 'No description provided.'}
            </ReactMarkdown>
          </div>
        </div>

        <div className="mt-6 pt-4 border-t border-gray-700/50 flex justify-end items-center gap-2 flex-wrap">
          <button
              onClick={() => onImprove(record)}
              className="flex items-center gap-1.5 px-3 py-1.5 text-sm font-medium text-yellow-300 bg-yellow-900/40 rounded-md hover:bg-yellow-900/60 transition-colors"
              aria-label={`AI Improve ${record.name}`}
            >
              <LightbulbIcon className="w-4 h-4" />
              Improve
          </button>
          <button
              onClick={() => onRefine(record)}
              className="flex items-center gap-1.5 px-3 py-1.5 text-sm font-medium text-purple-300 bg-purple-900/40 rounded-md hover:bg-purple-900/60 transition-colors"
              aria-label={`AI Refine ${record.name}`}
            >
              <WandIcon className="w-4 h-4" />
              Refine
          </button>
          <div className="flex-grow"></div>
          {record.imageUrl && (
            <button
              onClick={() => onRegenerateImage(record)}
              disabled={isRegenerating}
              className="flex items-center gap-1.5 p-2 text-sm font-medium text-cyan-300 bg-cyan-900/40 rounded-md hover:bg-cyan-900/60 transition-colors disabled:opacity-50 disabled:cursor-wait"
              aria-label={`Regenerate image for ${record.name}`}
              title="Regenerate Image"
            >
              <RefreshIcon className={`w-4 h-4 ${isRegenerating ? 'animate-spin' : ''}`} />
            </button>
          )}
          <button
            onClick={() => onEdit(record)}
            className="flex items-center gap-1.5 p-2 text-sm font-medium text-gray-300 bg-gray-700 rounded-md hover:bg-gray-600 transition-colors"
            aria-label={`Edit ${record.name}`}
            title="Edit"
          >
            <PencilIcon className="w-4 h-4" />
          </button>
          <button
            onClick={() => onDelete(record.id)}
            className="flex items-center gap-1.5 p-2 text-sm font-medium text-red-400 bg-red-900/40 rounded-md hover:bg-red-900/60 transition-colors"
            aria-label={`Delete ${record.name}`}
            title="Delete"
          >
            <TrashIcon className="w-4 h-4" />
          </button>
        </div>
      </div>
    </div>
  );
};

export default RecordCard;