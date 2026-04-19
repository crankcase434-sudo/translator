import { useState, useCallback, useRef } from 'react';
import { speechService } from '../services/speechService';
import { Platform, PermissionsAndroid, Alert } from 'react-native';

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
          const msg = err.message || JSON.stringify(err);
          setError(msg);
          setIsListening(false);
          Alert.alert('Speech Error', msg);
        }
      );
    } catch (e: any) {
      setError(e.message);
      setIsListening(false);
      Alert.alert('Speech Error', e.message);
    }
  }, []);

  const stopListening = useCallback(async () => {
    if (recognizerRef.current) {
      await recognizerRef.current.stop();
      recognizerRef.current = null;
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
