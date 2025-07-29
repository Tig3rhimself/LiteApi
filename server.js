import express from "express";
import fetch from "node-fetch";
import dotenv from "dotenv";

dotenv.config();
const app = express();
const PORT = process.env.PORT || 3000;

// Test root route
app.get("/", (req, res) => {
  res.send("LiteAPI Hotels Backend is running");
});

// Hotel search endpoint
app.get("/api/search-hotels", async (req, res) => {
  const { city, checkIn, checkOut, guests } = req.query;

  if (!city || !checkIn || !checkOut || !guests) {
    return res.status(400).json({ error: "Missing required query parameters" });
  }

  try {
    const response = await fetch(`https://sandbox-liteapi.nuitee.com/hotels?city=${city}&check_in=${checkIn}&check_out=${checkOut}&guests=${guests}`, {
      headers: {
        "Api-key": process.env.LITEAPI_KEY,
        "Accept": "application/json"
      }
    });

    if (!response.ok) {
      throw new Error(`LiteAPI request failed: ${response.statusText}`);
    }

    const data = await response.json();
    res.json(data);
  } catch (error) {
    console.error("Error fetching hotels:", error);
    res.status(500).json({ error: "Failed to fetch hotel data" });
  }
});

// Start server (local development)
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
