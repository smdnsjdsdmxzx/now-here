const Post = require("../models/Post");

// GET POSTS + GROUP
exports.getPosts = async (req, res) => {
  try {
    const posts = await Post.find().sort({ createdAt: -1 });

    const grouped = {};

    posts.forEach((p) => {
      const key =
        p.placeName?.trim().toLowerCase() ||
        `${Number(p.lat).toFixed(4)},${Number(p.lng).toFixed(4)}`;

      if (!grouped[key]) {
        grouped[key] = {
          placeName: p.placeName || "Konum",
          lat: Number(p.lat),
          lng: Number(p.lng),
          peopleCount: 0,
          posts: [],
        };
      }

      grouped[key].peopleCount += 1;
      grouped[key].posts.push(p);
    });

    res.json(Object.values(grouped));
  } catch (err) {
    console.error("getPosts hata:", err);
    res.status(500).json({ message: "Postlar alınamadı" });
  }
};

// CREATE
exports.createPost = async (req, res) => {
  try {
    const { description, lat, lng, placeName, image, category } = req.body;

    if (!description || description.trim().length < 3) {
      return res.status(400).json({ message: "En az 3 karakter gir" });
    }

    if (
      lat === undefined ||
      lng === undefined ||
      Number.isNaN(Number(lat)) ||
      Number.isNaN(Number(lng))
    ) {
      return res.status(400).json({ message: "Geçersiz konum" });
    }

    const post = await Post.create({
      description: description.trim(),
      lat: Number(lat),
      lng: Number(lng),
      placeName: placeName?.trim() || "Konum",
      image: image || "",
      category: category || "diger",
    });

    res.status(201).json(post);
  } catch (err) {
    console.error("createPost hata:", err);
    res.status(500).json({ message: "Post oluşturulamadı" });
  }
};

// LIKE
exports.likePost = async (req, res) => {
  try {
    const post = await Post.findById(req.params.id);

    if (!post) {
      return res.status(404).json({ message: "Post bulunamadı" });
    }

    post.likes += 1;
    await post.save();

    res.json(post);
  } catch (err) {
    console.error("likePost hata:", err);
    res.status(500).json({ message: "Like işlemi başarısız" });
  }
};