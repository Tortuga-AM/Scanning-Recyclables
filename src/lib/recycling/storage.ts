import AsyncStorage from '@react-native-async-storage/async-storage';

import { computeProgressState } from './progress';
import type { RecyclingProgressState, ScanHistoryEntry } from './types';

const STORAGE_KEY = 'recyclebuddy.progress.v1';

export const DEFAULT_PROGRESS_STATE: RecyclingProgressState = {
  totalPoints: 0,
  currentStreak: 0,
  bestStreak: 0,
  totalScans: 0,
  lastScanAt: null,
  history: [],
};

function toHistoryEntry(value: unknown): ScanHistoryEntry | null {
  if (!value || typeof value !== 'object') {
    return null;
  }
  const candidate = value as Partial<ScanHistoryEntry>;
  if (
    typeof candidate.id !== 'string' ||
    typeof candidate.itemText !== 'string' ||
    typeof candidate.categoryId !== 'string' ||
    typeof candidate.scannedAt !== 'string' ||
    typeof candidate.pointsAwarded !== 'number' ||
    typeof candidate.earth911Source !== 'string' ||
    typeof candidate.locationCount !== 'number' ||
    typeof candidate.headline !== 'string'
  ) {
    return null;
  }

  return candidate as ScanHistoryEntry;
}

export async function loadProgressState(): Promise<RecyclingProgressState> {
  const raw = await AsyncStorage.getItem(STORAGE_KEY);
  if (!raw) {
    return DEFAULT_PROGRESS_STATE;
  }

  try {
    const parsed = JSON.parse(raw) as Partial<RecyclingProgressState> & { history?: unknown[] };
    const history = Array.isArray(parsed.history) ? parsed.history.map(toHistoryEntry).filter((entry): entry is ScanHistoryEntry => entry !== null) : [];
    return computeProgressState(history);
  } catch {
    return DEFAULT_PROGRESS_STATE;
  }
}

export async function saveProgressState(state: RecyclingProgressState) {
  await AsyncStorage.setItem(STORAGE_KEY, JSON.stringify(state));
}
