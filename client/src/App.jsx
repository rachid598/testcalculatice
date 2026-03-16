import React from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { Home } from './pages/Home';
import { Identification } from './pages/Identification';
import { Instructions } from './pages/Instructions';
import { Rally } from './pages/Rally';
import { Results } from './pages/Results';

export default function App() {
  return (
    <BrowserRouter>
      <div className="app">
        <header className="app__header">
          <a href="/" className="app__brand">🧮 calcul@TICE</a>
        </header>
        <main className="app__main">
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/identification/:annee/:id" element={<Identification />} />
            <Route path="/instructions/:annee/:id" element={<Instructions />} />
            <Route path="/rallye/:annee/:id" element={<Rally />} />
            <Route path="/resultats/:annee/:id" element={<Results />} />
            <Route path="*" element={<Navigate to="/" />} />
          </Routes>
        </main>
      </div>
    </BrowserRouter>
  );
}
