import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Linking,
} from 'react-native';
import { Shield, Info, ExternalLink, Cpu } from 'lucide-react-native';
import { Colors, Spacing } from '../theme/colors';

export const SettingsScreen = () => {
  return (
    <ScrollView style={styles.container}>
      <Text style={styles.header}>Settings</Text>
      
      <View style={styles.section}>
        <View style={styles.infoBox}>
          <Cpu size={24} color={Colors.accent} style={styles.icon} />
          <View style={{ flex: 1 }}>
            <Text style={styles.infoTitle}>AI Engine</Text>
            <Text style={styles.infoText}>
              This app uses on-device Google ML Kit and Vosk for 100% offline translation and voice recognition.
            </Text>
          </View>
        </View>

        <View style={styles.infoBox}>
          <Shield size={24} color={Colors.success} style={styles.icon} />
          <View style={{ flex: 1 }}>
            <Text style={styles.infoTitle}>Privacy First</Text>
            <Text style={styles.infoText}>
              No data ever leaves your device. Translations and voice recordings are processed locally.
            </Text>
          </View>
        </View>
      </View>

      <Text style={styles.sectionTitle}>Support</Text>
      
      <TouchableOpacity 
        style={styles.menuItem}
        onPress={() => Linking.openURL('https://github.com/crankcase434-sudo/translator')}
      >
        <Info size={20} color={Colors.text} style={styles.menuIcon} />
        <Text style={styles.menuText}>About Project</Text>
        <ExternalLink size={16} color={Colors.textSecondary} />
      </TouchableOpacity>

      <View style={styles.footer}>
        <Text style={styles.version}>Translator v1.0.0</Text>
        <Text style={styles.copyright}>© 2026 Offline Translator</Text>
      </View>
    </ScrollView>
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
    fontSize: 28,
    fontWeight: 'bold',
    marginBottom: Spacing.xl,
  },
  section: {
    marginBottom: Spacing.xl,
  },
  sectionTitle: {
    color: Colors.textSecondary,
    fontSize: 14,
    fontWeight: '700',
    textTransform: 'uppercase',
    letterSpacing: 1,
    marginBottom: Spacing.md,
  },
  infoBox: {
    flexDirection: 'row',
    backgroundColor: Colors.surface,
    padding: Spacing.lg,
    borderRadius: 16,
    marginBottom: Spacing.md,
    borderWidth: 1,
    borderColor: Colors.border,
  },
  icon: {
    marginRight: Spacing.md,
  },
  infoTitle: {
    color: Colors.text,
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 4,
  },
  infoText: {
    color: Colors.textSecondary,
    fontSize: 14,
    lineHeight: 20,
  },
  menuItem: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: Colors.surface,
    padding: Spacing.lg,
    borderRadius: 16,
    borderWidth: 1,
    borderColor: Colors.border,
  },
  menuIcon: {
    marginRight: Spacing.md,
  },
  menuText: {
    color: Colors.text,
    fontSize: 16,
    fontWeight: '600',
    flex: 1,
  },
  footer: {
    marginTop: Spacing.xl * 2,
    alignItems: 'center',
    paddingBottom: Spacing.xl,
  },
  version: {
    color: Colors.textSecondary,
    fontSize: 14,
    fontWeight: 'bold',
  },
  copyright: {
    color: Colors.textSecondary,
    fontSize: 12,
    marginTop: 4,
  },
});
