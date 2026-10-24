import AsyncStorage from '@react-native-async-storage/async-storage';
import { Paths, Directory, File } from 'expo-file-system';
import { Verdict } from '../ml/decide';

export interface HistoryItem {
  id: string;
  imageUri: string;
  verdict: Verdict;
  confidence: number;
  topClass: string;
  bestGuessSpecies?: string;
  timestamp: number;
  inferenceTimeMs: number;
}

const HISTORY_STORAGE_KEY = '@ilish_checker_history_v1';
const MAX_HISTORY_ITEMS = 50;

/**
 * Get or create the local document directory for saved images
 */
function getHistoryDirectory(): Directory {
  const dir = new Directory(Paths.document, 'history_images');
  if (!dir.exists) {
    dir.create({ idempotent: true });
  }
  return dir;
}

/**
 * Load history items from AsyncStorage
 */
export async function getHistory(): Promise<HistoryItem[]> {
  try {
    const raw = await AsyncStorage.getItem(HISTORY_STORAGE_KEY);
    if (!raw) return [];
    return JSON.parse(raw) as HistoryItem[];
  } catch (error) {
    console.warn('Failed to load history:', error);
    return [];
  }
}

/**
 * Save an item to history, copying the image to app document directory
 */
export async function saveToHistory(item: Omit<HistoryItem, 'id' | 'timestamp'>): Promise<HistoryItem> {
  const id = `${Date.now()}_${Math.random().toString(36).substr(2, 6)}`;
  let finalUri = item.imageUri;

  try {
    const historyDir = getHistoryDirectory();
    const ext = item.imageUri.split('.').pop() || 'jpg';
    const destFile = new File(historyDir, `fish_${id}.${ext}`);
    const sourceFile = new File(item.imageUri);

    if (sourceFile.exists) {
      await sourceFile.copy(destFile);
      finalUri = destFile.uri;
    }
  } catch (copyErr) {
    console.warn('Failed copying image for history, saving original URI:', copyErr);
  }

  const newItem: HistoryItem = {
    ...item,
    id,
    imageUri: finalUri,
    timestamp: Date.now(),
  };

  const currentHistory = await getHistory();
  const updatedHistory = [newItem, ...currentHistory];

  // Keep only up to MAX_HISTORY_ITEMS (50)
  if (updatedHistory.length > MAX_HISTORY_ITEMS) {
    const excess = updatedHistory.slice(MAX_HISTORY_ITEMS);
    for (const ex of excess) {
      try {
        const file = new File(ex.imageUri);
        if (file.exists) {
          file.delete();
        }
      } catch {
        // ignore delete failures
      }
    }
  }

  const trimmed = updatedHistory.slice(0, MAX_HISTORY_ITEMS);
  await AsyncStorage.setItem(HISTORY_STORAGE_KEY, JSON.stringify(trimmed));
  return newItem;
}

/**
 * Clear all history and saved images
 */
export async function clearHistory(): Promise<void> {
  try {
    await AsyncStorage.removeItem(HISTORY_STORAGE_KEY);
    const historyDir = new Directory(Paths.document, 'history_images');
    if (historyDir.exists) {
      historyDir.delete();
    }
  } catch (err) {
    console.warn('Failed to clear history:', err);
  }
}
