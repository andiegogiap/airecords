

import { useState, useMemo, useCallback, useEffect } from 'react';
import { AppRecord, Category } from '../types';
import { getAllRecords, addRecordDB, updateRecordDB, deleteRecordDB } from '../services/dbService';

const generateId = () => 'rec-' + Date.now() + Math.floor(Math.random() * 1000);

export const useRecords = () => {
  const [records, setRecords] = useState<AppRecord[]>([]);
  const [currentFilter, setCurrentFilter] = useState<Category | 'ALL'>('ALL');
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // On component mount, load all records from the IndexedDB persistent store.
    const loadRecords = async () => {
      try {
        // getAllRecords is an async call to our dbService, which handles the IndexedDB logic.
        const dbRecords = await getAllRecords();
        setRecords(dbRecords.sort((a, b) => b.id.localeCompare(a.id))); // Show newest first
      } catch (error) {
        console.error("Failed to load records from DB", error);
        // Handle error, maybe show a toast to the user
      } finally {
        setIsLoading(false);
      }
    };
    loadRecords();
  }, []);

  const addRecord = useCallback(async (recordData: Omit<AppRecord, 'id'>) => {
    const newRecord: AppRecord = {
      ...recordData,
      id: generateId(),
    };
    try {
        await addRecordDB(newRecord);
        setRecords(prevRecords => [newRecord, ...prevRecords]);
    } catch (error) {
        console.error("Failed to add record", error);
        alert("Error: Could not save the new record.");
    }
  }, []);

  const updateRecord = useCallback(async (id: string, updatedData: Omit<AppRecord, 'id'>) => {
    const recordToUpdate = records.find(r => r.id === id);
    if (!recordToUpdate) return;

    const updatedRecord = { ...recordToUpdate, ...updatedData };
    try {
        await updateRecordDB(updatedRecord);
        setRecords(prevRecords =>
          prevRecords.map(record =>
            record.id === id ? updatedRecord : record
          )
        );
    } catch (error) {
        console.error("Failed to update record", error);
        alert("Error: Could not update the record.");
    }
  }, [records]);
  
  const toggleBookmark = useCallback(async (id: string) => {
    const recordToUpdate = records.find(r => r.id === id);
    if (!recordToUpdate) return;

    const { id: recordId, ...dataToUpdate } = recordToUpdate;
    const finalData = { ...dataToUpdate, isBookmarked: !recordToUpdate.isBookmarked };
    
    await updateRecord(id, finalData);
  }, [records, updateRecord]);

  const deleteRecord = useCallback(async (id: string) => {
    if (window.confirm('Are you sure you want to delete this record?')) {
        try {
            await deleteRecordDB(id);
            setRecords(prevRecords => prevRecords.filter(record => record.id !== id));
        } catch(error) {
            console.error("Failed to delete record", error);
            alert("Error: Could not delete the record.");
        }
    }
  }, []);

  const setFilter = useCallback((filter: Category | 'ALL') => {
    setCurrentFilter(filter);
  }, []);

  const filteredRecords = useMemo(() => {
    if (currentFilter === 'ALL') {
      return records;
    }
    return records.filter(record => record.category === currentFilter);
  }, [records, currentFilter]);

  return {
    records,
    filteredRecords,
    isLoading,
    currentFilter,
    addRecord,
    updateRecord,
    deleteRecord,
    setFilter,
    toggleBookmark,
  };
};