import { AppRecord, Category } from '../types';

export const initialRecordsForSeed: AppRecord[] = [
    { id: 'rec-1', name: 'User Profile Settings', description: 'Configuration for user account preferences.', category: Category.USER },
    { id: 'rec-2', name: 'AI Model Version 3.1', description: 'Metadata for the latest AI model deployment.', category: Category.AI },
    { id: 'rec-3', name: 'System Log Retention Policy', description: 'Rules for how long system logs are kept.', category: Category.SYSTEM },
    { id: 'rec-4', name: 'Dashboard Layout Preferences', description: 'Custom layout for the user dashboard.', category: Category.USER },
    { id: 'rec-5', name: 'AI Training Dataset Details', description: 'Information about the dataset used for AI training.', category: Category.AI },
    { id: 'rec-6', name: 'API Rate Limit Configuration', description: 'System-wide API request rate limits.', category: Category.SYSTEM },
];
