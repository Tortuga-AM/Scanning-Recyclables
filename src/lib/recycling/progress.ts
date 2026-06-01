import type { RecyclingProgressState, ScanHistoryEntry } from './types';

function sortLatestFirst(left: ScanHistoryEntry, right: ScanHistoryEntry) {
  return right.scannedAt.localeCompare(left.scannedAt);
}

function uniqueDays(history: ScanHistoryEntry[]) {
  return Array.from(
    new Set(
      history.map((entry) => {
        const date = new Date(entry.scannedAt);
        return `${date.getUTCFullYear()}-${date.getUTCMonth()}-${date.getUTCDate()}`;
      }),
    ),
  ).sort();
}

export function computeCurrentStreak(history: ScanHistoryEntry[]) {
  const days = uniqueDays(history);
  if (days.length === 0) {
    return 0;
  }

  let streak = 1;
  for (let index = days.length - 1; index > 0; index -= 1) {
    const current = new Date(days[index]);
    const previous = new Date(days[index - 1]);
    const deltaDays = Math.round((current.getTime() - previous.getTime()) / (1000 * 60 * 60 * 24));
    if (deltaDays === 1) {
      streak += 1;
      continue;
    }
    break;
  }

  return streak;
}

export function computeBestStreak(history: ScanHistoryEntry[]) {
  const days = uniqueDays(history);
  if (days.length === 0) {
    return 0;
  }

  let best = 1;
  let current = 1;
  for (let index = 1; index < days.length; index += 1) {
    const previous = new Date(days[index - 1]);
    const next = new Date(days[index]);
    const deltaDays = Math.round((next.getTime() - previous.getTime()) / (1000 * 60 * 60 * 24));
    if (deltaDays === 1) {
      current += 1;
      best = Math.max(best, current);
      continue;
    }
    current = 1;
  }

  return best;
}

export function computeProgressState(history: ScanHistoryEntry[]): RecyclingProgressState {
  const sortedHistory = [...history].sort(sortLatestFirst);
  const totalPoints = sortedHistory.reduce((sum, entry) => sum + entry.pointsAwarded, 0);
  return {
    totalPoints,
    totalScans: sortedHistory.length,
    currentStreak: computeCurrentStreak(sortedHistory),
    bestStreak: computeBestStreak(sortedHistory),
    lastScanAt: sortedHistory[0]?.scannedAt ?? null,
    history: sortedHistory,
  };
}
