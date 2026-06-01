import { createContext, useCallback, useContext, useEffect, useMemo, useState, type Dispatch, type ReactNode, type SetStateAction } from 'react';

import { buildEarth911Query, getEducationalFallbackResources, getItemProfile, getProfileById, getUnlockedBadges } from './catalog';
import { generateAiGuidance } from './ai';
import { buildDirectionsUrl, searchEarth911Locations } from './earth911';
import { computeProgressState } from './progress';
import { DEFAULT_PROGRESS_STATE, loadProgressState, saveProgressState } from './storage';
import { deriveUpdatedProgress, makeHistoryEntry, resolveRecyclingGuidance } from './service';
import type {
  Earth911LocationResult,
  RecyclingBadge,
  RecyclingGuidanceResult,
  RecyclingProgressState,
  ScanHistoryEntry,
  GeoCoordinates,
  EducationalResource,
} from './types';

export interface RecyclingDraft {
  itemText: string;
  postalCode: string;
  barcode: string;
}

interface RecyclingAppContextValue {
  draft: RecyclingDraft;
  setDraft: (patch: Partial<RecyclingDraft>) => void;
  submitScan: () => Promise<void>;
  busy: boolean;
  loading: boolean;
  error: string | null;
  guidance: RecyclingGuidanceResult | null;
  progress: RecyclingProgressState;
  badges: RecyclingBadge[];
  resources: EducationalResource[];
  clearResult: () => void;
  refreshProgress: () => Promise<void>;
  lastLocations: Earth911LocationResult[];
}

const RecyclingAppContext = createContext<RecyclingAppContextValue | undefined>(undefined);

function buildResourceList(guidance: RecyclingGuidanceResult | null) {
  if (!guidance) {
    return getEducationalFallbackResources(getProfileById('general'));
  }

  return getEducationalFallbackResources(guidance.profile);
}

export function RecyclingAppProvider({ children }: { children: ReactNode }) {
  const [draft, setDraftState] = useState<RecyclingDraft>({ itemText: '', postalCode: '', barcode: '' });
  const [guidance, setGuidance] = useState<RecyclingGuidanceResult | null>(null);
  const [progress, setProgress] = useState<RecyclingProgressState>(DEFAULT_PROGRESS_STATE);
  const [loading, setLoading] = useState(true);
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let active = true;
    loadProgressState()
      .then((saved) => {
        if (active) {
          setProgress(saved);
        }
      })
      .finally(() => {
        if (active) {
          setLoading(false);
        }
      });

    return () => {
      active = false;
    };
  }, []);

  const persistProgress = useCallback(async (nextProgress: RecyclingProgressState) => {
    setProgress(nextProgress);
    await saveProgressState(nextProgress);
  }, []);

  const setDraft = useCallback((patch: Partial<RecyclingDraft>) => {
    setDraftState((current) => ({ ...current, ...patch }));
  }, []);

  const refreshProgress = useCallback(async () => {
    const saved = await loadProgressState();
    setProgress(saved);
  }, []);

  const clearResult = useCallback(() => {
    setGuidance(null);
    setError(null);
  }, []);

  const submitScan = useCallback(async () => {
    const itemText = draft.itemText.trim();
    const postalCode = draft.postalCode.trim() || undefined;
    const barcode = draft.barcode.trim() || undefined;

    if (!itemText && !barcode) {
      setError('Enter an item name or barcode to get recycling guidance.');
      return;
    }

    setBusy(true);
    setError(null);

    try {
      const result = await resolveRecyclingGuidance({ itemText: itemText || barcode || 'recycling item', postalCode, barcode });
      const entry = makeHistoryEntry(result);
      const nextProgress = deriveUpdatedProgress(progress, entry);
      await persistProgress(nextProgress);
      setGuidance(result);
    } catch (err) {
      const message = err instanceof Error ? err.message : 'Unable to generate recycling guidance right now.';
      setError(message);
    } finally {
      setBusy(false);
    }
  }, [draft.barcode, draft.itemText, draft.postalCode, persistProgress, progress]);

  const badges = useMemo(() => getUnlockedBadges(progress), [progress]);
  const resources = useMemo(() => buildResourceList(guidance), [guidance]);
  const lastLocations = guidance?.earth911.locations ?? [];

  const value = useMemo<RecyclingAppContextValue>(
    () => ({
      draft,
      setDraft,
      submitScan,
      busy,
      loading,
      error,
      guidance,
      progress,
      badges,
      resources,
      clearResult,
      refreshProgress,
      lastLocations,
    }),
    [
      badges,
      busy,
      clearResult,
      draft,
      error,
      guidance,
      lastLocations,
      loading,
      progress,
      refreshProgress,
      resources,
      setDraft,
      submitScan,
    ],
  );

  return <RecyclingAppContext.Provider value={value}>{children}</RecyclingAppContext.Provider>;
}

export function useRecyclingApp() {
  const context = useContext(RecyclingAppContext);
  if (!context) {
    throw new Error('useRecyclingApp must be used within a RecyclingAppProvider.');
  }

  return context;
}

export { buildEarth911Query, buildDirectionsUrl, computeProgressState, generateAiGuidance, searchEarth911Locations };
