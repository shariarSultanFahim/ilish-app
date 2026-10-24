import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { Verdict } from '../ml/decide';
import { useI18n } from '../i18n';

interface VerdictCardProps {
  verdict: Verdict;
  confidencePercentage: number;
  bestGuessSpecies?: string;
}

export const VerdictCard: React.FC<VerdictCardProps> = ({
  verdict,
  confidencePercentage,
  bestGuessSpecies,
}) => {
  const { t, format, getSpeciesName } = useI18n();

  const getVerdictConfig = () => {
    switch (verdict) {
      case 'ILISH':
        return {
          bgColor: '#DCFCE7', // Light green
          borderColor: '#16A34A', // Deep green
          textColor: '#14532D',
          badgeColor: '#16A34A',
          iconSymbol: '✓',
          title: t.verdictIlish,
          subtitle: t.verdictIlishSub,
        };
      case 'NOT_ILISH':
        const displaySpecies = bestGuessSpecies ? getSpeciesName(bestGuessSpecies) : '';
        return {
          bgColor: '#FEE2E2', // Light red
          borderColor: '#DC2626', // Red
          textColor: '#7F1D1D',
          badgeColor: '#DC2626',
          iconSymbol: '✕',
          title: t.verdictNotIlish,
          subtitle: format(t.verdictNotIlishSub, { species: displaySpecies }),
        };
      case 'UNSURE':
      default:
        return {
          bgColor: '#FEF3C7', // Light amber
          borderColor: '#D97706', // Amber
          textColor: '#78350F',
          badgeColor: '#D97706',
          iconSymbol: '?',
          title: t.verdictUnsure,
          subtitle: t.verdictUnsureSub,
        };
    }
  };

  const config = getVerdictConfig();

  return (
    <View
      style={[
        styles.card,
        {
          backgroundColor: config.bgColor,
          borderColor: config.borderColor,
        },
      ]}
    >
      <View style={styles.headerRow}>
        <View style={[styles.iconCircle, { backgroundColor: config.badgeColor }]}>
          <Text style={styles.iconText}>{config.iconSymbol}</Text>
        </View>

        <View style={styles.titleContainer}>
          <Text style={[styles.verdictTitle, { color: config.textColor }]}>
            {config.title}
          </Text>
          <Text style={[styles.verdictSubtitle, { color: config.textColor }]}>
            {config.subtitle}
          </Text>
        </View>

        <View style={[styles.confidenceBadge, { backgroundColor: config.badgeColor }]}>
          <Text style={styles.confidenceLabelText}>{t.confidenceLabel}</Text>
          <Text style={styles.confidenceNumberText}>{confidencePercentage}%</Text>
        </View>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  card: {
    borderWidth: 2,
    borderRadius: 16,
    padding: 18,
    marginVertical: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 5,
    elevation: 2,
  },
  headerRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  iconCircle: {
    width: 48,
    height: 48,
    borderRadius: 24,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 14,
  },
  iconText: {
    color: '#FFFFFF',
    fontSize: 26,
    fontWeight: '900',
  },
  titleContainer: {
    flex: 1,
    paddingRight: 8,
  },
  verdictTitle: {
    fontSize: 26,
    fontWeight: '900',
    letterSpacing: 0.5,
  },
  verdictSubtitle: {
    fontSize: 14,
    fontWeight: '600',
    marginTop: 2,
  },
  confidenceBadge: {
    paddingHorizontal: 10,
    paddingVertical: 6,
    borderRadius: 10,
    alignItems: 'center',
    justifyContent: 'center',
    minWidth: 64,
  },
  confidenceLabelText: {
    color: '#FFFFFF',
    fontSize: 10,
    fontWeight: '700',
    textTransform: 'uppercase',
  },
  confidenceNumberText: {
    color: '#FFFFFF',
    fontSize: 17,
    fontWeight: '900',
  },
});
