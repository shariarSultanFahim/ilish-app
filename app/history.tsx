import React, { useEffect, useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  Image,
  TouchableOpacity,
  Alert,
} from 'react-native';
import { useRouter } from 'expo-router';
import { useI18n } from '../src/i18n';
import { getHistory, clearHistory, HistoryItem } from '../src/storage/history';
import { BigButton } from '../src/components/BigButton';

export default function HistoryScreen() {
  const router = useRouter();
  const { t, getSpeciesName } = useI18n();
  const [items, setItems] = useState<HistoryItem[]>([]);
  const [loading, setLoading] = useState(true);

  const loadData = async () => {
    setLoading(true);
    const data = await getHistory();
    setItems(data);
    setLoading(false);
  };

  useEffect(() => {
    loadData();
  }, []);

  const handleClear = () => {
    Alert.alert(t.clearHistoryButton, t.clearHistoryConfirm, [
      { text: t.cancelButton, style: 'cancel' },
      {
        text: t.confirmButton,
        style: 'destructive',
        onPress: async () => {
          await clearHistory();
          setItems([]);
        },
      },
    ]);
  };

  const renderItem = ({ item }: { item: HistoryItem }) => {
    const isIlish = item.verdict === 'ILISH';
    const isUnsure = item.verdict === 'UNSURE';
    const badgeColor = isIlish ? '#16A34A' : isUnsure ? '#D97706' : '#DC2626';
    const dateStr = new Date(item.timestamp).toLocaleDateString();

    return (
      <View style={styles.historyCard}>
        <Image source={{ uri: item.imageUri }} style={styles.thumbImage} resizeMode="cover" />

        <View style={styles.infoContainer}>
          <View style={styles.row}>
            <View style={[styles.verdictBadge, { backgroundColor: badgeColor }]}>
              <Text style={styles.verdictBadgeText}>{item.verdict}</Text>
            </View>
            <Text style={styles.confidenceText}>{item.confidence}%</Text>
          </View>

          <Text style={styles.speciesNameText}>
            {getSpeciesName(item.topClass)} ({item.topClass})
          </Text>

          <View style={styles.footerRow}>
            <Text style={styles.dateText}>{dateStr}</Text>
            <Text style={styles.timingText}>{item.inferenceTimeMs}ms</Text>
          </View>
        </View>
      </View>
    );
  };

  return (
    <View style={styles.container}>
      {items.length === 0 && !loading ? (
        <View style={styles.emptyContainer}>
          <Text style={styles.emptyIcon}>🐟</Text>
          <Text style={styles.emptyText}>{t.historyEmpty}</Text>
        </View>
      ) : (
        <FlatList
          data={items}
          keyExtractor={(item) => item.id}
          renderItem={renderItem}
          contentContainerStyle={styles.listContainer}
        />
      )}

      {items.length > 0 && (
        <View style={styles.footerBar}>
          <BigButton
            title={t.clearHistoryButton}
            onPress={handleClear}
            variant="danger"
            style={styles.clearBtn}
          />
        </View>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F8FAFC',
  },
  listContainer: {
    padding: 16,
    paddingBottom: 80,
  },
  historyCard: {
    flexDirection: 'row',
    backgroundColor: '#FFFFFF',
    borderRadius: 14,
    padding: 12,
    marginBottom: 12,
    borderWidth: 1,
    borderColor: '#E2E8F0',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 2,
    elevation: 1,
  },
  thumbImage: {
    width: 72,
    height: 72,
    borderRadius: 10,
    backgroundColor: '#0F172A',
  },
  infoContainer: {
    flex: 1,
    marginLeft: 14,
  },
  row: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  verdictBadge: {
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: 6,
  },
  verdictBadgeText: {
    color: '#FFFFFF',
    fontSize: 12,
    fontWeight: '800',
  },
  confidenceText: {
    fontSize: 15,
    fontWeight: '800',
    color: '#0F172A',
  },
  speciesNameText: {
    fontSize: 15,
    fontWeight: '700',
    color: '#334155',
    marginTop: 4,
  },
  footerRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginTop: 6,
  },
  dateText: {
    fontSize: 12,
    color: '#94A3B8',
  },
  timingText: {
    fontSize: 12,
    color: '#64748B',
    fontWeight: '600',
  },
  emptyContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 40,
  },
  emptyIcon: {
    fontSize: 48,
    marginBottom: 14,
  },
  emptyText: {
    fontSize: 16,
    color: '#64748B',
    textAlign: 'center',
    lineHeight: 22,
  },
  footerBar: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    padding: 16,
    backgroundColor: '#FFFFFF',
    borderTopWidth: 1,
    borderTopColor: '#E2E8F0',
  },
  clearBtn: {
    minHeight: 46,
  },
});
