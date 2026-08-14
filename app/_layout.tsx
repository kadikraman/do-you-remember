import { DarkTheme, DefaultTheme, ThemeProvider } from "expo-router/react-navigation";
import Constants from 'expo-constants';
import { Observe, ObserveRoot, useObserve } from 'expo-observe';
import { Stack } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import * as Updates from 'expo-updates';
import { useEffect } from 'react';
import 'react-native-reanimated';

import { useColorScheme } from '@/hooks/use-color-scheme';

Observe.configure({
  environment: 'playground',
  sampleRate: 1,
  // Dispatch metrics from local development builds too. Has no effect on release builds.
  dispatchInDebug: true,
});

Observe.setGlobalAttributes({
  appVersion: Constants.expoConfig?.version ?? 'unknown',
  updateId: Updates.updateId ?? (Updates.isEmbeddedLaunch ? 'embedded' : 'dev'),
});

function RootLayout() {
  const colorScheme = useColorScheme();
  const { markInteractive } = useObserve();

  useEffect(() => {
    // Simulated startup work so TTI varies between launches.
    const timeout = setTimeout(() => {
      markInteractive();
    }, Math.random() * 1000 + 500);
    return () => clearTimeout(timeout);
  }, [markInteractive]);

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
