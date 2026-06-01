import { View, Text } from 'react-native';

import {
  ActionButton,
  InputField,
  LinkButton,
  Panel,
  Pill,
  Screen,
  SectionTitle,
  StatCard,
  useAppColors,
} from '@/components/recycling-ui';
import { buildDirectionsUrl } from '@/lib/recycling';
import { useRecyclingApp } from '@/lib/recycling';

export default function ScanScreen() {
  const colors = useAppColors();
  const { draft, setDraft, submitScan, busy, error, guidance, progress, loading, clearResult } = useRecyclingApp();

  return (
    <Screen>
      <Panel>
        <SectionTitle title="Scan an item" subtitle="Type what you have, add a postal code, and get safe recycling guidance." />
        <InputField label="Item name" value={draft.itemText} onChangeText={(itemText) => setDraft({ itemText })} placeholder="Glass bottle, battery, paint can..." />
        <InputField label="Postal code" value={draft.postalCode} onChangeText={(postalCode) => setDraft({ postalCode })} placeholder="90210" keyboardType="numeric" />
        <InputField label="Barcode or label text" value={draft.barcode} onChangeText={(barcode) => setDraft({ barcode })} placeholder="Optional" />
        <ActionButton title={busy ? 'Scanning…' : 'Get guidance'} onPress={() => void submitScan()} disabled={busy} />
        {error ? <Text style={{ color: '#d92d20', fontSize: 14 }}>{error}</Text> : null}
        <View style={{ flexDirection: 'row', gap: 12, flexWrap: 'wrap' }}>
          <StatCard label="Points" value={String(progress.totalPoints)} />
          <StatCard label="Streak" value={`${progress.currentStreak} day${progress.currentStreak === 1 ? '' : 's'}`} />
        </View>
      </Panel>

      {guidance ? (
        <Panel>
          <View style={{ gap: 8 }}>
            <Pill tone={guidance.assistant.source === 'ai' ? 'positive' : 'neutral'}>{guidance.profile.emoji} {guidance.profile.label}</Pill>
            <Text style={{ color: colors.text, fontSize: 24, fontWeight: '800' }}>{guidance.assistant.headline}</Text>
            <Text style={{ color: colors.textSecondary, fontSize: 15, lineHeight: 22 }}>{guidance.assistant.summary}</Text>
            <Text style={{ color: colors.text, fontSize: 16, fontWeight: '700' }}>{guidance.assistant.nextAction}</Text>
            <Text style={{ color: colors.textSecondary, fontSize: 13 }}>{guidance.assistant.reasoning}</Text>
          </View>
          <View style={{ gap: 8 }}>
            <SectionTitle title="Safety notes" />
            {guidance.assistant.safetyNotes.map((note) => (
              <Text key={note} style={{ color: colors.textSecondary, fontSize: 14, lineHeight: 20 }}>• {note}</Text>
            ))}
          </View>
          <View style={{ gap: 8 }}>
            <SectionTitle title="Nearby options" subtitle={guidance.earth911.notice ?? undefined} />
            {guidance.earth911.locations.map((location) => (
              <LinkButton
                key={location.id}
                title={location.name}
                href={buildDirectionsUrl(location)}
              />
            ))}
          </View>
          <View style={{ flexDirection: 'row', gap: 12, flexWrap: 'wrap' }}>
            <StatCard label="Scan points" value={`+${guidance.pointsAwarded}`} />
            <StatCard label="Locations" value={String(guidance.earth911.locations.length)} />
          </View>
          <ActionButton title="Clear result" onPress={clearResult} />
        </Panel>
      ) : (
        <Panel>
          <SectionTitle title="Start with the item" subtitle="Special items like batteries, medicine, glass, electronics, and hazardous waste get custom handling." />
          <Text style={{ color: colors.textSecondary, fontSize: 14, lineHeight: 21 }}>Your guidance, points, and streaks are stored locally on this device.</Text>
        </Panel>
      )}
    </Screen>
  );
}
