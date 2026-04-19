const mongoose = require("mongoose");

const PostSchema = new mongoose.Schema({
  description: String,
  lat: Number,
  lng: Number,
  placeName: String,
  image: String,

  likes: {
    type: Number,
    default: 0,
  },

  comments: {
    type: Array,
    default: [],
  },

  createdAt: {
    type: Date,
    default: Date.now,
  },
});

module.exports = mongoose.model("Post", PostSchema);