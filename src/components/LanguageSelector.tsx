import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet, Platform } from 'react-native';
import { Languages, ArrowLeftRight } from 'lucide-react-native';
import { Colors, Spacing } from '../theme/colors';
import { SUPPORTED_LANGUAGES } from '../services/translationService';

interface Props {
  sourceLang: string;
  targetLang: string;
  onSwap: () => void;
  onSelectSource: () => void;
  onSelectTarget: () => void;
}

export const LanguageSelector: React.FC<Props> = ({
  sourceLang,
  targetLang,
  onSwap,
  onSelectSource,
  onSelectTarget,
}) => {
  const getLangName = (code: string) => 
    SUPPORTED_LANGUAGES.find(l => l.code === code)?.name || code;

  return (
    <View style={styles.container}>
      <TouchableOpacity style={styles.langButton} onPress={onSelectSource}>
        <Text style={styles.langText}>{getLangName(sourceLang)}</Text>
      </TouchableOpacity>
      
      <TouchableOpacity style={styles.swapButton} onPress={onSwap}>
        <ArrowLeftRight size={20} color={Colors.text} />
      </TouchableOpacity>
      
      <TouchableOpacity style={styles.langButton} onPress={onSelectTarget}>
        <Text style={styles.langText}>{getLangName(targetLang)}</Text>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: Spacing.md,
    borderBottomWidth: 1,
    borderBottomColor: Colors.border,
  },
  langButton: {
    flex: 1,
    paddingVertical: Spacing.sm,
    alignItems: 'center',
  },
  langText: {
    color: Colors.text,
    fontSize: 18,
    fontWeight: '600',
    fontFamily: Platform.OS === 'ios' ? 'System' : 'Roboto',
  },
  swapButton: {
    padding: Spacing.sm,
    backgroundColor: Colors.surfaceLight,
    borderRadius: 20,
  },
});
