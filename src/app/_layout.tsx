import { DarkTheme, DefaultTheme, ThemeProvider } from 'expo-router';
import { useColorScheme } from 'react-native';

import AppTabs from '@/components/app-tabs';
import { RecyclingAppProvider } from '@/lib/recycling';

export default function RootLayout() {
  const colorScheme = useColorScheme();
  return (
    <ThemeProvider value={colorScheme === 'dark' ? DarkTheme : DefaultTheme}>
      <RecyclingAppProvider>
        <AppTabs />
      </RecyclingAppProvider>
    </ThemeProvider>
  );
}
