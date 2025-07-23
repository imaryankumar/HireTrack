import mongoose from "mongoose";

export const roleEnum = ["user", "admin"];

const userSchema = new mongoose.Schema(
  {
    username: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    password: { type: String, required: true, minlength: 6 },
    role: { type: String, enum: roleEnum, default: "user" },
    status: {
      type: String,
      enum: ["active", "inactive", "blocked", "pending", "deleted"],
      default: "active",
    },
    avatar: {
      url: { type: String, default: "" },
      public_id: { type: String, default: "" },
    },
    isVerified: { type: Boolean, default: false },
    savePost: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "JobApplication",
      },
    ],
  },
  {
    timestamps: true,
  }
);

const userModel = mongoose.models.User || mongoose.model("User", userSchema);

export default userModel;
