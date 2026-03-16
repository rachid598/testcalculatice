import React, { useState } from 'react';
import { useNavigate, useParams, useLocation } from 'react-router-dom';

const SLIDES = [
  {
    icon: '🤝',
    title: 'Vous êtes par deux !',
    text: 'Installez-vous côte à côte devant l\'écran. Ni papier, ni crayon : tout se fait de tête !'
  },
  {
    icon: '⏱️',
    title: 'Chaque exercice a un chrono',
    text: 'Vous avez 3 minutes par exercice. Répondez à toutes les questions avant la fin du temps !'
  },
  {
    icon: '💬',
    title: 'Discutez ensemble',
    text: 'Parlez à voix basse, échangez vos idées, et choisissez la meilleure réponse ensemble.'
  },
  {
    icon: '✅',
    title: 'Validez votre réponse',
    text: 'Tapez votre réponse au clavier ou utilisez le pavé numérique, puis appuyez sur Valider.'
  },
  {
    icon: '🏆',
    title: 'Prêts ?',
    text: 'À la fin du rallye, vous verrez votre score. Bonne chance !'
  }
];

export function Instructions() {
  const { annee, id } = useParams();
  const location = useLocation();
  const navigate = useNavigate();
  const [slide, setSlide] = useState(0);
  const binome = location.state?.binome ?? 'Binôme';

  const isLast = slide === SLIDES.length - 1;

  const handleNext = () => {
    if (isLast) {
      navigate(`/rallye/${annee}/${id}`, { state: { binome } });
    } else {
      setSlide(s => s + 1);
    }
  };

  const s = SLIDES[slide];

  return (
    <div className="page page--instructions">
      <div className="instructions__card">
        <div className="instructions__icon">{s.icon}</div>
        <h2 className="instructions__title">{s.title}</h2>
        <p className="instructions__text">{s.text}</p>
        <div className="instructions__dots">
          {SLIDES.map((_, i) => (
            <span key={i} className={`dot ${i === slide ? 'dot--active' : ''}`} />
          ))}
        </div>
        <button className="btn btn--primary btn--large" onClick={handleNext}>
          {isLast ? `C'est parti, ${binome} !` : 'Suivant →'}
        </button>
      </div>
    </div>
  );
}
