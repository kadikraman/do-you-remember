import { Observe } from 'expo-observe';

import type { CategoryId } from '@/constants/questions';

export function logQuizStarted(categoryId: CategoryId, questionCount: number) {
  Observe.logEvent('quiz.started', {
    attributes: { categoryId, questionCount },
  });
}

export function logQuestionAnswered(
  categoryId: CategoryId,
  questionIndex: number,
  correct: boolean,
  shownAtMs: number,
) {
  Observe.logEvent('question.answered', {
    attributes: {
      categoryId,
      questionIndex,
      correct,
      durationMs: Date.now() - shownAtMs,
    },
  });
}

export function logQuizCompleted(
  categoryId: CategoryId,
  correctCount: number,
  questionCount: number,
) {
  Observe.logEvent('quiz.completed', {
    attributes: {
      categoryId,
      score: { correct: correctCount, total: questionCount },
      perfect: correctCount === questionCount,
    },
  });
}
