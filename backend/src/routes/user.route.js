import express from "express";
import {
  adminRoleUpdate,
  allUsers,
  updateUserDetail,
  userLogin,
  userProfile,
  userSignup,
} from "../controllers/user.controller.js";
import isUserAuth from "../middlewares/isUserAuth.js";
import rolebaseAuth from "../middlewares/rolebaseAuth.js";

const router = express.Router();

router.post("/signup", userSignup);
router.post("/login", userLogin);
router.get("/profile", isUserAuth, userProfile);
router.put("/profile/update", isUserAuth, updateUserDetail);
router.get("/all", isUserAuth, rolebaseAuth(["user"]), allUsers);
router.patch("/role/:id", isUserAuth, rolebaseAuth(["user"]), adminRoleUpdate);

export default router;
