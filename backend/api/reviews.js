import axios from "axios";
import dotenv from "dotenv";
dotenv.config();

export default async function handler(req, res) {
  console.log("> reviews.js invocado");
  console.log("API_KEY =", process.env.GOOGLE_API_KEY);
  console.log("PLACE_ID=", process.env.PLACE_ID);

  try {
    const endpoint = `https://maps.googleapis.com/maps/api/place/details/json?place_id=${process.env.PLACE_ID}&fields=name,rating,reviews&reviews_sort=recent&key=${process.env.GOOGLE_API_KEY}`;
    console.log("Endpoint:", endpoint);

    const response = await axios.get(endpoint);
    const reviews = response.data.result.reviews || [];
    console.log("Reviews encontradas:", reviews.length);

    return res.status(200).json(reviews);
  } catch (err) {
    console.error("Erro ao chamar Google API:", err.response?.data || err.message);
    return res.status(500).json({ error: "Erro ao buscar avaliações" });
  }
}
