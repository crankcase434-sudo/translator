import * as Vosk from 'react-native-vosk';
import Tts from 'react-native-tts';

Tts.setDefaultLanguage('en-US');
Tts.setDefaultRate(0.5);

export const speechService = {
  // TTS Logic
  speak: (text: string, languageCode: string) => {
    const ttsCode = languageCode === 'hi' ? 'hi-IN' : 'en-US';
    Tts.setDefaultLanguage(ttsCode);
    Tts.speak(text);
  },

  stopSpeaking: () => {
    Tts.stop();
  },

  // STT Logic (Vosk v2.x Functional API)
  startListening: async (modelPath: string, onResult: (text: string) => void, onError: (err: any) => void) => {
    try {
      console.log('Loading Vosk model:', modelPath);
      await Vosk.loadModel(modelPath);
      
      const resultSub = Vosk.onResult((res: string) => {
        if (res) {
          // res is a string in v2.x
          onResult(res);
        }
      });

      const errorSub = Vosk.onError((err: any) => {
        onError(err);
      });

      await Vosk.start();
      
      // Return a way to stop and cleanup
      return {
        stop: async () => {
          await Vosk.stop();
          resultSub.remove();
          errorSub.remove();
        }
      };
    } catch (error) {
      onError(error);
    }
  },

  getAvailableVoices: async () => {
    try {
      return await Tts.voices();
    } catch (error) {
      return [];
    }
  }
};
