import fetch from 'node-fetch';

export default async function handler(req, res) {
  try {
    const { hotelId, checkin, checkout, adults } = req.query;
    const apiKey = process.env.LITEAPI_KEY;

    const response = await fetch(
      'https://api.liteapi.travel/v3.0/hotels/rates',
      {
        method: 'POST',
        headers: {
          'X-API-Key': apiKey,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          hotelIds: [hotelId],
          checkin,
          checkout,
          occupancies: [{ adults: Number(adults) }],
          currency: 'USD',
          guestNationality: 'US',
        }),
      }
    );

    if (!response.ok) {
      return res.status(response.status).json({ error: await response.text() });
    }

    const data = await response.json();
    res.status(200).json(data);
  } catch (error) {
    console.error('Error in hotelRates.js:', error);
    res.status(500).json({ error: 'Server error', details: error.message });
  }
}

