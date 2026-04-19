const Post = require("../models/Post");

// GET POSTS + COUNT
exports.getPosts = async (req, res) => {
  const posts = await Post.find();

  const grouped = {};

  posts.forEach((p) => {
    const key = p.placeName;

    if (!grouped[key]) {
      grouped[key] = {
        placeName: p.placeName,
        lat: p.lat,
        lng: p.lng,
        peopleCount: 0,
        posts: [],
      };
    }

    grouped[key].peopleCount++;
    grouped[key].posts.push(p);
  });

  res.json(Object.values(grouped));
};

// CREATE
exports.createPost = async (req, res) => {
  const { description, lat, lng, placeName, image } = req.body;

  const post = new Post({
    description,
    lat,
    lng,
    placeName,
    image,
  });

  await post.save();

  res.json(post);
};

// LIKE
exports.likePost = async (req, res) => {
  const post = await Post.findById(req.params.id);

  post.likes += 1;
  await post.save();

  res.json(post);
};