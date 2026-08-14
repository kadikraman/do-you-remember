import { useState, useEffect } from 'react';
import { useObserve } from 'expo-observe';
import { useLocalSearchParams, useNavigation } from 'expo-router';
import {
  Button,
  Column,
  Host,
  LazyColumn,
  ModalBottomSheet,
  OutlinedButton,
  OutlinedCard,
  Row,
  Text,
  TextButton,
} from '@expo/ui/jetpack-compose';
import {
  fillMaxWidth,
  padding,
  paddingAll,
} from '@expo/ui/jetpack-compose/modifiers';
import { getCategoryById, getQuestionsForCategory, type CategoryId } from '@/constants/questions';
import { useQuiz } from '@/hooks/use-quiz';

const CATEGORY_ICONS: Record<CategoryId, string> = {
  'git': '\u{1F33F}',
  'http': '\u{1F310}',
  'js-quirks': '\u2728',
  'css': '\u{1F3A8}',
  'typescript': '\u{1F537}',
  'terminal': '\u{1F5A5}\uFE0F',
};

export default function CategoryScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const navigation = useNavigation();
  const [quizVisible, setQuizVisible] = useState(false);

  const category = getCategoryById(id as CategoryId);
  const questions = category ? getQuestionsForCategory(category.id) : [];

  const quiz = useQuiz(category?.id ?? 'git', quizVisible);
  const { markInteractive } = useObserve();

  useEffect(() => {
    if (category) {
      navigation.setOptions({ title: category.label });
      markInteractive();
    }
  }, [category, navigation, markInteractive]);

  if (!category) {
    return (
      <Host style={{ flex: 1 }}>
        <Text>Category not found.</Text>
      </Host>
    );
  }

  return (
    <Host style={{ flex: 1 }}>
      <LazyColumn
        contentPadding={{ start: 20, end: 20, top: 24, bottom: 40 }}
        verticalArrangement={{ spacedBy: 12 }}
      >
        <Text style={{ fontSize: 44 }}>{CATEGORY_ICONS[category.id]}</Text>
        <Text style={{ typography: 'headlineLarge', fontWeight: 'bold' }}>
          {category.label}
        </Text>
        <Text
          color={category.color}
          style={{ typography: 'bodyMedium', fontWeight: '500' }}
        >
          {questions.length} questions in pool · 5 per quiz
        </Text>
        <Text color="#78716C" style={{ typography: 'bodyLarge' }}>
          {category.description}
        </Text>
        <Button
          onClick={() => setQuizVisible(true)}
          colors={{ containerColor: category.color }}
          modifiers={[fillMaxWidth()]}
        >
          Try me!
        </Button>
      </LazyColumn>

      {quizVisible && (
        <Host matchContents>
          <ModalBottomSheet
            onDismissRequest={() => setQuizVisible(false)}
            skipPartiallyExpanded
          >
            <Host style={{ flex: 1 }}>
              <LazyColumn
                contentPadding={{ start: 20, end: 20, top: 16, bottom: 40 }}
                verticalArrangement={{ spacedBy: 10 }}
              >
                {quiz.question ? (
                  <>
                    {/* Header */}
                    <Row
                      horizontalArrangement="spaceBetween"
                      verticalAlignment="center"
                      modifiers={[fillMaxWidth()]}
                    >
                      <Text style={{ typography: 'labelLarge', fontWeight: 'bold' }}>
                        {quiz.currentIndex + 1} / {quiz.questions.length}
                      </Text>
                      <TextButton onClick={() => setQuizVisible(false)}>
                        ✕
                      </TextButton>
                    </Row>

                    {/* Question */}
                    <Text style={{ typography: 'titleLarge', fontWeight: 'bold' }}>
                      {quiz.question.prompt}
                    </Text>

                    {/* Options */}
                    {quiz.question.options.map((opt, i) => {
                      const state = quiz.getOptionState(i);
                      const isCorrect = state === 'correct';
                      const isIncorrect = state === 'incorrect';
                      const color = isCorrect
                        ? '#22C55E'
                        : isIncorrect
                          ? '#EF4444'
                          : undefined;

                      return (
                        <OutlinedButton
                          key={i}
                          onClick={() => quiz.handleSelect(i)}
                          colors={{ contentColor: color }}
                          modifiers={[fillMaxWidth()]}
                        >
                          <Row
                            horizontalArrangement="spaceBetween"
                            verticalAlignment="center"
                            modifiers={[fillMaxWidth()]}
                          >
                            <Text
                              color={color}
                              style={{ typography: 'bodyMedium' }}
                            >
                              {opt}
                            </Text>
                            {isCorrect && <Text color="#22C55E">✓</Text>}
                            {isIncorrect && <Text color="#EF4444">✗</Text>}
                          </Row>
                        </OutlinedButton>
                      );
                    })}

                    {/* Feedback */}
                    {quiz.phase === 'feedback' && (
                      <OutlinedCard
                        colors={{
                          containerColor: quiz.isCorrect ? '#22C55E20' : '#EF444420',
                        }}
                        border={{
                          width: 2,
                          color: quiz.isCorrect ? '#22C55E' : '#EF4444',
                        }}
                        modifiers={[fillMaxWidth()]}
                      >
                        <Column modifiers={[paddingAll(16)]}>
                          <Text
                            color={quiz.isCorrect ? '#22C55E' : '#EF4444'}
                            style={{ typography: 'headlineSmall', fontWeight: 'bold' }}
                            modifiers={[padding(0, 0, 0, 4)]}
                          >
                            {quiz.isCorrect ? 'Yay!' : 'Nay...'}
                          </Text>
                          <Text
                            style={{ typography: 'bodyMedium' }}
                            modifiers={[padding(0, 0, 0, 8)]}
                          >
                            {quiz.feedbackMessage}
                          </Text>
                          {quiz.question.explanation && (
                            <Text
                              color="#78716C"
                              style={{ typography: 'bodySmall' }}
                              modifiers={[padding(0, 0, 0, 16)]}
                            >
                              {quiz.question.explanation}
                            </Text>
                          )}
                          <Button
                            onClick={() => quiz.handleNext(() => setQuizVisible(false))}
                            colors={{ containerColor: '#F59E0B' }}
                            modifiers={[fillMaxWidth()]}
                          >
                            {quiz.isLast ? 'Finish' : 'Next Question'}
                          </Button>
                        </Column>
                      </OutlinedCard>
                    )}
                  </>
                ) : (
                  <Text>Loading...</Text>
                )}
              </LazyColumn>
            </Host>
          </ModalBottomSheet>
        </Host>
      )}
    </Host>
  );
}
