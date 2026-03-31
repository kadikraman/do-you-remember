import { DarkTheme, DefaultTheme, ThemeProvider } from '@react-navigation/native';
import ExpoObserve, { AppMetrics, AppMetricsRoot } from 'expo-observe';
import { Stack } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import { useEffect } from 'react';
import 'react-native-reanimated';

import { useColorScheme } from '@/hooks/use-color-scheme';

ExpoObserve.configure({ environment: 'custom' });

function RootLayout() {
  const colorScheme = useColorScheme();

  useEffect(() => {
    AppMetrics.markInteractive();
  }, []);

  return (
    <ThemeProvider value={colorScheme === 'dark' ? DarkTheme : DefaultTheme}>
      <Stack>
        <Stack.Screen name="index" options={{ headerShown: false }} />
        <Stack.Screen
          name="category/[id]"
          options={{ title: '', headerBackTitle: 'Home' }}
        />
      </Stack>
      <StatusBar style="auto" />
    </ThemeProvider>
  );
}

export default AppMetricsRoot.wrap(RootLayout);
