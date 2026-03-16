const express = require('express');
const cors = require('cors');
const rallyeRouter = require('./routes/rallye');

const app = express();
const PORT = process.env.PORT || 3001;

app.use(cors());
app.use(express.json());

app.use('/api', rallyeRouter);

app.get('/health', (req, res) => res.json({ status: 'ok' }));

app.listen(PORT, () => {
  console.log(`Serveur Calculatice démarré sur http://localhost:${PORT}`);
});
