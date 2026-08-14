import { useObserve } from 'expo-observe';
import { useLocalSearchParams, useNavigation } from 'expo-router';
import { useEffect, useState } from 'react';
import { Pressable, ScrollView, StyleSheet, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import { QuizModal } from '@/components/quiz-modal';
import { ThemedText } from '@/components/themed-text';
import { ThemedView } from '@/components/themed-view';
import { IconSymbol } from '@/components/ui/icon-symbol';
import { WebContainer } from '@/components/web-container';
import { getCategoryById, getQuestionsForCategory, type CategoryId } from '@/constants/questions';
import { Colors } from '@/constants/theme';
import { useColorScheme } from '@/hooks/use-color-scheme';

export default function CategoryScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const navigation = useNavigation();
  const scheme = useColorScheme() ?? 'light';
  const colors = Colors[scheme];

  const [quizVisible, setQuizVisible] = useState(false);

  const category = getCategoryById(id as CategoryId);
  const questions = category ? getQuestionsForCategory(category.id) : [];
  const { markInteractive } = useObserve();

  useEffect(() => {
    if (category) {
      navigation.setOptions({ title: category.label });
      markInteractive();
    }
  }, [category, navigation, markInteractive]);

  if (!category) {
    return (
      <ThemedView style={styles.container}>
        <ThemedText>Category not found.</ThemedText>
      </ThemedView>
    );
  }

  return (
    <ThemedView style={styles.container}>
      <WebContainer>
      <SafeAreaView style={styles.safeArea}>
        <ScrollView
          contentContainerStyle={styles.content}
          showsVerticalScrollIndicator={false}
        >
          {/* Hero */}
          <View style={[styles.hero, { borderColor: category.color + '60', borderTopColor: category.color }]}>
            <IconSymbol name={category.iconName as any} size={44} color={category.color} style={styles.icon} />
            <ThemedText type="title" style={styles.categoryTitle}>
              {category.label}
            </ThemedText>
            <ThemedText style={[styles.questionCount, { color: category.color }]}>
              {questions.length} questions in pool · 5 per quiz
            </ThemedText>
          </View>

          {/* Description */}
          <ThemedText style={[styles.description, { color: colors.icon }]}>
            {category.description}
          </ThemedText>

          {/* CTA */}
          <Pressable
            onPress={() => setQuizVisible(true)}
            style={({ pressed }) => [
              styles.startBtn,
              { backgroundColor: category.color },
              pressed && styles.startBtnPressed,
            ]}
          >
            <ThemedText style={styles.startBtnText}>Try me!</ThemedText>
          </Pressable>
        </ScrollView>
      </SafeAreaView>
      </WebContainer>

      <QuizModal
        visible={quizVisible}
        categoryId={category.id}
        onClose={() => setQuizVisible(false)}
      />
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
    paddingTop: 24,
    paddingBottom: 40,
  },
  hero: {
    borderWidth: 1.5,
    borderTopWidth: 4,
    borderRadius: 16,
    padding: 24,
    marginBottom: 20,
  },
  icon: {
    marginBottom: 12,
    marginTop: 8,
  },
  categoryTitle: {
    marginBottom: 6,
  },
  questionCount: {
    fontSize: 14,
    fontWeight: '500',
  },
  description: {
    fontSize: 16,
    lineHeight: 24,
    marginBottom: 32,
  },
  startBtn: {
    borderRadius: 14,
    paddingVertical: 16,
    alignItems: 'center' as const,
  },
  startBtnPressed: {
    opacity: 0.85,
  },
  startBtnText: {
    color: '#fff',
    fontWeight: '700' as const,
    fontSize: 18,
  },
});
