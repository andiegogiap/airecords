
import React, { useState } from 'react';
import { AppRecord, Page } from '../types';
import { useRecords } from '../hooks/useRecords';
import FilterButtons from './FilterButtons';
import RecordCard from './RecordCard';
import ImageModal from './ImageModal';
import RecordForm from './RecordForm';
import ImproveModal from './ImproveModal';
import * as geminiService from '../services/geminiService';

interface RecordsPageProps {
  onNavigate: (page: Page) => void;
}

const RecordsPage: React.FC<RecordsPageProps> = ({ onNavigate }) => {
  const { records, filteredRecords, currentFilter, addRecord, deleteRecord, updateRecord, setFilter, isLoading, toggleBookmark } = useRecords();
  const [modalImageUrl, setModalImageUrl] = useState<string | null>(null);
  const [formRecord, setFormRecord] = useState<AppRecord | null>(null);
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [regeneratingImageId, setRegeneratingImageId] = useState<string | null>(null);
  const [recordToImprove, setRecordToImprove] = useState<AppRecord | null>(null);

  const handleOpenForm = (record: AppRecord | null) => {
    setFormRecord(record);
    setIsFormOpen(true);
  };

  const handleCloseForm = () => {
    setFormRecord(null);
    setIsFormOpen(false);
  };

  const handleSaveRecord = async (recordData: Omit<AppRecord, 'id' | 'imageUrl'>, id?: string) => {
    setIsSaving(true);
    try {
      // Always generate/regenerate an image on save to ensure visual consistency with the record data.
      const imagePrompt = recordData.description || recordData.name;
      const imageUrl = await geminiService.generateImage(imagePrompt, recordData.imageStyle, recordData.imageSize);
      
      const fullRecordData = { ...recordData, imageUrl };

      if (id) {
        await updateRecord(id, fullRecordData);
      } else {
        await addRecord(fullRecordData);
      }
      handleCloseForm();
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : "Unknown error";
      alert(`Failed to save record: ${errorMessage}`);
    } finally {
      setIsSaving(false);
    }
  };

  const handleRegenerateImage = async (record: AppRecord) => {
    setRegeneratingImageId(record.id);
    try {
      const imagePrompt = record.description || record.name;
      const imageUrl = await geminiService.generateImage(imagePrompt, record.imageStyle, record.imageSize);
      await updateRecord(record.id, { ...record, imageUrl });
    } catch(error) {
      const errorMessage = error instanceof Error ? error.message : "Unknown error";
      alert(`Failed to regenerate image: ${errorMessage}`);
    } finally {
      setRegeneratingImageId(null);
    }
  };
  
  const handleOpenImproveModal = (record: AppRecord) => {
    setRecordToImprove(record);
  };

  const handleCloseImproveModal = () => {
    setRecordToImprove(null);
  };

  const handleSaveImprovedRecord = async (id: string, updatedData: Omit<AppRecord, 'id'>) => {
    await updateRecord(id, updatedData);
    handleCloseImproveModal();
  };

  const handleRefine = async (record: AppRecord) => {
    if (!record.isBookmarked) {
        await toggleBookmark(record.id);
    }
    onNavigate('refinery');
  };


  const renderContent = () => {
    if (isLoading) return <div className="text-center py-10 text-gray-400">Loading records...</div>;
    
    if (filteredRecords.length > 0) {
      return (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-6">
         {filteredRecords.map(record => (
           <RecordCard 
            key={record.id} 
            record={record} 
            onEdit={() => handleOpenForm(record)} 
            onDelete={deleteRecord} 
            onImageClick={setModalImageUrl}
            onRegenerateImage={handleRegenerateImage}
            isRegenerating={regeneratingImageId === record.id}
            onToggleBookmark={toggleBookmark}
            onImprove={handleOpenImproveModal}
            onRefine={handleRefine}
          />
         ))}
       </div>
     );
    }
    return (
      <div className="text-center py-10 px-6 bg-black/20 rounded-lg mt-6 border border-gray-700">
        <p className="text-gray-400">No records found.</p>
        <p className="text-gray-500 text-sm mt-1">Click "Add New Record" to get started.</p>
      </div>
    );
  }

  return (
    <>
      <ImageModal imageUrl={modalImageUrl} onClose={() => setModalImageUrl(null)} />
      
      {recordToImprove && (
        <ImproveModal 
          record={recordToImprove}
          onClose={handleCloseImproveModal}
          onSave={handleSaveImprovedRecord}
        />
      )}

      {isFormOpen && (
        <div 
          className="fixed inset-0 bg-black/80 backdrop-blur-sm flex items-center justify-center z-50 p-4"
          onClick={handleCloseForm}
        >
          <div 
            className="bg-[--card-bg] backdrop-blur-xl border border-[--card-border-color] rounded-lg shadow-2xl w-full max-w-2xl"
            onClick={e => e.stopPropagation()}
          >
            <div className="p-6">
                <h2 className="text-2xl font-bold text-glow-primary text-[--primary-color] mb-4">
                  {formRecord ? 'Edit Record' : 'Add New Record'}
                </h2>
                <RecordForm 
                    editingRecord={formRecord}
                    onSave={handleSaveRecord}
                    onCancelEdit={handleCloseForm}
                    isSaving={isSaving}
                />
            </div>
          </div>
        </div>
      )}

      <div className="space-y-8">
        <div className="bg-[--card-bg] backdrop-blur-xl border border-[--card-border-color] p-6 rounded-lg shadow-lg">
          <div className="flex flex-col sm:flex-row justify-between items-center mb-4 border-b border-[--primary-color]/30 pb-4 gap-4">
            <h2 className="text-2xl font-bold text-glow-primary text-[--primary-color]">
              Records
            </h2>
            <button
              onClick={() => handleOpenForm(null)}
              className="px-6 py-2 font-semibold text-black bg-[--primary-color] rounded-md shadow-lg hover:bg-[--primary-color-hover] transition shadow-[0_0_8px_var(--primary-color)] w-full sm:w-auto"
            >
              Add New Record
            </button>
          </div>
          <FilterButtons currentFilter={currentFilter} onFilterChange={setFilter} />
          {renderContent()}
        </div>
      </div>
    </>
  );
};

export default RecordsPage;