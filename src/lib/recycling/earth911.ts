import type { Earth911LocationResult, Earth911LookupResult, Earth911MaterialResult, GeoCoordinates, ItemProfile } from './types';

const DEFAULT_BASE_URL = 'https://api.earth911.com';
const API_KEY = process.env.EXPO_PUBLIC_EARTH911_API_KEY?.trim() ?? '';
const BASE_URL = (process.env.EXPO_PUBLIC_EARTH911_BASE_URL?.trim() || DEFAULT_BASE_URL).replace(/\/$/, '');
const MATERIALS_PATH = process.env.EXPO_PUBLIC_EARTH911_MATERIALS_PATH?.trim() || '/materials/search';
const LOCATIONS_PATH = process.env.EXPO_PUBLIC_EARTH911_LOCATIONS_PATH?.trim() || '/locations/search';

function buildUrl(path: string, params: Record<string, string | number | undefined>) {
  const url = new URL(path.startsWith('http') ? path : `${BASE_URL}${path.startsWith('/') ? '' : '/'}${path}`);
  for (const [key, value] of Object.entries(params)) {
    if (value === undefined || value === '') {
      continue;
    }
    url.searchParams.set(key, String(value));
  }
  if (API_KEY) {
    url.searchParams.set('api_key', API_KEY);
  }
  return url;
}

function buildMapSearchUrl(name: string, postalCode?: string, address?: string) {
  const query = [name, address, postalCode].filter(Boolean).join(' ');
  return `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(query)}`;
}

function toMaterialResults(payload: unknown, fallbackLabel: string): Earth911MaterialResult[] {
  const arrays: unknown[] = [];
  if (Array.isArray(payload)) {
    arrays.push(...payload);
  } else if (payload && typeof payload === 'object') {
    const record = payload as Record<string, unknown>;
    for (const key of ['materials', 'data', 'results', 'items']) {
      const value = record[key];
      if (Array.isArray(value)) {
        arrays.push(...value);
      }
    }
  }

  return arrays
    .filter((entry): entry is Record<string, unknown> => Boolean(entry) && typeof entry === 'object')
    .map((entry, index) => ({
      id: String(entry.id ?? entry.material_id ?? entry.value ?? index),
      label: String(entry.name ?? entry.label ?? entry.title ?? fallbackLabel),
      raw: entry,
    }));
}

function toLocationResults(payload: unknown, acceptedMaterials: string[], fallbackQuery: string): Earth911LocationResult[] {
  const arrays: unknown[] = [];
  if (Array.isArray(payload)) {
    arrays.push(...payload);
  } else if (payload && typeof payload === 'object') {
    const record = payload as Record<string, unknown>;
    for (const key of ['locations', 'data', 'results', 'items']) {
      const value = record[key];
      if (Array.isArray(value)) {
        arrays.push(...value);
      }
    }
  }

  return arrays
    .filter((entry): entry is Record<string, unknown> => Boolean(entry) && typeof entry === 'object')
    .map((entry, index) => {
      const name = String(entry.name ?? entry.title ?? entry.facility_name ?? fallbackQuery);
      const address = String(entry.address ?? entry.street_address ?? entry.street ?? '');
      const city = entry.city ? String(entry.city) : undefined;
      const state = entry.state ? String(entry.state) : undefined;
      const postalCode = entry.postal_code ? String(entry.postal_code) : entry.postalCode ? String(entry.postalCode) : undefined;
      const website = entry.website ? String(entry.website) : entry.url ? String(entry.url) : undefined;
      const directionsUrl = String(entry.directions_url ?? entry.directionsUrl ?? '') || buildMapSearchUrl(name, postalCode, address);
      const distanceMiles = typeof entry.distance === 'number' ? entry.distance : typeof entry.distance_mi === 'number' ? entry.distance_mi : undefined;

      return {
        id: String(entry.id ?? entry.location_id ?? entry.facility_id ?? `${index}`),
        name,
        address,
        city,
        state,
        postalCode,
        distanceMiles,
        phone: entry.phone ? String(entry.phone) : undefined,
        website,
        acceptedMaterials,
        directionsUrl,
        raw: entry,
      } satisfies Earth911LocationResult;
    });
}

function buildFallbackLocations(profile: ItemProfile, query: string, postalCode?: string, coordinates?: GeoCoordinates) {
  const locality = postalCode ? `near ${postalCode}` : 'near you';
  const coordinateHint = coordinates ? ` (${coordinates.latitude.toFixed(3)}, ${coordinates.longitude.toFixed(3)})` : '';
  return [
    {
      id: `${profile.id}-fallback-1`,
      name: `${profile.label} drop-off search`,
      address: `Search local recycling or waste facilities ${locality}${coordinateHint}`,
      acceptedMaterials: [profile.label, query],
      directionsUrl: buildMapSearchUrl(`${profile.label} recycling`, postalCode),
      raw: { source: 'fallback' },
    },
  ] satisfies Earth911LocationResult[];
}

async function requestEarth911(path: string, params: Record<string, string | number | undefined>) {
  const response = await fetch(buildUrl(path, params));
  if (!response.ok) {
    throw new Error(`Earth911 request failed with status ${response.status}`);
  }
  return response.json() as Promise<unknown>;
}

export async function fetchEarth911LearningResources(query: string) {
  if (!API_KEY) {
    return [] as Earth911MaterialResult[];
  }

  const payload = await requestEarth911(MATERIALS_PATH, { q: query, query });
  return toMaterialResults(payload, query);
}

export async function searchEarth911Locations(input: {
  profile: ItemProfile;
  query: string;
  postalCode?: string;
  coordinates?: GeoCoordinates;
}): Promise<Earth911LookupResult> {
  const { profile, query, postalCode, coordinates } = input;
  if (!API_KEY) {
    return {
      source: 'fallback',
      query,
      postalCode,
      coordinates,
      materialIds: [],
      locations: buildFallbackLocations(profile, query, postalCode, coordinates),
      notice: 'Earth911 is not configured yet. Showing a safe local fallback.',
    };
  }

  try {
    const materialPayload = await requestEarth911(MATERIALS_PATH, {
      q: query,
      query,
      postal_code: postalCode,
      latitude: coordinates?.latitude,
      longitude: coordinates?.longitude,
    });
    const materials = toMaterialResults(materialPayload, profile.label);
    const materialIds = materials.map((material) => material.id);

    const locationPayload = await requestEarth911(LOCATIONS_PATH, {
      q: query,
      query,
      material_ids: materialIds.join(','),
      postal_code: postalCode,
      latitude: coordinates?.latitude,
      longitude: coordinates?.longitude,
    });
    const locations = toLocationResults(locationPayload, materialIds, query);

    if (locations.length > 0) {
      return {
        source: 'earth911',
        query,
        postalCode,
        coordinates,
        materialIds,
        locations,
      };
    }

    return {
      source: 'fallback',
      query,
      postalCode,
      coordinates,
      materialIds,
      locations: buildFallbackLocations(profile, query, postalCode, coordinates),
      notice: 'Earth911 returned no nearby locations. Showing a safe local fallback.',
    };
  } catch {
    return {
      source: 'fallback',
      query,
      postalCode,
      coordinates,
      materialIds: [],
      locations: buildFallbackLocations(profile, query, postalCode, coordinates),
      notice: 'Earth911 could not be reached. Showing a safe local fallback.',
    };
  }
}

export function buildDirectionsUrl(location: Earth911LocationResult) {
  return location.directionsUrl || buildMapSearchUrl(location.name, location.postalCode, location.address);
}
