const mongoose = require('mongoose');

const weatherCacheSchema = new mongoose.Schema({
  city: {
    type: String,
    required: true,
    unique: true,
    lowercase: true,
    trim: true
  },
  country: String,
  latitude: Number,
  longitude: Number,
  weatherData: mongoose.Schema.Types.Mixed,
  lastUpdated: {
    type: Date,
    default: Date.now
  },
  expiresAt: {
    type: Date,
    default: () => new Date(Date.now() + 60 * 60 * 1000)
  }
});

weatherCacheSchema.index({ expiresAt: 1 }, { expireAfterSeconds: 0 });

module.exports = mongoose.model('WeatherCache', weatherCacheSchema);
