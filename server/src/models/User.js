const mongoose = require("mongoose");

const userSchema = new mongoose.Schema(
  {
    firstName: {
      type: String,
      trim: true,
      required: true,
      maxlength: 60,
    },
    lastName: {
      type: String,
      trim: true,
      required: true,
      maxlength: 60,
    },
    displayName: {
      type: String,
      trim: true,
      required: true,
      maxlength: 60,
    },
    avatarName: {
      type: String,
      trim: true,
      required: true,
      maxlength: 36,
    },
    email: {
      type: String,
      unique: true,
      required: true,
      lowercase: true,
      trim: true,
    },
    password: {
      type: String,
      required: true,
      select: false,
    },
    profilePhoto: {
      type: String,
      default: "",
    },
    emailVerified: {
      type: Boolean,
      default: false,
    },
    distanceMeters: {
      type: Number,
      default: 0,
      min: 0,
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model("User", userSchema);
