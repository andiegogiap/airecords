import React, { useState, useEffect } from 'react';
import { AppRecord, Category, ImageStyle, ImageSize } from '../types';
import { generateDescription } from '../services/geminiService';
import { SparklesIcon } from './icons';

interface RecordFormProps {
  editingRecord: AppRecord | null;
  onSave: (recordData: Omit<AppRecord, 'id' | 'imageUrl'>, id?: string) => void;
  onCancelEdit: () => void;
  isSaving: boolean;
}

const RecordForm: React.FC<RecordFormProps> = ({ editingRecord, onSave, onCancelEdit, isSaving }) => {
  const [name, setName] = useState('');
  const [description, setDescription] = useState('');
  const [category, setCategory] = useState<Category>(Category.USER);
  const [imageStyle, setImageStyle] = useState<ImageStyle>(ImageStyle.ILLUSTRATION);
  const [imageSize, setImageSize] = useState<ImageSize>('1:1');
  const [isGenerating, setIsGenerating] = useState(false);

  useEffect(() => {
    if (editingRecord) {
      setName(editingRecord.name);
      setDescription(editingRecord.description);
      setCategory(editingRecord.category);
      setImageStyle(editingRecord.imageStyle || ImageStyle.ILLUSTRATION);
      setImageSize(editingRecord.imageSize || '1:1');
    } else {
      setName('');
      setDescription('');
      setCategory(Category.USER);
      setImageStyle(ImageStyle.ILLUSTRATION);
      setImageSize('1:1');
    }
  }, [editingRecord]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name) {
      alert('Record Name is required.');
      return;
    }
    onSave({ name, description, category, imageStyle, imageSize }, editingRecord?.id);
    if (!editingRecord) {
      setName('');
      setDescription('');
      setCategory(Category.USER);
      setImageStyle(ImageStyle.ILLUSTRATION);
      setImageSize('1:1');
    }
  };

  const handleGenerateDescription = async () => {
    if (!name) {
      alert('Please enter a Record Name first to generate a description.');
      return;
    }
    setIsGenerating(true);
    try {
      const generatedDesc = await generateDescription(name);
      setDescription(generatedDesc);
    } catch (error) {
      console.error('Failed to generate description:', error);
      alert('Could not generate a description. Please check the console for details.');
    } finally {
      setIsGenerating(false);
    }
  };

  const inputClasses = "w-full px-3 py-2 border rounded-md shadow-sm focus:ring-1 focus:ring-[--primary-color] focus:border-[--primary-color] transition bg-black/30 border-gray-600 text-white placeholder-gray-500 disabled:opacity-50";

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <fieldset disabled={isSaving}>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <label htmlFor="record-name" className="block text-sm font-medium text-gray-300 mb-1">
              Record Name
            </label>
            <input
              type="text"
              id="record-name"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="e.g., User Preferences"
              required
              className={inputClasses}
            />
          </div>
          <div>
            <label htmlFor="record-category" className="block text-sm font-medium text-gray-300 mb-1">
              Category
            </label>
            <select
              id="record-category"
              value={category}
              onChange={(e) => setCategory(e.target.value as Category)}
              required
              className={inputClasses}
            >
              {Object.values(Category).map((cat) => (
                <option key={cat} value={cat}>{cat} Data</option>
              ))}
            </select>
          </div>
        </div>
        <div>
          <label htmlFor="record-description" className="block text-sm font-medium text-gray-300 mb-1">
            Description
          </label>
          <div className="relative">
            <textarea
              id="record-description"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="A brief description of the record."
              rows={3}
              className={`${inputClasses} pr-28`}
            ></textarea>
            <button
              type="button"
              onClick={handleGenerateDescription}
              disabled={isGenerating || isSaving}
              className="absolute top-2 right-2 flex items-center gap-1.5 px-2 py-1.5 text-xs font-semibold rounded-md bg-gray-600 hover:bg-gray-500 text-gray-200 disabled:opacity-50 disabled:cursor-wait transition"
            >
              {isGenerating ? (
                'Generating...'
              ) : (
                <>
                  <SparklesIcon className="w-4 h-4" />
                  <span>AI Describe</span>
                </>
              )}
            </button>
          </div>
        </div>

        <div className="border-t border-gray-700 pt-6 mt-6">
            <h3 className="text-base font-medium text-gray-100 mb-3">Image Generation Settings</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                    <label htmlFor="image-style" className="block text-sm font-medium text-gray-300 mb-1">Style Variance</label>
                    <select id="image-style" value={imageStyle} onChange={e => setImageStyle(e.target.value as ImageStyle)} className={inputClasses}>
                        {Object.values(ImageStyle).map(style => <option key={style} value={style}>{style}</option>)}
                    </select>
                </div>
                <div>
                    <label htmlFor="image-size" className="block text-sm font-medium text-gray-300 mb-1">Size Variance</label>
                    <select id="image-size" value={imageSize} onChange={e => setImageSize(e.target.value as ImageSize)} className={inputClasses}>
                        <option value="1:1">Square (1:1)</option>
                        <option value="16:9">Widescreen (16:9)</option>
                        <option value="9:16">Tall (9:16)</option>
                        <option value="4:3">Landscape (4:3)</option>
                        <option value="3:4">Portrait (3:4)</option>
                    </select>
                </div>
            </div>
        </div>
      </fieldset>

      <div className="flex justify-end items-center gap-4 pt-4 border-t border-gray-700">
        {editingRecord && (
          <button
            type="button"
            onClick={onCancelEdit}
            disabled={isSaving}
            className="px-4 py-2 text-sm font-medium text-gray-200 bg-gray-700 border border-gray-600 rounded-md shadow-sm hover:bg-gray-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-gray-500 transition disabled:opacity-50"
          >
            Cancel
          </button>
        )}
        <button
          type="submit"
          disabled={isSaving}
          className="px-6 py-2 text-sm font-semibold text-black bg-[--primary-color] rounded-md shadow-sm hover:bg-[--primary-color-hover] focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-[--primary-color] transition disabled:opacity-70 disabled:cursor-wait shadow-[0_0_8px_var(--primary-color)]"
        >
          {isSaving ? 'Saving...' : (editingRecord ? 'Update Record' : 'Add Record')}
        </button>
      </div>
    </form>
  );
};

export default RecordForm;