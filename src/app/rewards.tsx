import { Text, View } from 'react-native';

import { Panel, Pill, Screen, SectionTitle, StatCard, useAppColors } from '@/components/recycling-ui';
import { useRecyclingApp } from '@/lib/recycling';

export default function RewardsScreen() {
  const colors = useAppColors();
  const { progress, badges } = useRecyclingApp();

  return (
    <Screen>
      <Panel>
        <SectionTitle title="Rewards" subtitle="Track your points, streaks, and badges locally." />
        <View style={{ flexDirection: 'row', gap: 12, flexWrap: 'wrap' }}>
          <StatCard label="Total points" value={String(progress.totalPoints)} />
          <StatCard label="Scans" value={String(progress.totalScans)} />
          <StatCard label="Best streak" value={`${progress.bestStreak} day${progress.bestStreak === 1 ? '' : 's'}`} />
        </View>
      </Panel>

      <Panel>
        <SectionTitle title="Badges" />
        <View style={{ gap: 12 }}>
          {badges.map((badge) => (
            <View key={badge.id} style={{ gap: 6 }}>
              <Pill tone={badge.unlocked ? 'positive' : 'warning'}>{badge.unlocked ? 'Unlocked' : 'Locked'}</Pill>
              <Text style={{ color: colors.text, fontSize: 16, fontWeight: '700' }}>{badge.label}</Text>
              <Text style={{ color: colors.textSecondary, fontSize: 14, lineHeight: 20 }}>{badge.description}</Text>
            </View>
          ))}
        </View>
      </Panel>

      <Panel>
        <SectionTitle title="Recent history" subtitle="Your latest scans are saved on this device." />
        <View style={{ gap: 12 }}>
          {progress.history.length === 0 ? (
            <Text style={{ color: colors.textSecondary, fontSize: 14 }}>No scans yet.</Text>
          ) : (
            progress.history.slice(0, 5).map((entry) => (
              <View key={entry.id} style={{ gap: 4 }}>
                <Text style={{ color: colors.text, fontSize: 15, fontWeight: '700' }}>{entry.itemText}</Text>
                <Text style={{ color: colors.textSecondary, fontSize: 13, lineHeight: 18 }}>{entry.headline}</Text>
                <Text style={{ color: colors.textSecondary, fontSize: 12 }}>{new Date(entry.scannedAt).toLocaleString()} · {entry.pointsAwarded} pts</Text>
              </View>
            ))
          )}
        </View>
      </Panel>
    </Screen>
  );
}
