export interface RecyclingFacility {
  name: string;
  address: string;
  distance: number;
  phone?: string;
  website?: string;
  acceptsTypes: string[];
}

export async function findNearbyFacilities(
  recyclableType: string,
  latitude?: number,
  longitude?: number
): Promise<RecyclingFacility[]> {
  try {
    // For now, provide mock facilities data
    // In production, this would query a real API like Earth911, Google Maps, or local waste management
    const mockFacilities: RecyclingFacility[] = [
      {
        name: 'Green Waste Recycling Center',
        address: '123 Eco St, Your City, ST 12345',
        distance: 2.3,
        phone: '(555) 123-4567',
        website: 'www.greenwasterecycling.com',
        acceptsTypes: ['plastic', 'metal', 'glass', 'paper'],
      },
      {
        name: 'Community Recycling Hub',
        address: '456 Sustainability Ave, Your City, ST 12345',
        distance: 3.1,
        phone: '(555) 987-6543',
        website: 'www.communityrecycling.org',
        acceptsTypes: ['plastic', 'paper', 'cardboard'],
      },
      {
        name: 'Local Waste Management',
        address: '789 Green Lane, Your City, ST 12345',
        distance: 1.8,
        phone: '(555) 456-7890',
        acceptsTypes: ['metal', 'glass', 'plastic', 'paper', 'compostable'],
      },
    ];

    // Filter facilities that accept the detected type
    const filtered = mockFacilities.filter((facility) =>
      facility.acceptsTypes.some((type) =>
        type.toLowerCase().includes(recyclableType.toLowerCase())
      )
    );

    // Sort by distance
    return filtered.sort((a, b) => a.distance - b.distance);
  } catch (error) {
    console.error('Error finding facilities:', error);
    return [];
  }
}

export function openMapsForFacility(facility: RecyclingFacility): void {
  const encodedAddress = encodeURIComponent(facility.address);
  const mapsUrl = `https://www.google.com/maps/search/${encodedAddress}`;
  window.open(mapsUrl, '_blank');
}

export function callFacility(phone: string): void {
  window.location.href = `tel:${phone}`;
}

export function visitWebsite(website: string): void {
  window.open(website, '_blank');
}
