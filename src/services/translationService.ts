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
        sourceLanguage: source,
        targetLanguage: target,
        downloadModelIfNeeded: true,
      });
      return result;
    } catch (error) {
      console.error('Translation error:', error);
      throw error;
    }
  },

  downloadModel: async (languageCode: string) => {
    try {
      await Translate.downloadModel(languageCode);
      return true;
    } catch (error) {
      console.error(`Error downloading model for ${languageCode}:`, error);
      return false;
    }
  },

  deleteModel: async (languageCode: string) => {
    try {
      await Translate.deleteModel(languageCode);
      return true;
    } catch (error) {
      console.error(`Error deleting model for ${languageCode}:`, error);
      return false;
    }
  },

  isModelDownloaded: async (languageCode: string) => {
    try {
      return await Translate.isModelDownloaded(languageCode);
    } catch (error) {
      console.error(`Error checking model for ${languageCode}:`, error);
      return false;
    }
  },

  getDownloadedModels: async () => {
    try {
      return await Translate.getDownloadedModels();
    } catch (error) {
      console.error('Error getting downloaded models:', error);
      return [];
    }
  },

  identifyLanguage: async (text: string) => {
    try {
      // Note: Requires @react-native-ml-kit/identify-languages
      const Identify = require('@react-native-ml-kit/identify-languages').default;
      const languages = await Identify.identifyPossibleLanguages(text);
      return languages[0]?.languageCode || null;
    } catch (error) {
      console.error('Error identifying language:', error);
      return null;
    }
  }
};
