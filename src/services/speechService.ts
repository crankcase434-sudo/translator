import Vosk from 'react-native-vosk';
import Tts from 'react-native-tts';
import { Platform } from 'react-native';

Tts.setDefaultLanguage('en-US');
Tts.setDefaultRate(0.5);

export const speechService = {
  // TTS Logic
  speak: (text: string, languageCode: string) => {
    // Map language codes if necessary for TTS
    const ttsCode = languageCode === 'hi' ? 'hi-IN' : 'en-US';
    Tts.setDefaultLanguage(ttsCode);
    Tts.speak(text);
  },

  stopSpeaking: () => {
    Tts.stop();
  },

  // STT Logic (Vosk)
  // Note: path is the local path to the extracted vosk model on the device
  startListening: async (modelPath: string, onResult: (text: string) => void, onError: (err: any) => void) => {
    try {
      const vosk = new Vosk();
      const options = {
        modelPath: modelPath, // e.g. 'models/vosk-model-small-en-us-0.15'
        sampleRate: 16000,
      };

      const recognizer = await vosk.createRecognizer(options);
      
      recognizer.on('result', (res: any) => {
        if (res && res.text) {
          onResult(res.text);
        }
      });

      recognizer.on('error', (err: any) => {
        onError(err);
      });

      await recognizer.start();
      return recognizer;
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
