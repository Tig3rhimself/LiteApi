import fetch from 'node-fetch';

export default async function handler(req, res) {
  try {
    const apiKey = process.env.LITEAPI_KEY; // Use the correct environment variable
    if (!apiKey) {
      return res.status(500).json({ error: 'LITEAPI_KEY is not set in environment variables' });
    }

    const { countryCode = 'US', cityName = 'New York' } = req.query;

    const response = await fetch(
      `https://api.liteapi.travel/v3.0/data/hotels?countryCode=${countryCode}&cityName=${encodeURIComponent(cityName)}`,
      {
        headers: {
          'X-API-Key': apiKey,
        },
      }
    );

    if (!response.ok) {
      return res.status(response.status).json({
        error: `LiteAPI error - ${response.statusText}`,
      });
    }

    const data = await response.json();
    return res.status(200).json(data);
  } catch (error) {
    return res.status(500).json({
      error: 'Server error',
      details: error.message,
    });
  }
}
