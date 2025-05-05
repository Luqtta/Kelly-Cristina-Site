import axios from 'axios';

export default async function handler(req, res) {
  const API_KEY = process.env.GOOGLE_API_KEY;
  const PLACE_ID = process.env.PLACE_ID;

  try {
    const endpoint = `https://maps.googleapis.com/maps/api/place/details/json?place_id=${PLACE_ID}&fields=name,rating,reviews&reviews_sort=recent&key=${API_KEY}`;
    const response = await axios.get(endpoint);

    const reviews = response.data.result.reviews || [];
    res.status(200).json(reviews);
  } catch (err) {
    console.error('Erro:', err.response?.data || err.message);
    res.status(500).json({ error: 'Erro ao buscar avaliações' });
  }
}
