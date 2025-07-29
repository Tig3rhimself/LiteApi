import express from 'express';
import fetch from 'node-fetch';
import cors from 'cors';
import dotenv from 'dotenv';

dotenv.config();

const app = express();
app.use(cors());
app.use(express.json());

const PORT = process.env.PORT || 3000;
const LITEAPI_KEY = process.env.LITEAPI_KEY;

// Root endpoint (for health check)
app.get('/', (req, res) => {
  res.send('LiteAPI backend is running.');
});

// Hotel search endpoint
app.post('/api/hotels/rates', async (req, res) => {
  try {
    const { hotelId, checkin, checkout, occupancies } = req.body;

    const response = await fetch('https://api.liteapi.travel/v3.0/hotels/rates', {
      method: 'POST',
      headers: {
        'X-API-Key': LITEAPI_KEY,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        hotelIds: [hotelId],
        checkin,
        checkout,
        occupancies,
        currency: 'USD',
        guestNationality: 'US'
      })
    });

    const data = await response.json();
    res.json(data);
  } catch (error) {
    console.error('Error fetching hotel rates:', error);
    res.status(500).json({ error: 'Failed to fetch hotel rates' });
  }
});

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});

export default app;
