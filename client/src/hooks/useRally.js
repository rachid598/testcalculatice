import { useState, useCallback } from 'react';

// States: IDLE → INTRO → EXERCISE_TITLE → PLAYING → FEEDBACK → EXERCISE_END → DONE
export function useRally(exercices) {
  const [state, setState] = useState('IDLE');
  const [exIdx, setExIdx] = useState(0);
  const [qIdx, setQIdx] = useState(0);
  const [scores, setScores] = useState([]);
  const [lastCorrect, setLastCorrect] = useState(null);

  const currentExercice = exercices?.[exIdx] ?? null;
  const currentQuestion = currentExercice?.questions?.[qIdx] ?? null;
  const totalExercices = exercices?.length ?? 0;

  const start = useCallback(() => {
    setExIdx(0);
    setQIdx(0);
    setScores([]);
    setState('EXERCISE_TITLE');
  }, []);

  const beginExercice = useCallback(() => {
    setState('PLAYING');
  }, []);

  const submitAnswer = useCallback((answer) => {
    if (!currentQuestion) return;
    const normalise = s => String(s).trim().replace(',', '.').replace(/\s/g, '');
    const correct = normalise(answer) === normalise(currentQuestion.reponse);
    setLastCorrect(correct);
    setState('FEEDBACK');

    setScores(prev => {
      const updated = [...prev];
      if (!updated[exIdx]) updated[exIdx] = { correct: 0, total: 0 };
      updated[exIdx] = {
        correct: updated[exIdx].correct + (correct ? 1 : 0),
        total: updated[exIdx].total + 1
      };
      return updated;
    });
  }, [currentQuestion, exIdx]);

  const next = useCallback(() => {
    const questions = currentExercice?.questions ?? [];
    if (qIdx + 1 < questions.length) {
      setQIdx(q => q + 1);
      setState('PLAYING');
    } else {
      setState('EXERCISE_END');
    }
  }, [currentExercice, qIdx]);

  const nextExercice = useCallback(() => {
    if (exIdx + 1 < totalExercices) {
      setExIdx(e => e + 1);
      setQIdx(0);
      setState('EXERCISE_TITLE');
    } else {
      setState('DONE');
    }
  }, [exIdx, totalExercices]);

  const skipExercice = useCallback(() => {
    setScores(prev => {
      const updated = [...prev];
      const questions = currentExercice?.questions ?? [];
      updated[exIdx] = updated[exIdx] ?? { correct: 0, total: 0 };
      // mark remaining questions as wrong
      updated[exIdx].total = questions.length;
      return updated;
    });
    nextExercice();
  }, [currentExercice, exIdx, nextExercice]);

  const totalScore = scores.reduce((s, e) => s + (e?.correct ?? 0), 0);
  const totalQuestions = exercices?.reduce((s, e) => s + e.questions.length, 0) ?? 0;

  return {
    state,
    exIdx,
    qIdx,
    currentExercice,
    currentQuestion,
    scores,
    lastCorrect,
    totalScore,
    totalQuestions,
    start,
    beginExercice,
    submitAnswer,
    next,
    nextExercice,
    skipExercice
  };
}
