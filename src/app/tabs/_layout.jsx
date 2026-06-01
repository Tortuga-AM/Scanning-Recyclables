import { Tabs } from 'expo-router';

export default function TabLayout() {
  return (
    <Tabs screenOptions={{ tabBarActiveTintColor: '#2e7d32' }}>
      <Tabs.Screen name="map" options={{ title: 'Find Drop-offs' }} />
      <Tabs.Screen name="index" options={{ title: 'Scan Item' }} />
      <Tabs.Screen name="profile" options={{ title: 'My Impact' }} />
    </Tabs>
  );
}