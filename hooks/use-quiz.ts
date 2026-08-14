import { useState, useEffect, useRef } from 'react';
import { FEEDBACK, getQuestionsForCategory, type CategoryId, type Question } from '@/constants/questions';
import { logQuestionAnswered, logQuizCompleted, logQuizStarted } from '@/lib/quiz-events';

const QUIZ_SIZE = 5;

function pickRandom<T>(arr: T[]): T {
  return arr[Math.floor(Math.random() * arr.length)];
}

function sampleQuestions(categoryId: CategoryId): Question[] {
  const all = getQuestionsForCategory(categoryId);
  const shuffled = [...all].sort(() => Math.random() - 0.5);
  return shuffled.slice(0, QUIZ_SIZE);
}

export type Phase = 'answering' | 'feedback';

export function useQuiz(categoryId: CategoryId, visible: boolean) {
  const [questions, setQuestions] = useState<Question[]>([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [selectedIndex, setSelectedIndex] = useState<number | null>(null);
  const [phase, setPhase] = useState<Phase>('answering');
  const [feedbackMessage, setFeedbackMessage] = useState('');

  const question = questions[currentIndex];
  const isLast = currentIndex === questions.length - 1;
  const isCorrect = selectedIndex !== null && selectedIndex === question?.correctIndex;

  // When the current question was shown, and how many answers were correct so far.
  const questionShownAtRef = useRef(0);
  const correctCountRef = useRef(0);

  useEffect(() => {
    if (visible) {
      setQuestions(sampleQuestions(categoryId));
      setCurrentIndex(0);
      setSelectedIndex(null);
      setPhase('answering');
      setFeedbackMessage('');
      correctCountRef.current = 0;
      questionShownAtRef.current = Date.now();
      logQuizStarted(categoryId, QUIZ_SIZE);
    }
  }, [visible, categoryId]);

  function handleSelect(index: number) {
    if (phase !== 'answering' || !question) return;
    setSelectedIndex(index);
    setPhase('feedback');
    const correct = index === question.correctIndex;
    if (correct) correctCountRef.current += 1;
    logQuestionAnswered(categoryId, currentIndex, correct, questionShownAtRef.current);
    setFeedbackMessage(pickRandom(correct ? FEEDBACK.correct : FEEDBACK.incorrect));
  }

  function handleNext(onFinish: () => void) {
    if (isLast) {
      logQuizCompleted(categoryId, correctCountRef.current, questions.length);
      onFinish();
      return;
    }
    setCurrentIndex((i) => i + 1);
    setSelectedIndex(null);
    setPhase('answering');
    setFeedbackMessage('');
    questionShownAtRef.current = Date.now();
  }

  function getOptionState(index: number): 'idle' | 'correct' | 'incorrect' {
    if (phase !== 'feedback') return 'idle';
    if (index === question?.correctIndex) return 'correct';
    if (index === selectedIndex) return 'incorrect';
    return 'idle';
  }

  return {
    questions,
    question,
    currentIndex,
    selectedIndex,
    phase,
    feedbackMessage,
    isLast,
    isCorrect,
    handleSelect,
    handleNext,
    getOptionState,
  };
}
