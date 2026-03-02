import { useState, useCallback } from 'react';
import {
  Modal,
  Pressable,
  ScrollView,
  StyleSheet,
  View,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import { IconSymbol } from '@/components/ui/icon-symbol';
import { OptionButton } from '@/components/option-button';
import { ThemedText } from '@/components/themed-text';
import { ThemedView } from '@/components/themed-view';
import { Colors } from '@/constants/theme';
import { FEEDBACK, getQuestionsForCategory, type CategoryId, type Question } from '@/constants/questions';
import { useColorScheme } from '@/hooks/use-color-scheme';

const QUIZ_SIZE = 5;

function pickRandom<T>(arr: T[]): T {
  return arr[Math.floor(Math.random() * arr.length)];
}

function sampleQuestions(categoryId: CategoryId): Question[] {
  const all = getQuestionsForCategory(categoryId);
  const shuffled = [...all].sort(() => Math.random() - 0.5);
  return shuffled.slice(0, QUIZ_SIZE);
}

interface QuizModalProps {
  visible: boolean;
  categoryId: CategoryId;
  onClose: () => void;
}

type Phase = 'answering' | 'feedback';

export function QuizModal({ visible, categoryId, onClose }: QuizModalProps) {
  const scheme = useColorScheme() ?? 'light';
  const colors = Colors[scheme];

  const [questions, setQuestions] = useState<Question[]>([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [selectedIndex, setSelectedIndex] = useState<number | null>(null);
  const [phase, setPhase] = useState<Phase>('answering');
  const [feedbackMessage, setFeedbackMessage] = useState('');

  const initQuiz = useCallback(() => {
    setQuestions(sampleQuestions(categoryId));
    setCurrentIndex(0);
    setSelectedIndex(null);
    setPhase('answering');
    setFeedbackMessage('');
  }, [categoryId]);

  const question = questions[currentIndex];
  const isLast = currentIndex === questions.length - 1;

  function handleSelect(index: number) {
    if (phase !== 'answering') return;
    setSelectedIndex(index);
    setPhase('feedback');
    const correct = index === question.correctIndex;
    setFeedbackMessage(pickRandom(correct ? FEEDBACK.correct : FEEDBACK.incorrect));
  }

  function handleNext() {
    if (isLast) {
      onClose();
      return;
    }
    setCurrentIndex((i) => i + 1);
    setSelectedIndex(null);
    setPhase('answering');
    setFeedbackMessage('');
  }

  const isCorrect = selectedIndex !== null && selectedIndex === question?.correctIndex;

  return (
    <Modal
      visible={visible}
      animationType="slide"
      presentationStyle="pageSheet"
      onShow={initQuiz}
      onRequestClose={onClose}
    >
      <ThemedView style={styles.container}>
        <SafeAreaView style={styles.safeArea}>
          {/* Header */}
          <View style={styles.header}>
            <ThemedText type="defaultSemiBold" style={styles.progress}>
              {questions.length > 0 ? `${currentIndex + 1} / ${questions.length}` : ''}
            </ThemedText>
            <Pressable onPress={onClose} hitSlop={12} style={styles.closeBtn}>
              <IconSymbol name="xmark" size={20} color={colors.icon} />
            </Pressable>
          </View>

          {question ? (
            <ScrollView
              style={styles.scroll}
              contentContainerStyle={styles.scrollContent}
              showsVerticalScrollIndicator={false}
            >
              {/* Question */}
              <ThemedText type="defaultSemiBold" style={styles.prompt}>
                {question.prompt}
              </ThemedText>

              {/* Options */}
              <View style={styles.options}>
                {question.options.map((opt, i) => {
                  let state: 'idle' | 'correct' | 'incorrect' = 'idle';
                  if (phase === 'feedback') {
                    if (i === question.correctIndex) state = 'correct';
                    else if (i === selectedIndex) state = 'incorrect';
                  }
                  return (
                    <OptionButton
                      key={i}
                      label={opt}
                      state={state}
                      onPress={() => handleSelect(i)}
                      disabled={phase === 'feedback'}
                    />
                  );
                })}
              </View>

              {/* Feedback */}
              {phase === 'feedback' && (
                <View
                  style={[
                    styles.feedback,
                    {
                      backgroundColor: isCorrect
                        ? colors.correct + '18'
                        : colors.incorrect + '18',
                      borderColor: isCorrect ? colors.correct : colors.incorrect,
                    },
                  ]}
                >
                  <ThemedText
                    type="defaultSemiBold"
                    style={[
                      styles.feedbackVerdict,
                      { color: isCorrect ? colors.correct : colors.incorrect },
                    ]}
                  >
                    {isCorrect ? 'Yay!' : 'Nay...'}
                  </ThemedText>
                  <ThemedText style={styles.feedbackMessage}>{feedbackMessage}</ThemedText>
                  {question.explanation && (
                    <ThemedText style={[styles.explanation, { color: colors.icon }]}>
                      {question.explanation}
                    </ThemedText>
                  )}

                  <Pressable
                    onPress={handleNext}
                    style={[styles.nextBtn, { backgroundColor: colors.tint }]}
                  >
                    <ThemedText style={styles.nextBtnText}>
                      {isLast ? 'Finish' : 'Next Question'}
                    </ThemedText>
                  </Pressable>
                </View>
              )}
            </ScrollView>
          ) : (
            <View style={styles.loading}>
              <ThemedText>Loading…</ThemedText>
            </View>
          )}
        </SafeAreaView>
      </ThemedView>
    </Modal>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  safeArea: {
    flex: 1,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 20,
    paddingTop: 16,
    paddingBottom: 8,
  },
  progress: {
    fontSize: 14,
  },
  closeBtn: {
    padding: 4,
  },
  scroll: {
    flex: 1,
  },
  scrollContent: {
    paddingHorizontal: 20,
    paddingBottom: 40,
  },
  prompt: {
    fontSize: 20,
    lineHeight: 28,
    marginBottom: 24,
    marginTop: 8,
  },
  options: {
    marginBottom: 8,
  },
  feedback: {
    borderWidth: 1.5,
    borderRadius: 14,
    padding: 18,
    marginTop: 8,
  },
  feedbackVerdict: {
    fontSize: 22,
    marginBottom: 4,
  },
  feedbackMessage: {
    fontSize: 15,
    marginBottom: 8,
  },
  explanation: {
    fontSize: 13,
    lineHeight: 18,
    marginBottom: 16,
    fontStyle: 'italic',
  },
  nextBtn: {
    borderRadius: 10,
    paddingVertical: 12,
    alignItems: 'center',
  },
  nextBtnText: {
    color: '#1C1917',
    fontWeight: '600',
    fontSize: 16,
  },
  loading: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
});
