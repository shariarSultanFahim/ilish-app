import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, ScrollView, Platform } from 'react-native';
import { useI18n } from '../src/i18n';
import {
  getModelMetadata,
  getLastInferenceDetails,
  initClassifier,
  ModelMetadata,
  InferenceResult,
} from '../src/ml/classifier';
import { BigButton } from '../src/components/BigButton';

export default function DebugScreen() {
  const { t, getSpeciesName } = useI18n();
  const [meta, setMeta] = useState<ModelMetadata>(getModelMetadata());
  const [lastInf, setLastInf] = useState<InferenceResult | null>(getLastInferenceDetails());
  const [reloading, setReloading] = useState(false);

  useEffect(() => {
    // Refresh state
    setMeta(getModelMetadata());
    setLastInf(getLastInferenceDetails());
  }, []);

  const handleReloadModel = async () => {
    setReloading(true);
    try {
      const freshMeta = await initClassifier();
      setMeta(freshMeta);
    } catch (e) {
      console.warn('Debug reload error:', e);
      setMeta(getModelMetadata());
    } finally {
      setReloading(false);
    }
  };

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <Text style={styles.title}>{t.debugTitle}</Text>
      <Text style={styles.subtitle}>{t.debugSubtitle}</Text>

      {/* Model Contract & Status */}
      <View style={styles.card}>
        <Text style={styles.cardHeader}>{t.modelStatus}</Text>

        <View style={styles.row}>
          <Text style={styles.fieldLabel}>Status:</Text>
          <View
            style={[
              styles.statusPill,
              meta.isLoaded ? styles.loadedPill : styles.errorPill,
            ]}
          >
            <Text
              style={[
                styles.statusText,
                meta.isLoaded ? styles.loadedText : styles.errorText,
              ]}
            >
              {meta.isLoaded ? t.modelLoaded : t.modelFailed}
            </Text>
          </View>
        </View>

        <View style={styles.row}>
          <Text style={styles.fieldLabel}>{t.modelLoadTimeLabel}:</Text>
          <Text style={styles.fieldValue}>{meta.loadTimeMs} ms</Text>
        </View>

        {meta.validationError ? (
          <View style={styles.errorBox}>
            <Text style={styles.errorText}>Error: {meta.validationError}</Text>
          </View>
        ) : null}

        {/* Input Tensors */}
        <View style={styles.tensorBox}>
          <Text style={styles.fieldLabel}>{t.inputShapeLabel}:</Text>
          {meta.inputs && meta.inputs.length > 0 ? (
            meta.inputs.map((inp, idx) => (
              <Text key={idx} style={styles.codeText}>
                {inp.name} - shape: [{inp.shape.join(', ')}] - type: {inp.dataType}
              </Text>
            ))
          ) : (
            <Text style={styles.codeText}>None recorded</Text>
          )}
        </View>

        {/* Output Tensors */}
        <View style={styles.tensorBox}>
          <Text style={styles.fieldLabel}>{t.outputShapeLabel}:</Text>
          {meta.outputs && meta.outputs.length > 0 ? (
            meta.outputs.map((out, idx) => (
              <Text key={idx} style={styles.codeText}>
                {out.name} - shape: [{out.shape.join(', ')}] - type: {out.dataType}
              </Text>
            ))
          ) : (
            <Text style={styles.codeText}>None recorded</Text>
          )}
        </View>

        <BigButton
          title="Re-initialize Model"
          onPress={handleReloadModel}
          loading={reloading}
          variant="outline"
          style={styles.reloadBtn}
        />
      </View>

      {/* Last Inference Breakdown */}
      <View style={styles.card}>
        <Text style={styles.cardHeader}>{t.lastInferenceHeading}</Text>

        {lastInf ? (
          <View>
            <View style={styles.row}>
              <Text style={styles.fieldLabel}>Verdict:</Text>
              <Text style={styles.fieldValue}>{lastInf.decision.verdict}</Text>
            </View>
            <View style={styles.row}>
              <Text style={styles.fieldLabel}>Top Class:</Text>
              <Text style={styles.fieldValue}>
                {lastInf.decision.topClass} ({lastInf.decision.topPercentage}%)
              </Text>
            </View>
            <View style={styles.row}>
              <Text style={styles.fieldLabel}>Preprocess Time:</Text>
              <Text style={styles.fieldValue}>{lastInf.preprocessTimeMs} ms</Text>
            </View>
            <View style={styles.row}>
              <Text style={styles.fieldLabel}>Model Inference Time:</Text>
              <Text style={styles.fieldValue}>{lastInf.modelTimeMs} ms</Text>
            </View>
            <View style={styles.row}>
              <Text style={styles.fieldLabel}>Total Pipeline Time:</Text>
              <Text style={styles.fieldValue}>{lastInf.totalTimeMs} ms</Text>
            </View>

            {/* All 9 probabilities */}
            <Text style={[styles.cardHeader, { marginTop: 14 }]}>
              {t.probabilitiesHeading}
            </Text>
            {lastInf.decision.allProbabilities.map((item, idx) => (
              <View key={item.label} style={styles.probRow}>
                <Text style={styles.probName}>
                  {idx}. {getSpeciesName(item.label)} ({item.label}):
                </Text>
                <Text style={styles.probVal}>
                  {(item.probability * 100).toFixed(2)}% ({item.probability.toFixed(4)})
                </Text>
              </View>
            ))}
          </View>
        ) : (
          <Text style={styles.mutedText}>{t.noInferenceYet}</Text>
        )}
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
    fontSize: 22,
    fontWeight: '900',
    color: '#0F172A',
  },
  subtitle: {
    fontSize: 13,
    color: '#64748B',
    marginBottom: 16,
    marginTop: 2,
  },
  card: {
    backgroundColor: '#FFFFFF',
    borderRadius: 14,
    padding: 16,
    marginBottom: 16,
    borderWidth: 1,
    borderColor: '#E2E8F0',
  },
  cardHeader: {
    fontSize: 16,
    fontWeight: '800',
    color: '#0F172A',
    marginBottom: 10,
  },
  row: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 5,
    borderBottomWidth: 1,
    borderBottomColor: '#F1F5F9',
  },
  fieldLabel: {
    fontSize: 14,
    color: '#475569',
    fontWeight: '600',
  },
  fieldValue: {
    fontSize: 14,
    fontWeight: '700',
    color: '#0F172A',
  },
  statusPill: {
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: 8,
  },
  loadedPill: {
    backgroundColor: '#DCFCE7',
  },
  errorPill: {
    backgroundColor: '#FEE2E2',
  },
  statusText: {
    fontSize: 12,
    fontWeight: '800',
  },
  loadedText: {
    color: '#166534',
  },
  errorText: {
    color: '#991B1B',
  },
  errorBox: {
    marginTop: 10,
    padding: 10,
    borderRadius: 8,
    backgroundColor: '#FEF2F2',
  },
  tensorBox: {
    marginVertical: 6,
  },
  codeText: {
    fontFamily: Platform.select({ ios: 'Menlo', android: 'monospace' }),
    fontSize: 12,
    color: '#0F172A',
    backgroundColor: '#F8FAFC',
    padding: 8,
    borderRadius: 6,
    marginTop: 4,
    borderWidth: 1,
    borderColor: '#E2E8F0',
  },
  reloadBtn: {
    marginTop: 14,
    minHeight: 44,
    paddingVertical: 8,
  },
  mutedText: {
    fontSize: 14,
    color: '#64748B',
    fontStyle: 'italic',
    paddingVertical: 8,
  },
  probRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingVertical: 4,
    borderBottomWidth: 1,
    borderBottomColor: '#F8FAFC',
  },
  probName: {
    fontSize: 13,
    color: '#334155',
    fontWeight: '600',
  },
  probVal: {
    fontSize: 13,
    color: '#0284C7',
    fontWeight: '700',
    fontFamily: Platform.select({ ios: 'Menlo', android: 'monospace' }),
  },
});
