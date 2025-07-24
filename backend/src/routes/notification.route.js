import express from "express";
import isUserAuth from "../middlewares/isUserAuth.js";
import {
  getAllNotification,
  markAsReadNotification,
} from "../controllers/notification.controller.js";

const router = express.Router();

router.get("/", isUserAuth, getAllNotification);
router.patch("/:id/read", isUserAuth, markAsReadNotification);

export default router;
