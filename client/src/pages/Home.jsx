import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';

const RALLYES = [
  { id: 5, annee: 2025, titre: 'Rallye 5 – CM2 / 6ème', niveau: 'CM2 / 6ème' }
];

export function Home() {
  const [selected, setSelected] = useState(RALLYES[0]);
  const navigate = useNavigate();

  const handleStart = () => {
    if (selected) navigate(`/identification/${selected.annee}/${selected.id}`);
  };

  return (
    <div className="page page--home">
      <div className="home__logo">
        <span className="home__logo-icon">🧮</span>
        <h1 className="home__title">calcul@TICE</h1>
        <p className="home__subtitle">Rallyes de calcul mental</p>
      </div>

      <div className="home__select-card">
        <label className="home__label">Choisir un rallye :</label>
        <div className="home__rallye-list">
          {RALLYES.map(r => (
            <button
              key={`${r.annee}-${r.id}`}
              className={`home__rallye-btn ${selected?.id === r.id ? 'home__rallye-btn--active' : ''}`}
              onClick={() => setSelected(r)}
            >
              <strong>{r.titre}</strong>
              <span>{r.niveau} · {r.annee}</span>
            </button>
          ))}
        </div>
        <button
          className="btn btn--primary btn--large"
          onClick={handleStart}
          disabled={!selected}
        >
          Jouer →
        </button>
      </div>
    </div>
  );
}
