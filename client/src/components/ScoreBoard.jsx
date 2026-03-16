import React from 'react';

export function ScoreBoard({ exercices, scores, totalScore, totalQuestions, binome }) {
  const pct = totalQuestions > 0 ? Math.round((totalScore / totalQuestions) * 100) : 0;

  const medal = pct >= 80 ? '🥇' : pct >= 60 ? '🥈' : pct >= 40 ? '🥉' : '📚';

  return (
    <div className="scoreboard">
      <div className="scoreboard__medal">{medal}</div>
      <h2 className="scoreboard__title">Résultats de {binome}</h2>
      <div className="scoreboard__total">
        <span className="scoreboard__score">{totalScore}</span>
        <span className="scoreboard__sep"> / </span>
        <span className="scoreboard__max">{totalQuestions}</span>
        <span className="scoreboard__pct"> ({pct}%)</span>
      </div>
      <table className="scoreboard__table">
        <thead>
          <tr>
            <th>Exercice</th>
            <th>Score</th>
            <th>%</th>
          </tr>
        </thead>
        <tbody>
          {exercices.map((ex, i) => {
            const s = scores[i] ?? { correct: 0, total: ex.questions.length };
            const ep = Math.round((s.correct / s.total) * 100);
            return (
              <tr key={ex.id} className={ep >= 60 ? 'row--good' : 'row--bad'}>
                <td>{ex.titre}</td>
                <td>{s.correct} / {s.total}</td>
                <td>{ep}%</td>
              </tr>
            );
          })}
        </tbody>
      </table>
    </div>
  );
}
