import express from "express";
import {
  userLogin,
  userProfile,
  userSignup,
} from "../controllers/user.controller.js";
import isUserAuth from "../middlewares/isUserAuth.js";
import rolebaseAuth from "../middlewares/rolebaseAuth.js";

const router = express.Router();

router.post("/signup", userSignup);
router.post("/login", userLogin);
router.get("/", isUserAuth, rolebaseAuth(["user"]), userProfile);

export default router;
