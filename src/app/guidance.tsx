import { Text, View } from 'react-native';

import { LinkButton, Panel, Pill, Screen, SectionTitle, useAppColors } from '@/components/recycling-ui';
import { useRecyclingApp } from '@/lib/recycling';
import { buildDirectionsUrl } from '@/lib/recycling';

export default function GuidanceScreen() {
  const colors = useAppColors();
  const { guidance, resources, loading } = useRecyclingApp();

  return (
    <Screen>
      <Panel>
        <SectionTitle title="Guidance" subtitle="This tab turns the latest lookup into a clear plan." />
        {guidance ? (
          <View style={{ gap: 12 }}>
            <Pill tone={guidance.earth911.source === 'earth911' ? 'positive' : 'warning'}>{guidance.earth911.source === 'earth911' ? 'Earth911 matched' : 'Fallback guidance'}</Pill>
            <Text style={{ color: colors.text, fontSize: 24, fontWeight: '800' }}>{guidance.profile.label}</Text>
            <Text style={{ color: colors.textSecondary, fontSize: 15, lineHeight: 22 }}>{guidance.profile.disposition}</Text>
            <Text style={{ color: colors.text, fontSize: 16, fontWeight: '700' }}>{guidance.profile.specialHandling}</Text>
            <View style={{ gap: 6 }}>
              {guidance.profile.safetyNotes.map((note) => (
                <Text key={note} style={{ color: colors.textSecondary, fontSize: 14, lineHeight: 20 }}>• {note}</Text>
              ))}
            </View>
          </View>
        ) : (
          <Text style={{ color: colors.textSecondary, fontSize: 14, lineHeight: 21 }}>{loading ? 'Loading saved progress…' : 'Run a scan to see item-specific guidance here.'}</Text>
        )}
      </Panel>

      {guidance ? (
        <Panel>
          <SectionTitle title="Where to go" subtitle={guidance.earth911.notice ?? 'Verified drop-off options when available.'} />
          {guidance.earth911.locations.map((location) => (
            <LinkButton key={location.id} title={location.name} href={buildDirectionsUrl(location)} />
          ))}
        </Panel>
      ) : null}

      <Panel>
        <SectionTitle title="Helpful references" subtitle="Always double-check with local rules before using curbside recycling." />
        {resources.map((resource) => (
          <LinkButton key={resource.id} title={resource.title} href={resource.href} />
        ))}
      </Panel>
    </Screen>
  );
}
