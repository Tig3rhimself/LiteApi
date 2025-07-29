import fetch from 'node-fetch';

export default async function handler(req, res) {
  try {
    const { countryCode, cityName, checkin, checkout, adults } = req.query;
    const apiKey = process.env.LITEAPI_KEY;

    const response = await fetch(
      `https://api.liteapi.travel/v3.0/data/hotels?countryCode=${countryCode}&cityName=${cityName}`,
      {
        headers: { 'X-API-Key': apiKey },
      }
    );

    if (!response.ok) {
      return res.status(response.status).json({ error: await response.text() });
    }

    const data = await response.json();
    res.status(200).json(data);
  } catch (error) {
    console.error('Error in hotels.js:', error);
    res.status(500).json({ error: 'Server error', details: error.message });
  }
}
