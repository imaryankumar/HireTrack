import express from "express";
import {
  allFollowUp,
  createFollow,
  updateFollowstatus,
} from "../controllers/followUp.controller.js";
import isUserAuth from "../middlewares/isUserAuth.js";
import rolebaseAuth from "../middlewares/rolebaseAuth.js";

const router = express.Router();

router.get("/user", isUserAuth, rolebaseAuth(["user"]), allFollowUp);
router.patch("/:id/status", isUserAuth, updateFollowstatus);
router.post("/:postId", isUserAuth, createFollow);

export default router;
