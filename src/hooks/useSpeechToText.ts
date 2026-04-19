import { useState, useCallback, useRef } from 'react';
import { speechService } from '../services/speechService';
import { Platform, PermissionsAndroid } from 'react-native';

export const useSpeechToText = () => {
  const [isListening, setIsListening] = useState(false);
  const [result, setResult] = useState('');
  const [error, setError] = useState<string | null>(null);
  const recognizerRef = useRef<any>(null);

  const requestPermissions = async () => {
    if (Platform.OS === 'android') {
      const granted = await PermissionsAndroid.request(
        PermissionsAndroid.PERMISSIONS.RECORD_AUDIO
      );
      return granted === PermissionsAndroid.RESULTS.GRANTED;
    }
    return true;
  };

  const startListening = useCallback(async (modelPath: string) => {
    const hasPermission = await requestPermissions();
    if (!hasPermission) {
      setError('Permission to record audio denied');
      return;
    }

    setIsListening(true);
    setResult('');
    setError(null);

    try {
      recognizerRef.current = await speechService.startListening(
        modelPath,
        (text) => {
          setResult(text);
          setIsListening(false);
        },
        (err) => {
          setError(err.message || 'Recognition error');
          setIsListening(false);
        }
      );
    } catch (e: any) {
      setError(e.message);
      setIsListening(false);
    }
  }, []);

  const stopListening = useCallback(async () => {
    if (recognizerRef.current) {
      await recognizerRef.current.stop();
      setIsListening(false);
    }
  }, []);

  return {
    isListening,
    result,
    error,
    startListening,
    stopListening,
  };
};
