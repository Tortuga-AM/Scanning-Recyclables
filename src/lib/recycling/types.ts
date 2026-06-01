export type RecyclingCategoryId =
  | 'glass'
  | 'medicine'
  | 'electronics'
  | 'bulky'
  | 'battery'
  | 'hazardous'
  | 'plastic'
  | 'paper'
  | 'metal'
  | 'compost'
  | 'textile'
  | 'general';

export type GuidanceSource = 'earth911' | 'ai' | 'local';

export interface GeoCoordinates {
  latitude: number;
  longitude: number;
}

export interface ItemProfile {
  id: RecyclingCategoryId;
  label: string;
  emoji: string;
  earth911Query: string;
  keywords: string[];
  pointsBase: number;
  disposition: string;
  safetyNotes: string[];
  specialHandling: string;
  educationQuery: string;
}

export interface Earth911MaterialResult {
  id: string;
  label: string;
  raw: Record<string, unknown>;
}

export interface Earth911LocationResult {
  id: string;
  name: string;
  address: string;
  city?: string;
  state?: string;
  postalCode?: string;
  distanceMiles?: number;
  phone?: string;
  website?: string;
  acceptedMaterials: string[];
  directionsUrl: string;
  raw: Record<string, unknown>;
}

export interface Earth911LookupResult {
  source: 'earth911' | 'fallback';
  query: string;
  postalCode?: string;
  coordinates?: GeoCoordinates;
  materialIds: string[];
  locations: Earth911LocationResult[];
  notice?: string;
}

export interface AiGuidanceResult {
  source: GuidanceSource;
  headline: string;
  summary: string;
  nextAction: string;
  safetyNotes: string[];
  reasoning: string;
  notice?: string;
}

export interface RecyclingGuidanceResult {
  itemText: string;
  postalCode?: string;
  barcode?: string;
  profile: ItemProfile;
  earth911: Earth911LookupResult;
  assistant: AiGuidanceResult;
  pointsAwarded: number;
  generatedAt: string;
}

export interface ScanHistoryEntry {
  id: string;
  itemText: string;
  categoryId: RecyclingCategoryId;
  scannedAt: string;
  pointsAwarded: number;
  earth911Source: 'earth911' | 'fallback';
  locationCount: number;
  headline: string;
}

export interface RecyclingProgressState {
  totalPoints: number;
  currentStreak: number;
  bestStreak: number;
  totalScans: number;
  lastScanAt: string | null;
  history: ScanHistoryEntry[];
}

export interface RecyclingBadge {
  id: string;
  label: string;
  description: string;
  unlocked: boolean;
}

export interface EducationalResource {
  id: string;
  title: string;
  summary: string;
  href: string;
  source: string;
  categoryIds: RecyclingCategoryId[];
}
