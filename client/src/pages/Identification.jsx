import React, { useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';

export function Identification() {
  const { annee, id } = useParams();
  const navigate = useNavigate();
  const [prenom1, setPrenom1] = useState('');
  const [prenom2, setPrenom2] = useState('');

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!prenom1.trim()) return;
    const binome = prenom2.trim() ? `${prenom1.trim()} & ${prenom2.trim()}` : prenom1.trim();
    navigate(`/instructions/${annee}/${id}`, { state: { binome } });
  };

  return (
    <div className="page page--identification">
      <h2 className="page__title">Identification du binôme</h2>
      <p className="page__hint">Entrez vos prénoms (ou un pseudo) pour commencer.</p>
      <form className="identification__form" onSubmit={handleSubmit}>
        <div className="field">
          <label>Élève 1</label>
          <input
            type="text"
            value={prenom1}
            onChange={e => setPrenom1(e.target.value)}
            placeholder="Prénom ou pseudo"
            maxLength={30}
            required
            autoFocus
          />
        </div>
        <div className="field">
          <label>Élève 2 <span className="optional">(optionnel)</span></label>
          <input
            type="text"
            value={prenom2}
            onChange={e => setPrenom2(e.target.value)}
            placeholder="Prénom ou pseudo"
            maxLength={30}
          />
        </div>
        <button type="submit" className="btn btn--primary btn--large">
          Commencer →
        </button>
      </form>
    </div>
  );
}
