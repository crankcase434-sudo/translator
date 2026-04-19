import React, { useEffect, useState } from 'react';
import {
  View,
  Text,
  TextInput,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
  KeyboardAvoidingView,
  Platform,
  ActivityIndicator,
  Share,
} from 'react-native';
import { Mic, Volume2, Copy, Star, Trash2, Share2 } from 'lucide-react-native';
import { useAppStore } from '../store/useAppStore';
import { Colors, Spacing } from '../theme/colors';
import { LanguageSelector } from '../components/LanguageSelector';
import { speechService } from '../services/speechService';
import { useSpeechToText } from '../hooks/useSpeechToText';
import Clipboard from '@react-native-clipboard/clipboard';

export const HomeScreen = () => {
  const store = useAppStore();
  const { isListening, result, startListening, stopListening } = useSpeechToText();

  useEffect(() => {
    if (result) {
      store.setSourceText(result);
      store.translateText();
    }
  }, [result]);

  useEffect(() => {
    store.loadHistory();
    store.checkModels();
  }, []);

  const handleTranslate = () => {
    store.translateText();
  };

  const handleSpeakOutput = () => {
    if (store.translatedText) {
      speechService.speak(store.translatedText, store.targetLang);
    }
  };

  const copyToClipboard = (text: string) => {
    Clipboard.setString(text);
  };

  const handleShare = async () => {
    if (store.translatedText) {
      try {
        await Share.share({
          message: store.translatedText,
        });
      } catch (error) {
        console.error(error);
      }
    }
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        style={styles.container}
      >
        <LanguageSelector
          sourceLang={store.sourceLang}
          targetLang={store.targetLang}
          onSwap={store.swapLanguages}
          onSelectSource={() => {}} // TODO: Navigate to pick
          onSelectTarget={() => {}} // TODO: Navigate to pick
        />

        <ScrollView contentContainerStyle={styles.scrollContent}>
          <View style={styles.inputCard}>
            <TextInput
              style={styles.input}
              placeholder="Type text to translate..."
              placeholderTextColor={Colors.textSecondary}
              multiline
              value={store.sourceText}
              onChangeText={store.setSourceText}
              onBlur={handleTranslate}
            />
            <View style={styles.actionRow}>
              <TouchableOpacity
                style={[styles.iconButton, isListening && styles.activeMic]}
                onPress={() => {
                  if (isListening) {
                    stopListening();
                  } else {
                    // Logic to find correct model path based on sourceLang
                    const modelPath = `/assets/models/vosk-${store.sourceLang}`;
                    startListening(modelPath);
                  }
                }}
              >
                <Mic size={24} color={isListening ? Colors.error : Colors.text} />
              </TouchableOpacity>
              <TouchableOpacity
                style={styles.iconButton}
                onPress={() => speechService.speak(store.sourceText, store.sourceLang)}
              >
                <Volume2 size={24} color={Colors.text} />
              </TouchableOpacity>
            </View>
          </View>

          {store.isTranslating ? (
            <ActivityIndicator color={Colors.accent} style={{ marginVertical: 20 }} />
          ) : store.translatedText ? (
            <View style={styles.outputCard}>
              <Text style={styles.outputText}>{store.translatedText}</Text>
              <View style={styles.actionRow}>
                <TouchableOpacity style={styles.iconButton} onPress={handleSpeakOutput}>
                  <Volume2 size={24} color={Colors.text} />
                </TouchableOpacity>
                <TouchableOpacity 
                  style={styles.iconButton} 
                  onPress={() => copyToClipboard(store.translatedText)}
                >
                  <Copy size={24} color={Colors.text} />
                </TouchableOpacity>
                <TouchableOpacity style={styles.iconButton} onPress={handleShare}>
                  <Share2 size={24} color={Colors.text} />
                </TouchableOpacity>
                <TouchableOpacity style={styles.iconButton}>
                  <Star size={24} color={Colors.text} />
                </TouchableOpacity>
              </View>
            </View>
          ) : null}

          <View style={styles.historySection}>
            <Text style={styles.sectionTitle}>Recent History</Text>
            {store.history.slice(0, 5).map((item) => (
              <View key={item.id} style={styles.historyItem}>
                <View style={{ flex: 1 }}>
                  <Text style={styles.historySource}>{item.sourceText}</Text>
                  <Text style={styles.historyTarget}>{item.translatedText}</Text>
                </View>
                <TouchableOpacity onPress={() => store.deleteHistory(item.id)}>
                  <Trash2 size={18} color={Colors.textSecondary} />
                </TouchableOpacity>
              </View>
            ))}
          </View>
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
};

import { SafeAreaView } from 'react-native-safe-area-context';

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: Colors.background,
  },
  container: {
    flex: 1,
    paddingHorizontal: Spacing.md,
  },
  scrollContent: {
    paddingBottom: Spacing.xl,
  },
  inputCard: {
    backgroundColor: Colors.surface,
    borderRadius: 16,
    padding: Spacing.md,
    marginTop: Spacing.md,
    borderWidth: 1,
    borderColor: Colors.border,
  },
  input: {
    color: Colors.text,
    fontSize: 20,
    minHeight: 100,
    textAlignVertical: 'top',
  },
  outputCard: {
    backgroundColor: Colors.surfaceLight,
    borderRadius: 16,
    padding: Spacing.md,
    marginTop: Spacing.md,
    borderWidth: 1,
    borderColor: Colors.border,
  },
  outputText: {
    color: Colors.text,
    fontSize: 20,
    fontWeight: '500',
  },
  actionRow: {
    flexDirection: 'row',
    justifyContent: 'flex-end',
    marginTop: Spacing.sm,
  },
  iconButton: {
    padding: Spacing.sm,
    marginLeft: Spacing.sm,
  },
  activeMic: {
    backgroundColor: 'rgba(255, 68, 68, 0.1)',
    borderRadius: 20,
  },
  historySection: {
    marginTop: Spacing.xl,
  },
  sectionTitle: {
    color: Colors.textSecondary,
    fontSize: 14,
    textTransform: 'uppercase',
    letterSpacing: 1,
    marginBottom: Spacing.sm,
  },
  historyItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: Spacing.md,
    borderBottomWidth: 1,
    borderBottomColor: Colors.border,
  },
  historySource: {
    color: Colors.textSecondary,
    fontSize: 14,
  },
  historyTarget: {
    color: Colors.text,
    fontSize: 16,
    marginTop: 2,
  },
});
