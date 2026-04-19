import { createMMKV } from 'react-native-mmkv';

export const storage = createMMKV();

export interface TranslationHistory {
  id: string;
  sourceText: string;
  translatedText: string;
  sourceLang: string;
  targetLang: string;
  timestamp: number;
  isFavorite: boolean;
}

const HISTORY_KEY = 'translation_history';

export const storageService = {
  getHistory: (): TranslationHistory[] => {
    const data = storage.getString(HISTORY_KEY);
    return data ? JSON.parse(data) : [];
  },

  saveHistory: (item: Omit<TranslationHistory, 'id' | 'timestamp' | 'isFavorite'>) => {
    const history = storageService.getHistory();
    const newItem: TranslationHistory = {
      ...item,
      id: Math.random().toString(36).substr(2, 9),
      timestamp: Date.now(),
      isFavorite: false,
    };
    const updatedHistory = [newItem, ...history].slice(0, 100); // Keep last 100
    storage.set(HISTORY_KEY, JSON.stringify(updatedHistory));
    return newItem;
  },

  toggleFavorite: (id: string) => {
    const history = storageService.getHistory();
    const updatedHistory = history.map((item) =>
      item.id === id ? { ...item, isFavorite: !item.isFavorite } : item
    );
    storage.set(HISTORY_KEY, JSON.stringify(updatedHistory));
  },

  deleteHistoryItem: (id: string) => {
    const history = storageService.getHistory();
    const updatedHistory = history.filter((item) => item.id !== id);
    storage.set(HISTORY_KEY, JSON.stringify(updatedHistory));
  },

  clearHistory: () => {
    storage.remove(HISTORY_KEY);
  },
};
