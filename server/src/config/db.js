const mongoose = require("mongoose");

const connectDB = async () => {
  try {
    if (!process.env.MONGO_URI) {
      throw new Error("MONGO_URI eksik");
    }

    await mongoose.connect(process.env.MONGO_URI);
    console.log("MongoDB bağlandı ✅");
  } catch (err) {
    console.error("DB hata ❌", err.message);
    throw err;
  }
};

module.exports = connectDB;