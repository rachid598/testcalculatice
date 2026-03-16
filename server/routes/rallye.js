const express = require('express');
const fs = require('fs');
const path = require('path');

const router = express.Router();

// In-memory results store
const resultats = [];

// GET /api/rallyes - list available rallyes
router.get('/rallyes', (req, res) => {
  res.json([
    { id: 5, annee: 2025, titre: 'Rallye 5 – CM2 / 6ème', niveau: 'CM2 / 6ème' }
  ]);
});

// GET /api/rallye/:annee/:id - full rallye data with questions
router.get('/rallye/:annee/:id', (req, res) => {
  const { annee, id } = req.params;
  const filePath = path.join(__dirname, `../data/rallye${id}_${annee}.json`);

  if (!fs.existsSync(filePath)) {
    return res.status(404).json({ error: 'Rallye introuvable' });
  }

  const data = JSON.parse(fs.readFileSync(filePath, 'utf-8'));
  res.json(data);
});

// POST /api/resultats - save a binome's score
router.post('/resultats', (req, res) => {
  const { annee, rallye, binome, score, total, details } = req.body;
  if (!binome || score === undefined || total === undefined) {
    return res.status(400).json({ error: 'Données manquantes' });
  }
  const entry = {
    id: Date.now(),
    annee: annee || 2025,
    rallye: rallye || 5,
    binome,
    score,
    total,
    pourcentage: Math.round((score / total) * 100),
    details: details || [],
    date: new Date().toISOString()
  };
  resultats.push(entry);
  res.status(201).json(entry);
});

// GET /api/resultats/:rallye - get scores for a rallye
router.get('/resultats/:rallye', (req, res) => {
  const { rallye } = req.params;
  const filtered = resultats
    .filter(r => String(r.rallye) === String(rallye))
    .sort((a, b) => b.pourcentage - a.pourcentage);
  res.json(filtered);
});

module.exports = router;
