// models/Place.js

const mongoose = require("mongoose");

const placeSchema = new mongoose.Schema({
  owner: {
    type: mongoose.Schema.ObjectId,
    ref: "user",
    required: true,
  },
  title: {
    type: String,
    required: true,
  },
  address: {
    type: String,
    required: true,
  },
  photos: [{ type: String }],
  description: {
    type: String,
  },
  perks: [{ type: String }],
  extraInfo: {
    type: String,
  },
  maxGuests: {
    type: Number,
  },
  price: {
    type: Number,
  },
  reviews: [
    {
      reviewName: { type: String, required: true },
      rating: { type: Number, required: true },
      review: { type: String, required: true },
      userId: { type: mongoose.Schema.ObjectId, ref: 'user' },
      createdAt: { type: Date, default: Date.now },
    },
  ],
});

const Place = mongoose.model("Place", placeSchema);

module.exports = Place;
