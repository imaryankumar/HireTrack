import mongoose from "mongoose";

export const followStatusEnum = [
  "pending",
  "contacted",
  "interested",
  "rejected",
];

const followSchmea = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
    },
    postId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "JobApplication",
    },
    status: {
      type: String,
      enum: followStatusEnum,
      default: "pending",
    },
    notes: {
      type: String,
    },
  },
  {
    timestamps: true,
  }
);

const followModel =
  mongoose.models.FollowUp || mongoose.model("FollowUp", followSchmea);

export default followModel;
