import fetch from "node-fetch";

export default async function handler(req, res) {
  try {
    const apiKey = process.env.LITEAPI_KEY;
    const { countryCode = "US", cityName = "New York", limit = 10 } = req.query;

    const url = `https://api.liteapi.travel/v3.0/data/hotels?countryCode=${countryCode}&cityName=${encodeURIComponent(
      cityName
    )}&limit=${limit}`;

    const response = await fetch(url, {
      headers: { "X-API-Key": apiKey },
    });

    if (!response.ok) {
      const text = await response.text();
      return res.status(response.status).json({ error: text });
    }

    const data = await response.json();
    return res.status(200).json(data);
  } catch (error) {
    return res.status(500).json({
      error: "Server error",
      details: error.message,
    });
  }
}
