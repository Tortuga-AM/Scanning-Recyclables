import { ThemedText } from '@/components/themed-text';
import { ThemedView } from '@/components/themed-view';
import { Spacing } from '@/constants/theme';
import { RecyclingFacility, callFacility, openMapsForFacility, visitWebsite } from '@/utils/facilities-finder';
import { Pressable, StyleSheet, View } from 'react-native';

interface FacilitiesListProps {
  facilities: RecyclingFacility[];
  onClose: () => void;
}

export function FacilitiesList({ facilities, onClose }: FacilitiesListProps) {
  if (facilities.length === 0) {
    return (
      <ThemedView style={styles.container}>
        <ThemedText type="subtitle" style={styles.title}>
          No facilities found
        </ThemedText>
        <ThemedText style={styles.message}>
          Unfortunately, no recycling facilities were found in your area.
        </ThemedText>
        <Pressable onPress={onClose} style={styles.closeButton}>
          <ThemedView type="backgroundElement" style={styles.closeButtonContent}>
            <ThemedText style={styles.closeButtonText}>Close</ThemedText>
          </ThemedView>
        </Pressable>
      </ThemedView>
    );
  }

  return (
    <ThemedView style={styles.container}>
      <ThemedText type="subtitle" style={styles.title}>
        Recycling Facilities Nearby
      </ThemedText>

      <View style={styles.listContainer}>
        {facilities.map((facility, index) => (
          <ThemedView key={index} type="backgroundElement" style={styles.facilityCard}>
            <ThemedText type="smallBold" style={styles.facilityName}>
              {facility.name}
            </ThemedText>

            <ThemedText style={styles.facilityDistance}>
              {facility.distance} km away
            </ThemedText>

            <ThemedText style={styles.facilityAddress}>{facility.address}</ThemedText>

            <ThemedText style={styles.acceptsLabel}>Accepts:</ThemedText>
            <ThemedText style={styles.acceptsTypes}>
              {facility.acceptsTypes.map((t) => t.charAt(0).toUpperCase() + t.slice(1)).join(', ')}
            </ThemedText>

            <View style={styles.facilityActions}>
              <Pressable
                onPress={() => openMapsForFacility(facility)}
                style={({ pressed }) => [styles.actionButton, pressed && styles.pressed]}
              >
                <ThemedText style={styles.actionButtonText}>View Map</ThemedText>
              </Pressable>

              {facility.phone && (
                <Pressable
                  onPress={() => callFacility(facility.phone!)}
                  style={({ pressed }) => [styles.actionButton, pressed && styles.pressed]}
                >
                  <ThemedText style={styles.actionButtonText}>Call</ThemedText>
                </Pressable>
              )}

              {facility.website && (
                <Pressable
                  onPress={() => visitWebsite(facility.website!)}
                  style={({ pressed }) => [styles.actionButton, pressed && styles.pressed]}
                >
                  <ThemedText style={styles.actionButtonText}>Website</ThemedText>
                </Pressable>
              )}
            </View>
          </ThemedView>
        ))}
      </View>

      <Pressable onPress={onClose} style={styles.closeButton}>
        <ThemedView type="backgroundElement" style={styles.closeButtonContent}>
          <ThemedText style={styles.closeButtonText}>Back</ThemedText>
        </ThemedView>
      </Pressable>
    </ThemedView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: Spacing.four,
    gap: Spacing.three,
    justifyContent: 'flex-start',
  },
  title: {
    textAlign: 'center',
  },
  message: {
    textAlign: 'center',
    marginVertical: Spacing.three,
  },
  listContainer: {
    flex: 1,
    gap: Spacing.three,
  },
  facilityCard: {
    padding: Spacing.three,
    borderRadius: Spacing.three,
    gap: Spacing.two,
  },
  facilityName: {
    fontSize: 16,
  },
  facilityDistance: {
    fontSize: 12,
    opacity: 0.7,
    fontWeight: '600',
  },
  facilityAddress: {
    fontSize: 13,
    lineHeight: 18,
  },
  acceptsLabel: {
    fontSize: 12,
    fontWeight: '600',
    marginTop: Spacing.one,
  },
  acceptsTypes: {
    fontSize: 12,
    opacity: 0.8,
  },
  facilityActions: {
    flexDirection: 'row',
    gap: Spacing.two,
    marginTop: Spacing.two,
  },
  actionButton: {
    flex: 1,
    paddingVertical: Spacing.two,
    borderRadius: Spacing.two,
    backgroundColor: 'rgba(59, 130, 246, 0.1)',
    alignItems: 'center',
  },
  pressed: {
    opacity: 0.7,
  },
  actionButtonText: {
    fontSize: 12,
    fontWeight: '600',
    color: '#3B82F6',
  },
  closeButton: {
    marginTop: Spacing.three,
  },
  closeButtonContent: {
    paddingVertical: Spacing.three,
    borderRadius: Spacing.three,
    alignItems: 'center',
  },
  closeButtonText: {
    fontWeight: '600',
    fontSize: 14,
  },
});
