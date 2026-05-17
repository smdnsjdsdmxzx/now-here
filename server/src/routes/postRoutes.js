const express = require("express");
const { requireAuth } = require("../middleware/auth");
const {
  getPosts,
  createPost,
  likePost,
  commentPost,
} = require("../controllers/postController");

const router = express.Router();

router.get("/", getPosts);
router.post("/", requireAuth, createPost);
router.post("/:id/like", requireAuth, likePost);
router.post("/:id/comments", requireAuth, commentPost);

module.exports = router;
