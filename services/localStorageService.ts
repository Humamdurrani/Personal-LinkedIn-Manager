import { StoredContent } from '../types';

const STORAGE_KEY = 'linkedInContentLibrary';

export const getContent = (): StoredContent[] => {
  try {
    const items = window.localStorage.getItem(STORAGE_KEY);
    return items ? JSON.parse(items) : [];
  } catch (error) {
    console.error("Error reading from localStorage", error);
    return [];
  }
};

export const saveContent = (item: StoredContent): void => {
  try {
    const items = getContent();
    const newItems = [...items, item];
    window.localStorage.setItem(STORAGE_KEY, JSON.stringify(newItems));
  } catch (error) {
    console.error("Error saving to localStorage", error);
  }
};

export const updateContent = (id: string, updates: Partial<StoredContent>): void => {
  try {
    const items = getContent();
    const newItems = items.map(item => item.id === id ? { ...item, ...updates } : item);
    window.localStorage.setItem(STORAGE_KEY, JSON.stringify(newItems));
  } catch (error) {
    console.error("Error updating localStorage", error);
  }
};

export const deleteContent = (id: string): void => {
  try {
    const items = getContent();
    const newItems = items.filter(item => item.id !== id);
    window.localStorage.setItem(STORAGE_KEY, JSON.stringify(newItems));
  } catch (error) {
    console.error("Error deleting from localStorage", error);
  }
};