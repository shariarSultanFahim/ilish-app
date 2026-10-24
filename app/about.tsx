import React from 'react';
import { View, Text, StyleSheet, ScrollView, Platform } from 'react-native';
import { useI18n } from '../src/i18n';
import { EXPECTED_LABELS } from '../src/config';

export default function AboutScreen() {
  const { t, getSpeciesName } = useI18n();

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <Text style={styles.title}>{t.aboutTitle}</Text>

      {/* Purpose */}
      <View style={styles.card}>
        <Text style={styles.cardHeader}>{t.aboutPurposeHeading}</Text>
        <Text style={styles.cardBody}>{t.aboutPurposeText}</Text>
      </View>

      {/* Offline Guarantee */}
      <View style={styles.card}>
        <Text style={styles.cardHeader}>✈️ {t.offlineNoteHeading}</Text>
        <Text style={styles.cardBody}>{t.offlineNoteText}</Text>
      </View>

      {/* 9 Supported Species */}
      <View style={styles.card}>
        <Text style={styles.cardHeader}>🐟 {t.supportedSpeciesHeading}</Text>
        <View style={styles.speciesList}>
          {EXPECTED_LABELS.map((species, idx) => (
            <View key={species} style={styles.speciesItem}>
              <Text style={styles.speciesIndex}>{idx + 1}.</Text>
              <Text style={styles.speciesText}>
                <Text style={styles.speciesBangla}>{getSpeciesName(species)}</Text>{' '}
                <Text style={styles.speciesLatin}>({species})</Text>
              </Text>
            </View>
          ))}
        </View>
      </View>

      {/* Model details */}
      <View style={styles.card}>
        <Text style={styles.cardHeader}>🧠 {t.modelDetailsHeading}</Text>
        <Text style={styles.cardBodyCode}>{t.modelDetailsText}</Text>
      </View>

      {/* Dataset credit */}
      <View style={styles.card}>
        <Text style={styles.cardHeader}>📚 {t.datasetCreditHeading}</Text>
        <Text style={styles.cardBody}>{t.datasetCreditText}</Text>
      </View>

      {/* Limitations */}
      <View style={styles.card}>
        <Text style={styles.cardHeader}>⚠️ {t.limitationsHeading}</Text>
        <Text style={styles.cardBody}>{t.limitationsText}</Text>
      </View>

      {/* App version */}
      <View style={[styles.card, styles.lastCard]}>
        <Text style={styles.cardHeader}>📱 {t.appVersionHeading}</Text>
        <Text style={styles.cardBody}>{t.appVersionText}</Text>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    padding: 20,
    backgroundColor: '#F8FAFC',
    paddingBottom: 40,
  },
  title: {
    fontSize: 26,
    fontWeight: '900',
    color: '#0F172A',
    marginBottom: 18,
  },
  card: {
    backgroundColor: '#FFFFFF',
    borderRadius: 14,
    padding: 16,
    marginBottom: 14,
    borderWidth: 1,
    borderColor: '#E2E8F0',
  },
  lastCard: {
    marginBottom: 0,
  },
  cardHeader: {
    fontSize: 16,
    fontWeight: '800',
    color: '#0F172A',
    marginBottom: 8,
  },
  cardBody: {
    fontSize: 14,
    color: '#334155',
    lineHeight: 22,
  },
  cardBodyCode: {
    fontSize: 13,
    color: '#1E293B',
    lineHeight: 20,
    fontFamily: Platform.select({ ios: 'Menlo', android: 'monospace' }),
    backgroundColor: '#F1F5F9',
    padding: 10,
    borderRadius: 8,
  },
  speciesList: {
    marginTop: 4,
  },
  speciesItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 4,
    borderBottomWidth: 1,
    borderBottomColor: '#F1F5F9',
  },
  speciesIndex: {
    width: 24,
    fontSize: 14,
    fontWeight: '700',
    color: '#0284C7',
  },
  speciesText: {
    fontSize: 14,
  },
  speciesBangla: {
    fontWeight: '700',
    color: '#0F172A',
  },
  speciesLatin: {
    color: '#64748B',
  },
});
