import Translate, { TranslateLanguage } from '@react-native-ml-kit/translate-text';

export const SUPPORTED_LANGUAGES = [
  { code: TranslateLanguage.ENGLISH, name: 'English' },
  { code: TranslateLanguage.HINDI, name: 'Hindi' },
  { code: TranslateLanguage.SPANISH, name: 'Spanish' },
  { code: TranslateLanguage.FRENCH, name: 'French' },
  { code: TranslateLanguage.GERMAN, name: 'German' },
];

export const translationService = {
  translate: async (text: string, source: string, target: string): Promise<string> => {
    try {
      const result = await Translate.translate({
        text,
        sourceLanguage: source as TranslateLanguage,
        targetLanguage: target as TranslateLanguage,
        downloadModelIfNeeded: true,
      });
      // The library returns an object/string depending on version, ensuring we return string
      return typeof result === 'string' ? result : (result as any).text || '';
    } catch (error) {
      console.error('Translation error:', error);
      throw error;
    }
  },

  // These are stubs for the UI to remain compatible but without throwing errors
  downloadModel: async (languageCode: string) => {
    console.log('Model download managed automatically by engine');
    return true;
  },

  deleteModel: async (languageCode: string) => {
    console.warn('Model deletion not supported by this engine version');
    return true;
  },

  isModelDownloaded: async (languageCode: string) => {
    // We cannot check this with the current library version, so we assume true 
    // since the engine handles it on-demand anyway.
    return true;
  },

  getDownloadedModels: async () => {
    return [];
  },

  identifyLanguage: async (text: string) => {
    try {
      const Identify = require('@react-native-ml-kit/identify-languages').default;
      if (Identify && Identify.identifyPossibleLanguages) {
        const languages = await Identify.identifyPossibleLanguages(text);
        return languages[0]?.languageCode || null;
      }
      return null;
    } catch (error) {
      console.error('Error identifying language:', error);
      return null;
    }
  }
};
