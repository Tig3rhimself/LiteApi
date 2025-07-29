
import express from 'express';
import fetch from 'node-fetch';
import dotenv from 'dotenv';

dotenv.config();
const app = express();
const PORT = process.env.PORT || 3000;

app.get('/', (req, res) => {
  res.send('LiteAPI Hotels Backend is running.');
});

// Hotel search endpoint
app.get('/api/search-hotels', async (req, res) => {
  const { city, checkin, checkout, adults } = req.query;

  if (!city || !checkin || !checkout || !adults) {
    return res.status(400).json({ error: 'Missing required parameters.' });
  }

  try {
    const response = await fetch('https://sandbox.liteapi.travel/api/v1/hotels/search', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Api-Key': process.env.LITEAPI_PRIVATE_KEY
      },
      body: JSON.stringify({
        city_code: city,
        checkin,
        checkout,
        guests: [{ adults: parseInt(adults) }]
      })
    });

    const data = await response.json();
    res.json(data);
  } catch (error) {
    console.error('Error fetching hotels:', error);
    res.status(500).json({ error: 'Failed to fetch hotels.' });
  }
});

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
