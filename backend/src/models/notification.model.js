import mongoose from "mongoose";

export const notificationEnum = [
  "JOB_APPLIED",
  "FOLLOW_UP",
  "ROLE_UPDATED",
  "JOB_REMOVED",
  "CUSTOM",
];
const notificationSchema = new mongoose.Schema(
  {
    sender: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    receiver: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    type: {
      type: String,
      enum: notificationEnum,
      required: true,
    },
    message: {
      type: String,
      required: true,
    },
    isRead: {
      type: Boolean,
      default: false,
    },
    metadata: {
      jobId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "JobApplication",
      },
      followUpId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "FollowUp",
      },
    },
  },
  { timestamps: true }
);

const notificationModel =
  mongoose.models.Notification ||
  mongoose.model("Notification", notificationSchema);

export default notificationModel;
