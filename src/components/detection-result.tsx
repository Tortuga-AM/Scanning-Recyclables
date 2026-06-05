import { ThemedText } from '@/components/themed-text';
import { ThemedView } from '@/components/themed-view';
import { Spacing } from '@/constants/theme';
import { getRecyclableInfo, RecyclableType } from '@/utils/recyclable-info';
import { Pressable, StyleSheet } from 'react-native';

interface DetectionResultProps {
  recyclableType: RecyclableType;
  confidence: number;
  onReset: () => void;
  onFindFacilities?: () => void;
}

export function DetectionResult({
  recyclableType,
  confidence,
  onReset,
  onFindFacilities,
}: DetectionResultProps) {
  const info = getRecyclableInfo(recyclableType);
  const confidencePercent = Math.round(confidence * 100);

  return (
    <ThemedView style={styles.container}>
      <ThemedView style={[styles.badge, { backgroundColor: info.color }]}>
        <ThemedText style={styles.badgeText}>{info.type.toUpperCase()}</ThemedText>
      </ThemedView>

      <ThemedText type="subtitle" style={styles.title}>
        {info.type.charAt(0).toUpperCase() + info.type.slice(1)} Detected
      </ThemedText>

      <ThemedText style={styles.confidence} themeColor="textSecondary">
        Confidence: {confidencePercent}%
      </ThemedText>

      <ThemedView type="backgroundElement" style={styles.section}>
        <ThemedText type="smallBold" style={styles.sectionTitle}>
          Instructions
        </ThemedText>
        <ThemedText style={styles.sectionContent}>{info.instructions}</ThemedText>
      </ThemedView>

      <ThemedView type="backgroundElement" style={styles.section}>
        <ThemedText type="smallBold" style={styles.sectionTitle}>
          Examples
        </ThemedText>
        <ThemedText style={styles.sectionContent}>{info.examples.join(', ')}</ThemedText>
      </ThemedView>

      <ThemedView type="backgroundElement" style={styles.section}>
        <ThemedText type="smallBold" style={styles.sectionTitle}>
          Tips
        </ThemedText>
        {info.tips.map((tip, index) => (
          <ThemedText key={index} style={styles.tipText}>
            • {tip}
          </ThemedText>
        ))}
      </ThemedView>

      <ThemedView style={styles.buttonContainer}>
        <Pressable onPress={onReset} style={({ pressed }) => [styles.button, styles.secondaryButton, pressed && styles.pressed]}>
          <ThemedView type="backgroundElement" style={styles.buttonContent}>
            <ThemedText style={styles.buttonText}>Scan Again</ThemedText>
          </ThemedView>
        </Pressable>

        {onFindFacilities && (
          <Pressable onPress={onFindFacilities} style={({ pressed }) => [styles.button, pressed && styles.pressed]}>
            <ThemedView
              type="backgroundElement"
              style={[styles.buttonContent, styles.primaryButtonContent, { backgroundColor: info.color }]}
            >
              <ThemedText style={[styles.buttonText, styles.primaryButtonText]}>
                Find Facilities
              </ThemedText>
            </ThemedView>
          </Pressable>
        )}
      </ThemedView>
    </ThemedView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: Spacing.four,
    gap: Spacing.three,
    justifyContent: 'center',
  },
  badge: {
    alignSelf: 'center',
    paddingHorizontal: Spacing.four,
    paddingVertical: Spacing.two,
    borderRadius: Spacing.three,
  },
  badgeText: {
    color: '#FFF',
    fontSize: 14,
    fontWeight: '600',
  },
  title: {
    textAlign: 'center',
  },
  confidence: {
    textAlign: 'center',
    fontSize: 12,
  },
  section: {
    padding: Spacing.three,
    borderRadius: Spacing.three,
    gap: Spacing.two,
  },
  sectionTitle: {
    marginBottom: Spacing.one,
  },
  sectionContent: {
    lineHeight: 20,
  },
  tipText: {
    marginVertical: Spacing.one,
    lineHeight: 18,
  },
  buttonContainer: {
    flexDirection: 'row',
    gap: Spacing.two,
    marginTop: Spacing.four,
  },
  button: {
    flex: 1,
    paddingVertical: Spacing.three,
    borderRadius: Spacing.three,
    alignItems: 'center',
    justifyContent: 'center',
  },
  secondaryButton: {},
  primaryButton: {},
  buttonText: {
    fontWeight: '600',
    fontSize: 14,
  },
  primaryButtonText: {
    color: '#FFF',
  },
});
