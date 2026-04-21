require("dotenv").config({
  path: require("path").resolve(__dirname, "../.env"),
});

const express = require("express");
const cors = require("cors");
const mongoose = require("mongoose");

const authRoutes = require("./routes/authRoutes");

const app = express();

app.use(cors());
app.use(express.json());

// DB
mongoose.connect(process.env.MONGO_URI)
  .then(() => console.log("DB bağlandı"))
  .catch((err) => console.log("DB hata:", err));

// ROUTES
app.use("/api/auth", authRoutes);

app.get("/", (req, res) => {
  res.send("API çalışıyor 🚀");
});

const PORT = 5000;

app.listen(PORT, () => {
  console.log("Server çalışıyor:", PORT);
});