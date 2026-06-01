import { Text, View } from 'react-native';

import { Panel, Screen, SectionTitle, LinkButton, useAppColors } from '@/components/recycling-ui';
import { getProfileById, useRecyclingApp } from '@/lib/recycling';

const CATEGORY_IDS = ['glass', 'medicine', 'electronics', 'bulky', 'battery', 'hazardous'] as const;

export default function LearnScreen() {
  const colors = useAppColors();
  const { resources, guidance } = useRecyclingApp();

  return (
    <Screen>
      <Panel>
        <SectionTitle title="Learn" subtitle="Quick help for the special categories that often trip people up." />
        <View style={{ gap: 10 }}>
          {CATEGORY_IDS.map((categoryId) => {
            const profile = getProfileById(categoryId);
            return (
              <View key={profile.id} style={{ gap: 4 }}>
                <Text style={{ color: colors.text, fontSize: 16, fontWeight: '700' }}>{profile.emoji} {profile.label}</Text>
                <Text style={{ color: colors.textSecondary, fontSize: 14, lineHeight: 20 }}>{profile.specialHandling}</Text>
              </View>
            );
          })}
        </View>
      </Panel>

      <Panel>
        <SectionTitle title="Recommended reading" subtitle={guidance ? `Matched to ${guidance.profile.label}.` : 'Based on common recycling tasks.'} />
        {resources.map((resource) => (
          <LinkButton key={resource.id} title={resource.title} href={resource.href} />
        ))}
      </Panel>
    </Screen>
  );
}
