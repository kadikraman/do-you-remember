import { getCategoryById, getQuestionsForCategory, type CategoryId } from '@/constants/questions';
import { useQuiz } from '@/hooks/use-quiz';
import {
  BottomSheet,
  Button,
  Group,
  Host,
  HStack,
  Image,
  ScrollView,
  Spacer,
  Text,
  VStack,
} from '@expo/ui/swift-ui';
import {
  background,
  border,
  animation,
  Animation,
  buttonStyle,
  controlSize,
  cornerRadius,
  font,
  foregroundStyle,
  multilineTextAlignment,
  padding,
  presentationDetents,
  presentationDragIndicator,
  scaleEffect,
  tint,
} from '@expo/ui/swift-ui/modifiers';
import { useLocalSearchParams, useNavigation } from 'expo-router';
import { useEffect, useState } from 'react';

export default function CategoryScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const navigation = useNavigation();
  const [quizVisible, setQuizVisible] = useState(false);
  const [btnPressed, setBtnPressed] = useState(false);

  const category = getCategoryById(id as CategoryId);
  const questions = category ? getQuestionsForCategory(category.id) : [];

  const quiz = useQuiz(category?.id ?? 'git', quizVisible);

  useEffect(() => {
    if (category) {
      navigation.setOptions({ title: category.label });
    }
  }, [category, navigation]);

  if (!category) {
    return (
      <Host style={{ flex: 1 }}>
        <Text>Category not found.</Text>
      </Host>
    );
  }

  return (
    <Host style={{ flex: 1 }}>
      <ScrollView>
        <VStack alignment="leading" spacing={12} modifiers={[padding({ horizontal: 20, top: 24, bottom: 40 })]}>
          <Text modifiers={[font({ size: 44 })]}>{category.emoji}</Text>
          <Text modifiers={[font({ size: 32, weight: 'bold' })]}>{category.label}</Text>
          <Text modifiers={[foregroundStyle(category.color), font({ size: 14, weight: 'medium' })]}>
            {questions.length} questions in pool · 5 per quiz
          </Text>
          <Text modifiers={[foregroundStyle('secondaryLabel'), font({ size: 16 })]}>
            {category.description}
          </Text>
          <Button
            label="Try me!"
            modifiers={[
              buttonStyle('borderedProminent'),
              tint(category.color),
              controlSize('large'),
              scaleEffect(btnPressed ? 1.1 : 1.0),
              animation(Animation.spring({ response: 0.4, dampingFraction: 0.4 }), btnPressed),
            ]}
            onPress={() => {
              setBtnPressed(true);
              setTimeout(() => setBtnPressed(false), 250);
              setTimeout(() => setQuizVisible(true), 500);
            }}
          />
        </VStack>
      </ScrollView>

      <BottomSheet isPresented={quizVisible} onIsPresentedChange={setQuizVisible}>
        <Group modifiers={[presentationDetents(['large']), presentationDragIndicator('visible')]}>
          {quiz.question ? (
            <ScrollView>
              <VStack alignment="leading" spacing={12} modifiers={[padding({ all: 20 })]}>
                {/* Header */}
                <HStack>
                  <Text modifiers={[font({ size: 14, weight: 'semibold' })]}>
                    {quiz.currentIndex + 1} / {quiz.questions.length}
                  </Text>
                  <Spacer />
                  <Button
                    systemImage="xmark.circle.fill"
                    modifiers={[buttonStyle('plain'), foregroundStyle('secondaryLabel')]}
                    onPress={() => setQuizVisible(false)}
                  />
                </HStack>

                {/* Question */}
                <Text modifiers={[font({ size: 20, weight: 'semibold' })]}>
                  {quiz.question.prompt}
                </Text>

                {/* Options */}
                {quiz.question.options.map((opt, i) => {
                  const state = quiz.getOptionState(i);
                  const optionModifiers = [
                    buttonStyle('bordered'),
                    controlSize('large'),
                    ...(state === 'correct' ? [tint('#22C55E')] : []),
                    ...(state === 'incorrect' ? [tint('#EF4444')] : []),
                  ];

                  return (
                    <Button
                      key={i}
                      onPress={() => quiz.handleSelect(i)}
                      modifiers={optionModifiers}
                    >
                      <HStack>
                        <Text modifiers={[font({ design: 'monospaced', size: 15 }), multilineTextAlignment('leading')]}>{opt}</Text>
                        <Spacer />
                        {state === 'correct' && (
                          <Image systemName="checkmark.circle.fill" color="#22C55E" size={18} />
                        )}
                        {state === 'incorrect' && (
                          <Image systemName="xmark.circle.fill" color="#EF4444" size={18} />
                        )}
                      </HStack>
                    </Button>
                  );
                })}

                {/* Feedback */}
                {quiz.phase === 'feedback' && (
                  <VStack
                    alignment="leading"
                    spacing={8}
                    modifiers={[
                      padding({ all: 16 }),
                      background(quiz.isCorrect ? '#22C55E20' : '#EF444420'),
                      cornerRadius(14),
                      border({
                        color: quiz.isCorrect ? '#22C55E' : '#EF4444',
                        width: 1.5,
                      }),
                    ]}
                  >
                    <Text
                      modifiers={[
                        font({ size: 22, weight: 'bold' }),
                        foregroundStyle(quiz.isCorrect ? '#22C55E' : '#EF4444'),
                      ]}
                    >
                      {quiz.isCorrect ? 'Yay!' : 'Nay...'}
                    </Text>
                    <Text>{quiz.feedbackMessage}</Text>
                    {quiz.question.explanation && (
                      <Text
                        modifiers={[
                          foregroundStyle('secondaryLabel'),
                          font({ size: 13 }),
                        ]}
                      >
                        {quiz.question.explanation}
                      </Text>
                    )}
                    <Button
                      label={quiz.isLast ? 'Finish' : 'Next Question'}
                      modifiers={[
                        buttonStyle('borderedProminent'),
                        tint('#F59E0B'),
                        controlSize('large'),
                      ]}
                      onPress={() => quiz.handleNext(() => setQuizVisible(false))}
                    />
                  </VStack>
                )}
              </VStack>
            </ScrollView>
          ) : (
            <VStack>
              <Text>Loading...</Text>
            </VStack>
          )}
        </Group>
      </BottomSheet>
    </Host>
  );
}
