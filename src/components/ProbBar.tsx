import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { useI18n } from '../i18n';

interface ProbBarProps {
  label: string;
  percentage: number; // 0..100
  isTop?: boolean;
}

export const ProbBar: React.FC<ProbBarProps> = ({ label, percentage, isTop = false }) => {
  const { getSpeciesName } = useI18n();
  const displayName = getSpeciesName(label);
  const clampedPercent = Math.min(100, Math.max(0, percentage));

  return (
    <View style={styles.container}>
      <View style={styles.labelRow}>
        <Text style={[styles.speciesName, isTop && styles.topSpeciesName]}>
          {displayName} <Text style={styles.latinSubName}>({label})</Text>
        </Text>
        <Text style={[styles.percentText, isTop && styles.topPercentText]}>
          {clampedPercent}%
        </Text>
      </View>

      <View style={styles.track}>
        <View
          style={[
            styles.fill,
            { width: `${clampedPercent}%` },
            isTop ? styles.topFill : styles.normalFill,
          ]}
        />
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    marginVertical: 6,
  },
  labelRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 4,
  },
  speciesName: {
    fontSize: 15,
    fontWeight: '700',
    color: '#1E293B',
  },
  topSpeciesName: {
    color: '#0369A1',
    fontWeight: '800',
  },
  latinSubName: {
    fontSize: 12,
    fontWeight: '400',
    color: '#64748B',
  },
  percentText: {
    fontSize: 14,
    fontWeight: '700',
    color: '#334155',
  },
  topPercentText: {
    color: '#0369A1',
    fontWeight: '800',
  },
  track: {
    height: 12,
    backgroundColor: '#E2E8F0',
    borderRadius: 6,
    overflow: 'hidden',
  },
  fill: {
    height: '100%',
    borderRadius: 6,
  },
  normalFill: {
    backgroundColor: '#64748B',
  },
  topFill: {
    backgroundColor: '#0284C7',
  },
});
