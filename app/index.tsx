import Constants from 'expo-constants';
import { useObserve } from 'expo-observe';
import { useRouter } from 'expo-router';
import * as Updates from 'expo-updates';
import { useEffect } from 'react';
import { ScrollView, StyleSheet } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import { CategoryCard } from '@/components/category-card';
import { ThemedText } from '@/components/themed-text';
import { ThemedView } from '@/components/themed-view';
import { WebContainer } from '@/components/web-container';
import { CATEGORIES, getQuestionsForCategory } from '@/constants/questions';
import { Colors } from '@/constants/theme';
import { useColorScheme } from '@/hooks/use-color-scheme';

const version = Constants.expoConfig?.version ?? '—';
const buildNumber =
  Constants.expoConfig?.ios?.buildNumber ??
  Constants.expoConfig?.android?.versionCode?.toString() ??
  '—';
const updateId = Updates.updateId
  ? Updates.updateId
  : Updates.isEmbeddedLaunch
    ? 'embedded'
    : 'dev';

export default function HomeScreen() {
  const router = useRouter();
  const scheme = useColorScheme() ?? 'light';
  const colors = Colors[scheme];
  const { markInteractive } = useObserve();

  useEffect(() => {
    markInteractive();
  }, [markInteractive]);

  return (
    <ThemedView style={styles.container}>
      <WebContainer>
      <SafeAreaView style={styles.safeArea}>
        <ScrollView
          contentContainerStyle={styles.content}
          showsVerticalScrollIndicator={false}
        >
          <ThemedText type="title" style={styles.title}>
            {process.env.EXPO_PUBLIC_HEADING}
          </ThemedText>
          <ThemedText style={styles.subtitle}>
            Totally differet subheading.
          </ThemedText>

          {CATEGORIES.map((category) => (
            <CategoryCard
              key={category.id}
              category={category}
              questionCount={getQuestionsForCategory(category.id).length}
              onPress={() => router.push(`/category/${category.id}`)}
            />
          ))}

          <ThemedText
            type="link"
            style={styles.labLink}
            onPress={() => router.push('/observe-lab')}
          >
            Observe Lab →
          </ThemedText>

          <ThemedText type="mono" style={[styles.versionInfo, { color: colors.icon }]}>
            v{version} ({buildNumber}) · {updateId}
          </ThemedText>
        </ScrollView>
      </SafeAreaView>
      </WebContainer>
    </ThemedView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  safeArea: {
    flex: 1,
  },
  content: {
    paddingHorizontal: 20,
    paddingTop: 48,
    paddingBottom: 40,
  },
  title: {
    marginBottom: 8,
  },
  subtitle: {
    marginBottom: 32,
    opacity: 0.6,
  },
  versionInfo: {
    fontSize: 11,
    opacity: 0.4,
    textAlign: 'center',
    marginTop: 16,
  },
  labLink: {
    marginTop: 20,
    textAlign: 'center',
  },
});
