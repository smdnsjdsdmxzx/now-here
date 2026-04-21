const express = require("express");
const router = express.Router();
const User = require("../models/User");

// REGISTER
router.post("/register", async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({ message: "Boş alan var" });
    }

    const existing = await User.findOne({ email });

    if (existing) {
      return res.status(400).json({ message: "Email zaten var" });
    }

    const user = new User({ email, password });
    await user.save();

    res.json({ success: true });
  } catch (err) {
    console.log(err);
    res.status(500).json({ message: "Server hata" });
  }
});

// LOGIN
router.post("/login", async (req, res) => {
  try {
    const { email, password } = req.body;

    console.log("LOGIN DENEME:", email, password);

    const user = await User.findOne({ email });

    if (!user) {
      return res.status(401).json({ message: "Kullanıcı yok" });
    }

    if (user.password !== password) {
      return res.status(401).json({ message: "Şifre yanlış" });
    }

    res.json({ success: true, user });
  } catch (err) {
    console.log(err);
    res.status(500).json({ message: "Server hata" });
  }
});

module.exports = router;