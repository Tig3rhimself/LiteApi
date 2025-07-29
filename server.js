import express from 'express';
import fetch from 'node-fetch';
import dotenv from 'dotenv';

dotenv.config();
const app = express();

app.use(express.json());

// Basic test route
app.get('/', (req, res) => {
  res.send('LiteAPI backend is running.');
});

// Hotels search route
app.get('/api/hotels', async (req, res) => {
  const { countryCode = 'IT', cityName = 'Rome' } = req.query;

  try {
    const response = await fetch(
      `https://api.liteapi.travel/v3.0/data/hotels?countryCode=${countryCode}&cityName=${cityName}`,
      {
        headers: {
          'X-API-Key': process.env.LITEAPI_KEY,
        },
      }
    );

    if (!response.ok) {
      return res.status(response.status).json({
        error: 'Failed to fetch hotel data',
        status: response.status,
      });
    }

    const data = await response.json();
    res.json(data);
  } catch (error) {
    res.status(500).json({ error: 'Server error', details: error.message });
  }
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
