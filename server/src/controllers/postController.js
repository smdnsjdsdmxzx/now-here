const crypto = require("crypto");
const mongoose = require("mongoose");
const Post = require("../models/Post");
const { memoryPosts } = require("../data/memoryStore");

function usesDatabase() {
  return mongoose.connection.readyState === 1;
}

function createId() {
  return crypto.randomUUID ? crypto.randomUUID() : `${Date.now()}-${Math.random()}`;
}

function normalizePost(post, viewerId = "") {
  const source = typeof post.toObject === "function" ? post.toObject() : post;
  const likedBy = source.likedBy || [];

  return {
    _id: String(source._id),
    authorId: source.authorId || "",
    authorName: source.authorName || "Gezgin",
    authorAvatar: source.authorAvatar || "",
    description: source.description || "",
    lat: Number(source.lat),
    lng: Number(source.lng),
    placeName: source.placeName || "Konum",
    image: source.image || "",
    category: source.category || "genel",
    likes: Number(source.likes) || likedBy.length || 0,
    likedBy,
    viewerLiked: viewerId ? likedBy.includes(viewerId) : false,
    comments: source.comments || [],
    createdAt: source.createdAt,
    updatedAt: source.updatedAt,
  };
}

function validatePostInput({ description = "", image = "", lat, lng }) {
  const numericLat = Number(lat);
  const numericLng = Number(lng);

  if (!description.trim() && !image) {
    return "Aciklama veya fotograf eklemelisin.";
  }

  if (description.length > 500) {
    return "Aciklama 500 karakterden uzun olamaz.";
  }

  if (
    Number.isNaN(numericLat) ||
    Number.isNaN(numericLng) ||
    numericLat < -90 ||
    numericLat > 90 ||
    numericLng < -180 ||
    numericLng > 180
  ) {
    return "Gecersiz konum.";
  }

  return null;
}

exports.getPosts = async (req, res) => {
  try {
    if (!usesDatabase()) {
      return res.json(memoryPosts.map((post) => normalizePost(post, req.user?.id)).sort(sortNewest));
    }

    const posts = await Post.find().sort({ createdAt: -1 });
    return res.json(posts.map((post) => normalizePost(post, req.user?.id)));
  } catch (err) {
    console.error("getPosts hata:", err);
    return res.status(500).json({ message: "Postlar alinamadi" });
  }
};

exports.createPost = async (req, res) => {
  try {
    const {
      description = "",
      lat,
      lng,
      placeName = "Konum",
      image = "",
      category = "genel",
    } = req.body;

    const validationError = validatePostInput({ description, image, lat, lng });
    if (validationError) {
      return res.status(400).json({ message: validationError });
    }

    const payload = {
      authorId: req.user.id,
      authorName: req.user.displayName || req.user.avatarName || "Gezgin",
      authorAvatar: req.user.avatarName || "",
      description: description.trim(),
      lat: Number(lat),
      lng: Number(lng),
      placeName: placeName.trim() || "Konum",
      image,
      category,
      likedBy: [],
      likes: 0,
      comments: [],
    };

    if (!usesDatabase()) {
      const now = new Date().toISOString();
      const post = {
        _id: createId(),
        ...payload,
        createdAt: now,
        updatedAt: now,
      };
      memoryPosts.unshift(post);
      return res.status(201).json(normalizePost(post, req.user.id));
    }

    const post = await Post.create(payload);
    return res.status(201).json(normalizePost(post, req.user.id));
  } catch (err) {
    console.error("createPost hata:", err);
    return res.status(500).json({ message: "Post olusturulamadi" });
  }
};

exports.likePost = async (req, res) => {
  try {
    if (!usesDatabase()) {
      const post = memoryPosts.find((item) => item._id === req.params.id);
      if (!post) return res.status(404).json({ message: "Post bulunamadi" });

      const likedBy = post.likedBy || [];
      const liked = likedBy.includes(req.user.id);
      post.likedBy = liked ? likedBy.filter((id) => id !== req.user.id) : [...likedBy, req.user.id];
      post.likes = liked ? Math.max(0, (post.likes || 0) - 1) : (post.likes || 0) + 1;
      post.updatedAt = new Date().toISOString();
      return res.json(normalizePost(post, req.user.id));
    }

    const post = await Post.findById(req.params.id);
    if (!post) return res.status(404).json({ message: "Post bulunamadi" });

    const liked = post.likedBy.includes(req.user.id);
    if (liked) {
      post.likedBy = post.likedBy.filter((id) => id !== req.user.id);
      post.likes = Math.max(0, post.likes - 1);
    } else {
      post.likedBy.push(req.user.id);
      post.likes += 1;
    }

    await post.save();
    return res.json(normalizePost(post, req.user.id));
  } catch (err) {
    console.error("likePost hata:", err);
    return res.status(500).json({ message: "Begeni islemi basarisiz" });
  }
};

exports.commentPost = async (req, res) => {
  try {
    const text = String(req.body.text || "").trim();
    if (text.length < 2) {
      return res.status(400).json({ message: "Yorum en az 2 karakter olmali." });
    }
    if (text.length > 300) {
      return res.status(400).json({ message: "Yorum 300 karakterden uzun olamaz." });
    }

    const comment = {
      _id: createId(),
      userId: req.user.id,
      userName: req.user.displayName || req.user.avatarName || "Gezgin",
      text,
      createdAt: new Date(),
    };

    if (!usesDatabase()) {
      const post = memoryPosts.find((item) => item._id === req.params.id);
      if (!post) return res.status(404).json({ message: "Post bulunamadi" });
      post.comments = [...(post.comments || []), comment];
      post.updatedAt = new Date().toISOString();
      return res.status(201).json(normalizePost(post, req.user.id));
    }

    const post = await Post.findById(req.params.id);
    if (!post) return res.status(404).json({ message: "Post bulunamadi" });
    post.comments.push(comment);
    await post.save();
    return res.status(201).json(normalizePost(post, req.user.id));
  } catch (err) {
    console.error("commentPost hata:", err);
    return res.status(500).json({ message: "Yorum eklenemedi" });
  }
};

function sortNewest(a, b) {
  return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();
}
