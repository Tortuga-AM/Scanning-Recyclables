import { SafeAreaView, ScrollView, StyleSheet } from 'react-native';

import { ThemedText } from '@/components/themed-text';
import { ThemedView } from '@/components/themed-view';
import { BottomTabInset, Spacing } from '@/constants/theme';

export default function HomeScreen() {
  return (
    <ThemedView style={styles.container}>
      <SafeAreaView style={styles.safeArea}>
        <ScrollView contentContainerStyle={styles.content} showsVerticalScrollIndicator={false}>
          <ThemedView style={styles.heroSection}>
            <ThemedText type="title" style={styles.title}>
              RecycleBuddy
            </ThemedText>
            <ThemedText style={styles.subtitle}>
              Help the planet, one recyclable at a time
            </ThemedText>
          </ThemedView>

          <ThemedView type="backgroundElement" style={styles.card}>
            <ThemedText type="subtitle">How it works</ThemedText>
            <ThemedText style={styles.cardText}>
              1. Use the Scan tab to photograph an item
            </ThemedText>
            <ThemedText style={styles.cardText}>
              2. Our AI identifies if it's recyclable
            </ThemedText>
            <ThemedText style={styles.cardText}>
              3. Find nearby recycling facilities
            </ThemedText>
          </ThemedView>

          <ThemedView type="backgroundElement" style={styles.card}>
            <ThemedText type="subtitle">Tips</ThemedText>
            <ThemedText style={styles.cardText}>
              • Use good lighting for best results
            </ThemedText>
            <ThemedText style={styles.cardText}>
              • Center the item in the camera view
            </ThemedText>
            <ThemedText style={styles.cardText}>
              • Make sure items are clean
            </ThemedText>
          </ThemedView>
        </ScrollView>
      </SafeAreaView>
    </ThemedView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  safeArea: {
    flex: 1,
    paddingHorizontal: Spacing.four,
    paddingVertical: Spacing.three,
    paddingBottom: BottomTabInset + Spacing.three,
  },
  content: {
    gap: Spacing.three,
  },
  heroSection: {
    alignItems: 'center',
    justifyContent: 'center',
    gap: Spacing.two,
    paddingVertical: Spacing.four,
  },
  title: {
    textAlign: 'center',
  },
  subtitle: {
    textAlign: 'center',
    fontSize: 16,
    opacity: 0.8,
  },
  card: {
    padding: Spacing.three,
    borderRadius: Spacing.three,
    gap: Spacing.two,
  },
  cardText: {
    fontSize: 14,
    lineHeight: 22,
  },
});
