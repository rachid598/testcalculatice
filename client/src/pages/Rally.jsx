import React, { useEffect, useState, useCallback } from 'react';
import { useNavigate, useParams, useLocation } from 'react-router-dom';
import { useRally } from '../hooks/useRally';
import { useTimer } from '../hooks/useTimer';
import { Timer } from '../components/Timer';
import { QuestionCard } from '../components/QuestionCard';
import { ProgressBar } from '../components/ProgressBar';
import rallyeData from '../data/rallye5_2025.json';

export function Rally() {
  const { annee, id } = useParams();
  const location = useLocation();
  const navigate = useNavigate();
  const binome = location.state?.binome ?? 'Binôme';

  const [rallye, setRallye] = useState(null);
  const [countdown, setCountdown] = useState(null); // 3-2-1 before exercise

  const rally = useRally(rallye?.exercices);

  const handleTimerExpire = useCallback(() => {
    if (rally.state === 'PLAYING') rally.skipExercice();
  }, [rally]);

  const timer = useTimer(rallye?.dureeExercice ?? 180, handleTimerExpire);

  // Load rallye data (static import, no server needed)
  useEffect(() => {
    setRallye(rallyeData);
  }, [annee, id]);

  // Auto-start when data loaded
  useEffect(() => {
    if (rallye && rally.state === 'IDLE') {
      rally.start();
    }
  }, [rallye]);

  // Handle state transitions
  useEffect(() => {
    if (rally.state === 'EXERCISE_TITLE') {
      timer.reset();
      // countdown 3s
      let c = 3;
      setCountdown(c);
      const iv = setInterval(() => {
        c -= 1;
        if (c <= 0) {
          clearInterval(iv);
          setCountdown(null);
          rally.beginExercice();
        } else {
          setCountdown(c);
        }
      }, 1000);
      return () => clearInterval(iv);
    }
    if (rally.state === 'PLAYING') {
      timer.start();
    }
    if (rally.state === 'FEEDBACK' || rally.state === 'EXERCISE_END') {
      timer.stop();
    }
    if (rally.state === 'DONE') {
      timer.stop();
      // Save results to localStorage
      const entry = {
        annee: Number(annee),
        rallye: Number(id),
        binome,
        score: rally.totalScore,
        total: rally.totalQuestions,
        pourcentage: Math.round((rally.totalScore / rally.totalQuestions) * 100),
        date: new Date().toISOString()
      };
      try {
        const prev = JSON.parse(localStorage.getItem('calculatice_resultats') || '[]');
        localStorage.setItem('calculatice_resultats', JSON.stringify([...prev, entry]));
      } catch (_) {}
      navigate(`/resultats/${annee}/${id}`, {
        state: { binome, scores: rally.scores, totalScore: rally.totalScore, totalQuestions: rally.totalQuestions, exercices: rallye.exercices }
      });
    }
  }, [rally.state]);

  if (!rallye) {
    return (
      <div className="page page--loading">
        <div className="spinner" />
        <p>Chargement du rallye…</p>
      </div>
    );
  }

  const ex = rally.currentExercice;

  // EXERCISE_TITLE + countdown
  if (rally.state === 'EXERCISE_TITLE' || countdown !== null) {
    return (
      <div className="page page--exercise-title">
        <ProgressBar current={rally.exIdx} total={rallye.exercices.length} label="Exercice" />
        <div className="exercise-title__card">
          <div className="exercise-title__num">Exercice {rally.exIdx + 1}</div>
          <div className="exercise-title__name">{ex?.titre}</div>
          {countdown !== null && (
            <div className="exercise-title__countdown">{countdown}</div>
          )}
        </div>
      </div>
    );
  }

  // FEEDBACK
  if (rally.state === 'FEEDBACK') {
    return (
      <div className="page page--feedback">
        <div className={`feedback__card ${rally.lastCorrect ? 'feedback--correct' : 'feedback--wrong'}`}>
          <div className="feedback__icon">{rally.lastCorrect ? '✅' : '❌'}</div>
          <div className="feedback__message">
            {rally.lastCorrect ? 'Bonne réponse !' : `Réponse : ${rally.currentQuestion?.reponse ?? ''}`}
          </div>
          <button className="btn btn--primary" onClick={rally.next}>
            Question suivante →
          </button>
        </div>
      </div>
    );
  }

  // EXERCISE_END
  if (rally.state === 'EXERCISE_END') {
    const s = rally.scores[rally.exIdx] ?? { correct: 0, total: ex?.questions.length ?? 0 };
    return (
      <div className="page page--exercise-end">
        <div className="exercise-end__card">
          <h3>{ex?.titre}</h3>
          <div className="exercise-end__score">
            {s.correct} / {s.total}
          </div>
          <p>{rally.exIdx + 1 < rallye.exercices.length ? 'Exercice suivant !' : 'Dernier exercice !'}</p>
          <button className="btn btn--primary btn--large" onClick={rally.nextExercice}>
            {rally.exIdx + 1 < rallye.exercices.length ? 'Continuer →' : 'Voir les résultats →'}
          </button>
        </div>
      </div>
    );
  }

  // PLAYING
  return (
    <div className="page page--playing">
      <div className="playing__header">
        <ProgressBar
          current={rally.exIdx + 1}
          total={rallye.exercices.length}
          label={ex?.titre}
        />
        <Timer timeLeft={timer.timeLeft} pct={timer.pct} warning={timer.warning} />
      </div>
      <QuestionCard
        question={rally.currentQuestion}
        qIdx={rally.qIdx}
        total={ex?.questions.length ?? 0}
        onSubmit={rally.submitAnswer}
      />
    </div>
  );
}
