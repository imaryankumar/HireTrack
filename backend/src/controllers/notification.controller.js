import mongoose from "mongoose";
import response from "../utils/response.js";
import notificationModel from "../models/notification.model.js";

export const getAllNotification = async (req, res) => {
  try {
    const notifications = await notificationModel
      .find({
        receiver: req.userId,
      })
      .sort({ createdAt: -1 })
      .lean();
    return response(res, 200, true, "All notifications fetched", {
      notifications,
    });
  } catch (error) {
    console.error("All Notification Error:", error.message);
    return response(res, 500, false, "Internal server error!!");
  }
};

export const markAsReadNotification = async (req, res) => {
  try {
    const { id } = req.params;
    if (!mongoose.Types.ObjectId.isValid(id)) {
      return response(res, 400, false, "Invalid Id");
    }
    const isReadNotificaation = await notificationModel.findByIdAndUpdate(
      id,
      { isRead: true },
      { new: true }
    );
    if (!isReadNotificaation) {
      return response(res, 400, false, "Notification not update!!");
    }
    return response(res, 200, true, "Marked as read");
  } catch (error) {
    console.error("Mark as Read Notification Error:", error.message);
    return response(res, 500, false, "Internal server error!!");
  }
};
