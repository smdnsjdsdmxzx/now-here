const express = require("express");
const cors = require("cors");
const mongoose = require("mongoose");

const postRoutes = require("./routes/postRoutes");

const app = express();

app.use(cors());
app.use(express.json({ limit: "10mb" }));

// 🔥 BURASI KRİTİK
const startServer = async () => {
  try {
    await mongoose.connect(
      "mongodb+srv://Ahmethan:13579Ahmethan@cluster0.zflftof.mongodb.net/nowhere"
    );

    console.log("MongoDB bağlandı ✅");

    // ROUTES SADECE BAĞLANDIKTAN SONRA
    app.use("/api/posts", postRoutes);

    app.listen(5000, () => {
      console.log("Server çalışıyor: http://localhost:5000");
    });
  } catch (err) {
    console.error("DB bağlantı hatası ❌", err.message);
  }
};

startServer();