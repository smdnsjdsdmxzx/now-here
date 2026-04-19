const express = require("express");
const router = express.Router();

const {
  getPosts,
  createPost,
  likePost,
} = require("../controllers/postController");

router.get("/", getPosts);
router.post("/", createPost);
router.post("/:id/like", likePost);

module.exports = router;