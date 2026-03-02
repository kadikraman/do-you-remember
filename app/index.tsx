import { ScrollView, StyleSheet } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useRouter } from 'expo-router';
import Constants from 'expo-constants';
import * as Updates from 'expo-updates';

import { CategoryCard } from '@/components/category-card';
import { ThemedText } from '@/components/themed-text';
import { ThemedView } from '@/components/themed-view';
import { Colors } from '@/constants/theme';
import { CATEGORIES, getQuestionsForCategory } from '@/constants/questions';
import { useColorScheme } from '@/hooks/use-color-scheme';

const version = Constants.expoConfig?.version ?? '—';
const buildNumber =
  Constants.expoConfig?.ios?.buildNumber ??
  Constants.expoConfig?.android?.versionCode?.toString() ??
  '—';
const updateId = Updates.updateId ? Updates.updateId.slice(0, 8) : 'dev';

export default function HomeScreen() {
  const router = useRouter();
  const scheme = useColorScheme() ?? 'light';
  const colors = Colors[scheme];

  return (
    <ThemedView style={styles.container}>
      <SafeAreaView style={styles.safeArea}>
        <ScrollView
          contentContainerStyle={styles.content}
          showsVerticalScrollIndicator={false}
        >
          <ThemedText type="title" style={styles.title}>
            Do You Remember?
          </ThemedText>
          <ThemedText style={styles.subtitle}>
            Pick a category and test your memory.
          </ThemedText>

          {CATEGORIES.map((category) => (
            <CategoryCard
              key={category.id}
              category={category}
              questionCount={getQuestionsForCategory(category.id).length}
              onPress={() => router.push(`/category/${category.id}`)}
            />
          ))}

          <ThemedText type="mono" style={[styles.versionInfo, { color: colors.icon }]}>
            v{version} ({buildNumber}) · {updateId}
          </ThemedText>
        </ScrollView>
      </SafeAreaView>
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
});
