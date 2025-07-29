import fetch from 'node-fetch';

export default async function handler(req, res) {
  try {
    const apiKey = process.env.LITEAPI_KEY;
    if (!apiKey) {
      return res.status(500).json({ error: 'LiteAPI key not configured' });
    }

    const { countryCode, cityName, checkin, checkout, adults } = req.query;

    // First, get hotels list
    const hotelsResponse = await fetch(
      `https://api.liteapi.travel/v3.0/data/hotels?countryCode=${countryCode}&cityName=${encodeURIComponent(cityName)}`,
      { headers: { 'X-API-Key': apiKey } }
    );

    if (!hotelsResponse.ok) {
      const errorText = await hotelsResponse.text();
      return res.status(hotelsResponse.status).json({ error: `LiteAPI error: ${errorText}` });
    }

    const hotelsData = await hotelsResponse.json();

    if (!hotelsData.data || hotelsData.data.length === 0) {
      return res.status(200).json({ data: [] });
    }

    // Get rates for the first 10 hotels
    const hotelIds = hotelsData.data.slice(0, 10).map(h => h.id);
    const ratesResponse = await fetch('https://api.liteapi.travel/v3.0/hotels/rates', {
      method: 'POST',
      headers: {
        'X-API-Key': apiKey,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        hotelIds: hotelIds,
        checkin: checkin || '2025-08-01',
        checkout: checkout || '2025-08-03',
        occupancies: [{ adults: Number(adults) || 1 }],
        currency: 'USD',
        guestNationality: 'US',
      }),
    });

    if (!ratesResponse.ok) {
      const errorText = await ratesResponse.text();
      return res.status(ratesResponse.status).json({ error: `Rates API error: ${errorText}` });
    }

    const ratesData = await ratesResponse.json();

    res.status(200).json({ hotels: hotelsData.data, rates: ratesData });
  } catch (error) {
    console.error('Server error:', error);
    res.status(500).json({ error: 'Server error', details: error.message });
  }
}
