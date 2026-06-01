import { ReactNode } from 'react';
import { Linking, Pressable, ScrollView, StyleSheet, Text, TextInput, View, type ViewStyle } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useColorScheme } from 'react-native';

import { Colors, MaxContentWidth, Spacing } from '@/constants/theme';

export function useAppColors() {
  const scheme = useColorScheme();
  return Colors[scheme === 'dark' ? 'dark' : 'light'];
}

export function Screen({
  children,
  style,
}: {
  children: ReactNode;
  style?: ViewStyle;
}) {
  const colors = useAppColors();
  return (
    <ScrollView style={[styles.scrollView, { backgroundColor: colors.background }, style]} contentContainerStyle={styles.scrollContent}>
      <SafeAreaView style={styles.safeArea}>
        <View style={[styles.container, { backgroundColor: colors.background }]}>{children}</View>
      </SafeAreaView>
    </ScrollView>
  );
}

export function Shell({
  title,
  subtitle,
  children,
}: {
  title: string;
  subtitle?: string;
  children: ReactNode;
}) {
  const colors = useAppColors();
  return (
    <View style={styles.shell}>
      <View style={styles.header}>
        <Text style={[styles.kicker, { color: colors.textSecondary }]}>RecycleBuddy</Text>
        <Text style={[styles.title, { color: colors.text }]}>{title}</Text>
        {subtitle ? <Text style={[styles.subtitle, { color: colors.textSecondary }]}>{subtitle}</Text> : null}
      </View>
      {children}
    </View>
  );
}

export function Panel({ children, style }: { children: ReactNode; style?: ViewStyle }) {
  const colors = useAppColors();
  return <View style={[styles.panel, { backgroundColor: colors.backgroundElement, borderColor: colors.backgroundSelected }, style]}>{children}</View>;
}

export function SectionTitle({ title, subtitle }: { title: string; subtitle?: string }) {
  const colors = useAppColors();
  return (
    <View style={styles.sectionTitleRow}>
      <Text style={[styles.sectionTitle, { color: colors.text }]}>{title}</Text>
      {subtitle ? <Text style={[styles.sectionSubtitle, { color: colors.textSecondary }]}>{subtitle}</Text> : null}
    </View>
  );
}

export function StatCard({ label, value }: { label: string; value: string }) {
  const colors = useAppColors();
  return (
    <View style={[styles.statCard, { backgroundColor: colors.background, borderColor: colors.backgroundSelected }]}>
      <Text style={[styles.statValue, { color: colors.text }]}>{value}</Text>
      <Text style={[styles.statLabel, { color: colors.textSecondary }]}>{label}</Text>
    </View>
  );
}

export function Pill({ children, tone = 'neutral' }: { children: ReactNode; tone?: 'neutral' | 'positive' | 'warning' }) {
  const colors = useAppColors();
  const tint = tone === 'positive' ? '#14a44d' : tone === 'warning' ? '#b26a00' : colors.textSecondary;
  return <View style={[styles.pill, { borderColor: colors.backgroundSelected }]}><Text style={[styles.pillText, { color: tint }]}>{children}</Text></View>;
}

export function InputField({ label, value, onChangeText, placeholder, keyboardType = 'default' }: { label: string; value: string; onChangeText: (value: string) => void; placeholder?: string; keyboardType?: 'default' | 'numeric' | 'email-address' | 'decimal-pad'; }) {
  const colors = useAppColors();
  return (
    <View style={styles.field}>
      <Text style={[styles.fieldLabel, { color: colors.textSecondary }]}>{label}</Text>
      <TextInput
        value={value}
        onChangeText={onChangeText}
        placeholder={placeholder}
        placeholderTextColor={colors.textSecondary}
        keyboardType={keyboardType}
        autoCapitalize="none"
        autoCorrect={false}
        style={[styles.input, { color: colors.text, backgroundColor: colors.background, borderColor: colors.backgroundSelected }]}
      />
    </View>
  );
}

export function ActionButton({ title, onPress, disabled = false }: { title: string; onPress: () => void; disabled?: boolean }) {
  const colors = useAppColors();
  return (
    <Pressable onPress={onPress} disabled={disabled} style={({ pressed }) => [styles.button, { backgroundColor: disabled ? colors.backgroundSelected : '#0a84ff', opacity: pressed || disabled ? 0.8 : 1 }]}>
      <Text style={styles.buttonText}>{title}</Text>
    </Pressable>
  );
}

export function LinkButton({ title, href }: { title: string; href: string }) {
  const colors = useAppColors();
  return (
    <Pressable onPress={() => void Linking.openURL(href)} style={({ pressed }) => [styles.linkButton, { borderColor: colors.backgroundSelected, opacity: pressed ? 0.7 : 1 }]}>
      <Text style={[styles.linkTitle, { color: colors.text }]}>{title}</Text>
      <Text style={[styles.linkHref, { color: colors.textSecondary }]} numberOfLines={1}>{href}</Text>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  scrollView: {
    flex: 1,
  },
  scrollContent: {
    flexGrow: 1,
  },
  safeArea: {
    flex: 1,
    alignItems: 'center',
    paddingBottom: Spacing.four,
  },
  container: {
    width: '100%',
    maxWidth: MaxContentWidth,
    paddingHorizontal: Spacing.four,
    paddingVertical: Spacing.three,
    gap: Spacing.four,
    flex: 1,
  },
  shell: {
    gap: Spacing.three,
  },
  header: {
    gap: Spacing.one,
  },
  kicker: {
    fontSize: 12,
    letterSpacing: 0.5,
    textTransform: 'uppercase',
    fontWeight: '700',
  },
  title: {
    fontSize: 32,
    fontWeight: '800',
  },
  subtitle: {
    fontSize: 15,
    lineHeight: 21,
  },
  panel: {
    borderRadius: 24,
    borderWidth: StyleSheet.hairlineWidth,
    padding: Spacing.four,
    gap: Spacing.three,
  },
  sectionTitleRow: {
    gap: Spacing.one,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: '700',
  },
  sectionSubtitle: {
    fontSize: 14,
    lineHeight: 20,
  },
  statCard: {
    flex: 1,
    minWidth: 120,
    borderRadius: 20,
    borderWidth: StyleSheet.hairlineWidth,
    padding: Spacing.three,
    gap: Spacing.one,
  },
  statValue: {
    fontSize: 26,
    fontWeight: '800',
  },
  statLabel: {
    fontSize: 13,
  },
  pill: {
    borderRadius: 999,
    borderWidth: StyleSheet.hairlineWidth,
    paddingHorizontal: Spacing.three,
    paddingVertical: Spacing.one,
    alignSelf: 'flex-start',
  },
  pillText: {
    fontSize: 13,
    fontWeight: '700',
  },
  field: {
    gap: Spacing.one,
  },
  fieldLabel: {
    fontSize: 13,
    fontWeight: '600',
  },
  input: {
    borderRadius: 16,
    borderWidth: StyleSheet.hairlineWidth,
    paddingHorizontal: Spacing.three,
    paddingVertical: 14,
    fontSize: 16,
  },
  button: {
    minHeight: 48,
    borderRadius: 16,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: Spacing.four,
  },
  buttonText: {
    color: '#ffffff',
    fontSize: 16,
    fontWeight: '700',
  },
  linkButton: {
    borderRadius: 18,
    borderWidth: StyleSheet.hairlineWidth,
    padding: Spacing.three,
    gap: 4,
  },
  linkTitle: {
    fontSize: 15,
    fontWeight: '700',
  },
  linkHref: {
    fontSize: 12,
  },
});
