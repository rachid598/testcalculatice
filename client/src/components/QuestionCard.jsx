import React, { useState, useEffect, useRef } from 'react';

export function QuestionCard({ question, qIdx, total, onSubmit }) {
  const [value, setValue] = useState('');
  const inputRef = useRef(null);

  useEffect(() => {
    setValue('');
    inputRef.current?.focus();
  }, [question]);

  const handleSubmit = (e) => {
    e.preventDefault();
    if (value.trim()) onSubmit(value.trim());
  };

  const handleKey = (k) => {
    if (k === 'DEL') {
      setValue(v => v.slice(0, -1));
    } else if (k === 'OK') {
      if (value.trim()) onSubmit(value.trim());
    } else {
      setValue(v => v + k);
    }
  };

  const keys = ['7','8','9','4','5','6','1','2','3',',','0','DEL'];

  return (
    <div className="question-card">
      <div className="question-card__counter">Question {qIdx + 1} / {total}</div>
      <div className="question-card__enonce">{question.enonce}</div>
      <form onSubmit={handleSubmit} className="question-card__form">
        <input
          ref={inputRef}
          type="text"
          className="question-card__input"
          value={value}
          onChange={e => setValue(e.target.value)}
          placeholder="Votre réponse…"
          autoComplete="off"
        />
        <button type="submit" className="btn btn--primary">Valider</button>
      </form>
      <div className="numpad">
        {keys.map(k => (
          <button
            key={k}
            type="button"
            className={`numpad__key ${k === 'DEL' ? 'numpad__key--del' : ''}`}
            onClick={() => handleKey(k)}
          >
            {k === 'DEL' ? '⌫' : k}
          </button>
        ))}
        <button
          type="button"
          className="numpad__key numpad__key--ok"
          onClick={() => handleKey('OK')}
        >
          OK
        </button>
      </div>
    </div>
  );
}
