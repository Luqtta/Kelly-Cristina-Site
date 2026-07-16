import axios from "axios";
import dotenv from "dotenv";
dotenv.config();

// ponytail: cache em memória da instância serverless; reseta em cold start
// mas corta ~99% das chamadas à Places API. Vercel KV se precisar garantia forte.
let cache = { at: 0, data: null };
const TTL = 60 * 60 * 1000; // 1h — reviews não mudam de minuto em minuto

export default async function handler(req, res) {
  if (req.method !== "POST") {
    return res.status(405).json({ error: "Método não permitido" });
  }

  if (cache.data && Date.now() - cache.at < TTL) {
    return res.status(200).json(cache.data);
  }

  try {
    const endpoint = `https://maps.googleapis.com/maps/api/place/details/json?place_id=${process.env.PLACE_ID}&fields=name,rating,reviews&reviews_sort=recent&key=${process.env.GOOGLE_API_KEY}`;

    const response = await axios.get(endpoint);
    const reviews = response.data.result?.reviews || [];

    cache = { at: Date.now(), data: reviews };
    return res.status(200).json(reviews);
  } catch (err) {
    console.error("Erro ao chamar Google API:", err.response?.status || err.message);
    return res.status(500).json({ error: "Erro ao buscar avaliações" });
  }
}
