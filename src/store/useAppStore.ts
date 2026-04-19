import { create } from 'zustand';
import { translationService } from '../services/translationService';
import { storageService, TranslationHistory } from '../services/storageService';

interface AppState {
  sourceLang: string;
  targetLang: string;
  sourceText: string;
  translatedText: string;
  isTranslating: boolean;
  history: TranslationHistory[];
  
  setSourceLang: (lang: string) => void;
  setTargetLang: (lang: string) => void;
  setSourceText: (text: string) => void;
  setTranslatedText: (text: string) => void;
  swapLanguages: () => void;
  translateText: () => Promise<void>;
  loadHistory: () => void;
  toggleFavorite: (id: string) => void;
  deleteHistory: (id: string) => void;
  checkModels: () => Promise<void>;
}

export const useAppStore = create<AppState>((set, get) => ({
  sourceLang: 'en',
  targetLang: 'hi',
  sourceText: '',
  translatedText: '',
  isTranslating: false,
  history: [],

  setSourceLang: (lang) => set({ sourceLang: lang }),
  setTargetLang: (lang) => set({ targetLang: lang }),
  setSourceText: (text) => set({ sourceText: text }),
  setTranslatedText: (text) => set({ translatedText: text }),

  swapLanguages: () => {
    const { sourceLang, targetLang, sourceText, translatedText } = get();
    set({
      sourceLang: targetLang,
      targetLang: sourceLang,
      sourceText: translatedText,
      translatedText: sourceText,
    });
  },

  translateText: async () => {
    const { sourceText, sourceLang, targetLang } = get();
    if (!sourceText.trim()) return;

    set({ isTranslating: true });
    try {
      const result = await translationService.translate(sourceText, sourceLang, targetLang);
      set({ translatedText: result });
      
      const newItem = storageService.saveHistory({
        sourceText,
        translatedText: result,
        sourceLang,
        targetLang,
      });
      
      set((state) => ({ history: [newItem, ...state.history] }));
    } catch (error) {
      console.error(error);
    } finally {
      set({ isTranslating: false });
    }
  },

  loadHistory: () => {
    const history = storageService.getHistory();
    set({ history });
  },

  toggleFavorite: (id) => {
    storageService.toggleFavorite(id);
    get().loadHistory();
  },

  deleteHistory: (id) => {
    storageService.deleteHistoryItem(id);
    get().loadHistory();
  },

  checkModels: async () => {
    // Simplified stub to prevent errors from leftover calls in UI
    return;
  },
}));
