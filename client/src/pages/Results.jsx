import React from 'react';
import { useNavigate, useParams, useLocation } from 'react-router-dom';
import { ScoreBoard } from '../components/ScoreBoard';

export function Results() {
  const { annee, id } = useParams();
  const location = useLocation();
  const navigate = useNavigate();

  const { binome, scores, totalScore, totalQuestions, exercices } = location.state ?? {};

  if (!exercices) {
    return (
      <div className="page">
        <p>Aucun résultat à afficher.</p>
        <button className="btn btn--primary" onClick={() => navigate('/')}>Accueil</button>
      </div>
    );
  }

  return (
    <div className="page page--results">
      <ScoreBoard
        exercices={exercices}
        scores={scores ?? []}
        totalScore={totalScore ?? 0}
        totalQuestions={totalQuestions ?? 0}
        binome={binome ?? 'Binôme'}
      />
      <div className="results__actions">
        <button
          className="btn btn--secondary"
          onClick={() => navigate(`/identification/${annee}/${id}`)}
        >
          Rejouer
        </button>
        <button className="btn btn--primary" onClick={() => navigate('/')}>
          Accueil
        </button>
      </div>
    </div>
  );
}
