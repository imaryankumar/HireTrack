import express from "express";
import isUserAuth from "../middlewares/isUserAuth.js";
import {
  allPosts,
  deletePost,
  deleteSavePost,
  getPost,
  postCreated,
  saveAllPosts,
  savePosts,
  updatePost,
} from "../controllers/posts.controller.js";

const router = express.Router();

router.post("/create", isUserAuth, postCreated);
router.get("/all", isUserAuth, allPosts);
router.get("/saved", isUserAuth, saveAllPosts);
router.post("/save/:postId", isUserAuth, savePosts);
router.delete("/save/:postId", isUserAuth, deleteSavePost);
router.get("/:id", isUserAuth, getPost);
router.put("/:id", isUserAuth, updatePost);
router.delete("/:id", isUserAuth, deletePost);

export default router;
