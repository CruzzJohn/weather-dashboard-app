const express = require('express');
const User = require('../models/User');
const authMiddleware = require('../middleware/auth');

const router = express.Router();

router.post("/", authMiddleware, async (req, res) => {
  try {
    const { city, country, latitude, longitude } = req.body;

    if (!city || typeof city !== "string" || !city.trim()) {
      return res.status(400).json({
        message: "City name is required."
      });
    }

    const user = await User.findById(req.userId);

    if (!user) {
      return res.status(404).json({
        message: "User not found"
      });
    }

    const existing = user.favoriteCities.some(
      (fav) => fav.city.toLowerCase() === city.toLowerCase()
    );

    if (existing) {
      return res.status(400).json({
        message: "City already in favorites."
      });
    }

    if (user.favoriteCities.length >= 3) {
      return res.status(400).json({
        message: "You can only save up to 3 favorite cities."
      });
    }

    user.favoriteCities.push({
      city,
      country,
      latitude,
      longitude
    });

    await user.save();

    res.status(201).json({
      message: "Favorite added",
      favoriteCities: user.favoriteCities
    });

  } catch (err) {
    console.error("Favorites add error:", err);

    res.status(500).json({
      message: "Server error"
    });
  }
});

router.get("/", authMiddleware, async (req, res) => {
  try {
    const user = await User.findById(req.userId);
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }
    res.json({ message: 'Favorites retrieved', favoriteCities: user.favoriteCities });
  } catch (err) {
    res.status(500).json({ message: 'Server error' });
  }
});

router.delete("/:city", authMiddleware, async (req, res) => {
  try {
    const cityParam = req.params.city?.trim();
    if (!cityParam) {
      return res.status(400).json({ message: 'City name is required to remove a favorite.' });
    }

    const city = cityParam.toLowerCase();
    const user = await User.findById(req.userId);
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    const favoriteIndex = user.favoriteCities.findIndex((fav) => fav.city.toLowerCase() === city);
    if (favoriteIndex === -1) {
      return res.status(404).json({ message: `Favorite city '${cityParam}' not found.` });
    }

    user.favoriteCities.splice(favoriteIndex, 1);
    await user.save();

    res.json({ message: 'Favorite removed', favoriteCities: user.favoriteCities });
  } catch (err) {
    console.error('Favorites remove error:', err);
    res.status(500).json({ message: 'Unexpected server error. Please try again later.' });
  }
});

module.exports = router;
