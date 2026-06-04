const mongoose = require("mongoose");

const favoriteSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    required: true,
    ref: "User",
  },
  name: String,
  country: String,
  lat: Number,
  lon: Number,
});

module.exports = mongoose.model("Favorite", favoriteSchema);