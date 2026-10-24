import React, { useEffect, useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  Image,
  ActivityIndicator,
  Alert,
} from 'react-native';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { useI18n } from '../src/i18n';
import { classifyFish, InferenceResult } from '../src/ml/classifier';
import { VerdictCard } from '../src/components/VerdictCard';
import { ProbBar } from '../src/components/ProbBar';
import { BigButton } from '../src/components/BigButton';
import { saveToHistory } from '../src/storage/history';

export default function ResultScreen() {
  const router = useRouter();
  const { uri } = useLocalSearchParams<{ uri: string }>();
  const { t, format } = useI18n();

  const [loading, setLoading] = useState(true);
  const [result, setResult] = useState<InferenceResult | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [saved, setSaved] = useState(false);

  const runClassification = async (imageUri: string) => {
    setLoading(true);
    setError(null);
    try {
      const infResult = await classifyFish(imageUri);
      setResult(infResult);
    } catch (err) {
      console.error('Classification error:', err);
      const msg = err instanceof Error ? err.message : t.processingError;
      setError(msg);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (uri) {
      runClassification(uri);
    } else {
      setError('No image provided');
      setLoading(false);
    }
  }, [uri]);

  const handleSave = async () => {
    if (!result || saved) return;
    try {
      await saveToHistory({
        imageUri: result.imageUri,
        verdict: result.decision.verdict,
        confidence: result.decision.topPercentage,
        topClass: result.decision.topClass,
        bestGuessSpecies: result.decision.bestGuessSpecies,
        inferenceTimeMs: result.totalTimeMs,
      });
      setSaved(true);
      Alert.alert('✓', t.savedToast);
    } catch (saveErr) {
      console.warn('Save error:', saveErr);
    }
  };

  return (
    <ScrollView contentContainerStyle={styles.container}>
      {/* Photo Preview */}
      <View style={styles.imageCard}>
        {uri ? (
          <Image source={{ uri }} style={styles.previewImage} resizeMode="cover" />
        ) : (
          <View style={styles.placeholderBox} />
        )}
      </View>

      {/* Loading State */}
      {loading && (
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color="#0284C7" />
          <Text style={styles.loadingText}>{t.analyzingImage}</Text>
        </View>
      )}

      {/* Error State */}
      {!loading && error && (
        <View style={styles.errorBox}>
          <Text style={styles.errorText}>{error}</Text>
          <BigButton
            title={t.retryButton}
            onPress={() => uri && runClassification(uri)}
            variant="outline"
            style={styles.retryBtn}
          />
        </View>
      )}

      {/* Results State */}
      {!loading && result && (
        <View style={styles.resultDetails}>
          {/* Verdict Card */}
          <VerdictCard
            verdict={result.decision.verdict}
            confidencePercentage={result.decision.topPercentage}
            bestGuessSpecies={result.decision.bestGuessSpecies}
          />

          {/* Top 3 Predictions */}
          <View style={styles.predictionsSection}>
            <Text style={styles.predictionsTitle}>{t.topPredictionsTitle}</Text>
            {result.decision.top3.map((pred, index) => (
              <ProbBar
                key={pred.label}
                label={pred.label}
                percentage={pred.percentage}
                isTop={index === 0}
              />
            ))}
          </View>

          {/* Inference timing breakdown */}
          <View style={styles.timingBox}>
            <Text style={styles.timingText}>
              ⏱️{' '}
              {format(t.inferenceTime, {
                total: result.totalTimeMs,
                prep: result.preprocessTimeMs,
                model: result.modelTimeMs,
              })}
            </Text>
          </View>

          {/* Action buttons: Check another & Save */}
          <View style={styles.actionsBox}>
            <BigButton
              title={t.checkAnotherButton}
              onPress={() => router.back()}
              variant="primary"
            />

            <BigButton
              title={saved ? t.alreadySaved : t.saveButton}
              onPress={handleSave}
              disabled={saved}
              variant="outline"
              style={styles.saveBtn}
            />
          </View>

          {/* Academic & Model Disclaimer */}
          <View style={styles.disclaimerBox}>
            <Text style={styles.disclaimerText}>{t.disclaimerText}</Text>
          </View>
        </View>
      )}
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    padding: 20,
    backgroundColor: '#F8FAFC',
    paddingBottom: 40,
  },
  imageCard: {
    width: '100%',
    height: 250,
    borderRadius: 16,
    overflow: 'hidden',
    backgroundColor: '#0F172A',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 5,
    elevation: 3,
  },
  previewImage: {
    width: '100%',
    height: '100%',
  },
  placeholderBox: {
    flex: 1,
    backgroundColor: '#E2E8F0',
  },
  loadingContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 40,
  },
  loadingText: {
    marginTop: 14,
    fontSize: 16,
    fontWeight: '700',
    color: '#334155',
  },
  errorBox: {
    backgroundColor: '#FEE2E2',
    borderWidth: 1,
    borderColor: '#FCA5A5',
    borderRadius: 12,
    padding: 16,
    marginVertical: 20,
    alignItems: 'center',
  },
  errorText: {
    color: '#991B1B',
    fontSize: 15,
    fontWeight: '600',
    textAlign: 'center',
    marginBottom: 12,
  },
  retryBtn: {
    minHeight: 44,
    paddingVertical: 8,
  },
  resultDetails: {
    marginTop: 10,
  },
  predictionsSection: {
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    padding: 16,
    marginTop: 10,
    borderWidth: 1,
    borderColor: '#E2E8F0',
  },
  predictionsTitle: {
    fontSize: 17,
    fontWeight: '800',
    color: '#0F172A',
    marginBottom: 10,
  },
  timingBox: {
    marginTop: 12,
    alignItems: 'center',
  },
  timingText: {
    fontSize: 13,
    color: '#64748B',
    fontWeight: '600',
  },
  actionsBox: {
    marginTop: 22,
    gap: 12,
  },
  saveBtn: {
    borderColor: '#0284C7',
  },
  disclaimerBox: {
    marginTop: 24,
    backgroundColor: '#F1F5F9',
    padding: 14,
    borderRadius: 12,
    borderLeftWidth: 4,
    borderLeftColor: '#64748B',
  },
  disclaimerText: {
    fontSize: 12,
    color: '#475569',
    lineHeight: 18,
    fontWeight: '500',
  },
});
