const mongoose = require("mongoose");

const connectDB = async () => {
  try {
    await mongoose.connect(
      "mongodb+srv://Ahmethan:13579Ahmethan@cluster0.zflftof.mongodb.net/nowhere"
    );

    console.log("MongoDB bağlandı ✅");
  } catch (err) {
    console.error("DB hata ❌", err.message);
    process.exit(1);
  }
};

module.exports = connectDB;