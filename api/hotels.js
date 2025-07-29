import fetch from 'node-fetch';

export default async function handler(req, res) {
  try {
    const apiKey = process.env.LITEAPI_KEY;
    if (!apiKey) {
      return res.status(500).json({ error: 'LiteAPI key not configured' });
    }

    // Extract query parameters
    const {
      countryCode = 'US',
      cityName = 'New York',
      checkin = '2025-08-01',
      checkout = '2025-08-03',
      adults = 1,
    } = req.query;

    // Build LiteAPI request URL
    const apiUrl = `https://api.liteapi.travel/v3.0/data/hotels?countryCode=${countryCode}&cityName=${encodeURIComponent(cityName)}`;

    // Call LiteAPI
    const response = await fetch(apiUrl, {
      headers: {
        'X-API-Key': apiKey,
        'Content-Type': 'application/json',
      },
    });

    if (!response.ok) {
      const errorText = await response.text();
      return res.status(response.status).json({ error: `LiteAPI error: ${errorText}` });
    }

    const data = await response.json();
    res.status(200).json(data);
  } catch (error) {
    console.error('Server error:', error);
    res.status(500).json({ error: 'Server error', details: error.message });
  }
}

}
