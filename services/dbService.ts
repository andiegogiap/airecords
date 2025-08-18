/**
 * dbService.ts
 * 
 * This service provides the IndexedDB persistence layer for the application.
 * It handles all Create, Read, Update, and Delete (CRUD) operations for AppRecord objects,
 * ensuring that application data is stored locally and persists between sessions.
 */
import { AppRecord } from '../types';
import { initialRecordsForSeed } from './initialData';

const DB_NAME = 'RecordsDB';
const STORE_NAME = 'records';
const DB_VERSION = 1;

let db: IDBDatabase;

/**
 * Opens and initializes the IndexedDB database.
 * This function handles the initial creation of the object store and seeds it with initial data.
 * It returns a promise that resolves with the database instance.
 * The 'db' instance is cached in a module-level variable to avoid re-opening the connection unnecessarily.
 * @returns A Promise that resolves to the IDBDatabase instance.
 */
const openDB = (): Promise<IDBDatabase> => {
  return new Promise((resolve, reject) => {
    // If the database is already open, resolve with it.
    if (db) {
      return resolve(db);
    }

    const request = indexedDB.open(DB_NAME, DB_VERSION);

    request.onerror = () => {
      console.error('Error opening DB', request.error);
      reject('Error opening DB');
    };

    request.onsuccess = (event) => {
      db = (event.target as IDBOpenDBRequest).result;
      resolve(db);
    };
    
    // This event is only triggered when the version changes or the DB is first created.
    request.onupgradeneeded = (event) => {
      const tempDb = (event.target as IDBOpenDBRequest).result;
      if (!tempDb.objectStoreNames.contains(STORE_NAME)) {
        const objectStore = tempDb.createObjectStore(STORE_NAME, { keyPath: 'id' });
        
        // Seed the database with initial records
        objectStore.transaction.oncomplete = () => {
          const recordStore = tempDb.transaction(STORE_NAME, 'readwrite').objectStore(STORE_NAME);
          initialRecordsForSeed.forEach(record => {
            recordStore.add(record);
          });
        };
      }
    };
  });
};

// --- CRUD Operations ---

export const getAllRecords = async (): Promise<AppRecord[]> => {
  const db = await openDB();
  return new Promise((resolve, reject) => {
    const transaction = db.transaction(STORE_NAME, 'readonly');
    const store = transaction.objectStore(STORE_NAME);
    const request = store.getAll();

    request.onerror = () => reject('Error fetching records');
    request.onsuccess = () => resolve(request.result);
  });
};

export const addRecordDB = async (record: AppRecord): Promise<AppRecord> => {
  const db = await openDB();
  return new Promise((resolve, reject) => {
    const transaction = db.transaction(STORE_NAME, 'readwrite');
    const store = transaction.objectStore(STORE_NAME);
    const request = store.add(record);

    request.onerror = () => reject('Error adding record');
    request.onsuccess = () => resolve(record);
  });
};

export const updateRecordDB = async (record: AppRecord): Promise<AppRecord> => {
    const db = await openDB();
    return new Promise((resolve, reject) => {
      const transaction = db.transaction(STORE_NAME, 'readwrite');
      const store = transaction.objectStore(STORE_NAME);
      const request = store.put(record);
  
      request.onerror = () => reject('Error updating record');
      request.onsuccess = () => resolve(record);
    });
};

export const deleteRecordDB = async (id: string): Promise<string> => {
    const db = await openDB();
    return new Promise((resolve, reject) => {
      const transaction = db.transaction(STORE_NAME, 'readwrite');
      const store = transaction.objectStore(STORE_NAME);
      const request = store.delete(id);
  
      request.onerror = () => reject('Error deleting record');
      request.onsuccess = () => resolve(id);
    });
};

export const clearAllRecordsDB = async (): Promise<void> => {
  const db = await openDB();
  return new Promise((resolve, reject) => {
    const transaction = db.transaction(STORE_NAME, 'readwrite');
    const store = transaction.objectStore(STORE_NAME);
    const request = store.clear();

    request.onerror = () => {
      console.error('Error clearing records', request.error);
      reject('Error clearing records');
    };
    request.onsuccess = () => resolve();
  });
};