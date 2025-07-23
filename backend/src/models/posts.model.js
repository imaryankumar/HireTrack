import mongoose from "mongoose";

const jobApplicationSchema = new mongoose.Schema(
  {
    user: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
    companyName: { type: String, required: true, unique: true },
    position: { type: String, required: true },
    status: {
      type: String,
      enum: ["applied", "interviewing", "offer", "rejected"],
      default: "applied",
    },
    appliedDate: { type: Date },
    location: { type: String, required: true },
    salaryRange: { type: String },
    notes: { type: String },
  },
  {
    timestamps: true,
  }
);

const JobApplication =
  mongoose.models.JobApplication ||
  mongoose.model("JobApplication", jobApplicationSchema);

export default JobApplication;
