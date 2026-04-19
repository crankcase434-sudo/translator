import React, { useEffect, useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  TouchableOpacity,
  ActivityIndicator,
  Alert,
} from 'react-native';
import { Download, Trash2, CheckCircle } from 'lucide-react-native';
import { Colors, Spacing } from '../theme/colors';
import { useAppStore } from '../store/useAppStore';
import { translationService, SUPPORTED_LANGUAGES } from '../services/translationService';

export const SettingsScreen = () => {
  const { downloadedModels, checkModels } = useAppStore();
  const [loading, setLoading] = useState<string | null>(null);

  useEffect(() => {
    checkModels();
  }, []);

  const handleDownload = async (code: string) => {
    setLoading(code);
    const success = await translationService.downloadModel(code);
    if (success) {
      await checkModels();
      Alert.alert('Success', `Model for ${code} downloaded.`);
    } else {
      Alert.alert('Error', `Failed to download model for ${code}.`);
    }
    setLoading(null);
  };

  const handleDelete = async (code: string) => {
    setLoading(code);
    const success = await translationService.deleteModel(code);
    if (success) {
      await checkModels();
    }
    setLoading(null);
  };

  const renderItem = ({ item }: { item: typeof SUPPORTED_LANGUAGES[0] }) => {
    const isDownloaded = downloadedModels.includes(item.code);
    const isLoading = loading === item.code;

    return (
      <View style={styles.langItem}>
        <View style={{ flex: 1 }}>
          <Text style={styles.langName}>{item.name}</Text>
          <Text style={styles.langCode}>{item.code.toUpperCase()}</Text>
        </View>

        {isLoading ? (
          <ActivityIndicator color={Colors.accent} />
        ) : isDownloaded ? (
          <View style={styles.row}>
            <CheckCircle size={20} color={Colors.success} style={{ marginRight: Spacing.md }} />
            <TouchableOpacity onPress={() => handleDelete(item.code)}>
              <Trash2 size={20} color={Colors.error} />
            </TouchableOpacity>
          </View>
        ) : (
          <TouchableOpacity onPress={() => handleDownload(item.code)}>
            <Download size={20} color={Colors.accent} />
          </TouchableOpacity>
        )}
      </View>
    );
  };

  return (
    <View style={styles.container}>
      <Text style={styles.header}>Offline Models</Text>
      <Text style={styles.subHeader}>
        Download language models to use the app without internet.
      </Text>
      
      <FlatList
        data={SUPPORTED_LANGUAGES}
        keyExtractor={(item) => item.code}
        renderItem={renderItem}
        contentContainerStyle={styles.list}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.background,
    padding: Spacing.md,
  },
  header: {
    color: Colors.text,
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: Spacing.xs,
  },
  subHeader: {
    color: Colors.textSecondary,
    fontSize: 14,
    marginBottom: Spacing.lg,
  },
  list: {
    paddingBottom: Spacing.xl,
  },
  langItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: Spacing.md,
    borderBottomWidth: 1,
    borderBottomColor: Colors.border,
  },
  langName: {
    color: Colors.text,
    fontSize: 18,
    fontWeight: '600',
  },
  langCode: {
    color: Colors.textSecondary,
    fontSize: 12,
  },
  row: {
    flexDirection: 'row',
    alignItems: 'center',
  },
});
