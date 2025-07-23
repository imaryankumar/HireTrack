import express from "express";
import isUserAuth from "../middlewares/isUserAuth.js";
import {
  allPosts,
  deletePost,
  getPost,
  postCreated,
  updatePost,
} from "../controllers/posts.controller.js";

const router = express.Router();

router.post("/create", isUserAuth, postCreated);
router.get("/all", isUserAuth, allPosts);
router.get("/:id", isUserAuth, getPost);
router.put("/:id", isUserAuth, updatePost);
router.delete("/:id", isUserAuth, deletePost);
// router.post("/save/:postId", isUserAuth, savePosts);
// router.get("/saved", isUserAuth, saveAllPosts);

export default router;
