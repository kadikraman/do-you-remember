import { DarkTheme, DefaultTheme, ThemeProvider } from "expo-router/react-navigation";
import ExpoObserve, { AppMetrics, ObserveRoot } from 'expo-observe';
import { Stack } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import { useEffect } from 'react';
import 'react-native-reanimated';

import { useColorScheme } from '@/hooks/use-color-scheme';

ExpoObserve.configure({ environment: 'custom' });

function RootLayout() {
  const colorScheme = useColorScheme();

  useEffect(() => {
    const timeout = setTimeout(() => {
      AppMetrics.markInteractive();
    }, Math.random() * 1000 + 500);
    return () => clearTimeout(timeout);
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

export default ObserveRoot.wrap(RootLayout);
