import { DarkTheme, DefaultTheme, ThemeProvider } from "expo-router/react-navigation";
import { Observe, ObserveRoot, useObserve } from 'expo-observe';
import { Stack } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import { useEffect } from 'react';
import 'react-native-reanimated';

import { useColorScheme } from '@/hooks/use-color-scheme';
import { setBaseGlobalAttributes } from '@/lib/observe';

Observe.configure({
  environment: 'playground',
  sampleRate: 1,
  // Dispatch metrics from local development builds too. Has no effect on release builds.
  dispatchInDebug: true,
  // Per-route navigation metrics (cold_ttr, warm_ttr, tti tagged with the route pattern).
  integrations: { 'expo-router': true },
});

setBaseGlobalAttributes();

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
        <Stack.Screen
          name="observe-lab"
          options={{ title: 'Observe Lab', headerBackTitle: 'Home' }}
        />
      </Stack>
      <StatusBar style="auto" />
    </ThemeProvider>
  );
}

export default ObserveRoot.wrap(RootLayout);
