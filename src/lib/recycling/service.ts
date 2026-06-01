import { buildEarth911Query, getEducationalFallbackResources, getItemProfile, getProfileById } from './catalog';
import { generateAiGuidance } from './ai';
import { searchEarth911Locations } from './earth911';
import { computeProgressState } from './progress';
import type {
  GeoCoordinates,
  RecyclingGuidanceResult,
  RecyclingProgressState,
  ScanHistoryEntry,
} from './types';

export function calculatePoints(profileId: string, locationCount: number) {
  const baseByCategory: Record<string, number> = {
    glass: 55,
    medicine: 95,
    electronics: 85,
    bulky: 70,
    battery: 90,
    hazardous: 100,
    textile: 50,
    plastic: 40,
    paper: 35,
    metal: 45,
    compost: 45,
    general: 25,
  };

  return (baseByCategory[profileId] ?? 30) + (locationCount > 0 ? 10 : 0);
}

export async function resolveRecyclingGuidance(input: {
  itemText: string;
  postalCode?: string;
  barcode?: string;
  coordinates?: GeoCoordinates | null;
}): Promise<RecyclingGuidanceResult> {
  const { itemText, postalCode, barcode } = input;
  const lookupText = itemText || barcode || 'recycling item';
  const { profile } = getItemProfile(lookupText);
  const query = buildEarth911Query(profile, lookupText);
  const earth911 = await searchEarth911Locations({
    profile,
    query,
    postalCode,
    coordinates: input.coordinates ?? undefined,
  });
  const assistant = await generateAiGuidance({
    profile,
    earth911,
    itemText: lookupText,
    barcode,
  });

  return {
    itemText: lookupText,
    postalCode,
    barcode,
    profile,
    earth911,
    assistant,
    pointsAwarded: calculatePoints(profile.id, earth911.locations.length),
    generatedAt: new Date().toISOString(),
  };
}

export function makeHistoryEntry(result: RecyclingGuidanceResult): ScanHistoryEntry {
  return {
    id: `${result.generatedAt}-${result.profile.id}-${Math.random().toString(16).slice(2, 8)}`,
    itemText: result.itemText,
    categoryId: result.profile.id,
    scannedAt: result.generatedAt,
    pointsAwarded: result.pointsAwarded,
    earth911Source: result.earth911.source,
    locationCount: result.earth911.locations.length,
    headline: result.assistant.headline,
  };
}

export function deriveUpdatedProgress(previous: RecyclingProgressState, entry: ScanHistoryEntry): RecyclingProgressState {
  return computeProgressState([entry, ...previous.history]);
}

export function getResourcesForProfile(profileId: string) {
  return getEducationalFallbackResources(getProfileById(profileId as never));
}
