require('dotenv').config();
const express = require('express');
const axios = require('axios');
const cors = require('cors');

const app = express();
app.use(cors());

const API_KEY = process.env.GOOGLE_API_KEY;
const PLACE_ID = process.env.PLACE_ID;

app.get('/reviews', async (req, res) => {
  try {
    const endpoint = `https://maps.googleapis.com/maps/api/place/details/json?place_id=${PLACE_ID}&fields=name,rating,reviews&reviews_sort=recent&key=${API_KEY}`;
    const response = await axios.get(endpoint);

    const reviews = response.data.result.reviews || [];
    res.json(reviews);
  } catch (err) {
    console.error('Erro:', err.response?.data || err.message);
    res.status(500).json({ error: 'Erro ao buscar avaliações' });
  }
});

const PORT = 3001;
app.listen(PORT, () => {
  console.log(`Backend rodando em http://localhost:${PORT}`);
});
