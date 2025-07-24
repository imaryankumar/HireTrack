import mongoose from "mongoose";
import followModel, { followStatusEnum } from "../models/followUp.model.js";
import response from "../utils/response.js";

export const createFollow = async (req, res) => {
  try {
    const { postId } = req.params;
    const { status, notes } = req.body || {};
    const userId = req.userId;
    if (!mongoose.Types.ObjectId.isValid(postId)) {
      return response(res, 400, false, "Invalid post Id");
    }
    if (!userId) {
      return response(res, 404, false, "User not found!!");
    }
    if (status && !followStatusEnum.includes(status)) {
      return response(res, 404, false, "Status detail not found!");
    }
    const alreadyFollowed = await followModel.findOne({ userId, postId });
    if (alreadyFollowed) {
      return response(res, 400, false, "Already followed this post!");
    }
    const followDetails = await followModel.create({
      userId,
      postId,
      status,
      notes,
    });
    return response(res, 200, true, "Followup Details", { followDetails });
  } catch (error) {
    console.error("Create Follow Error:", error.message);
    return response(res, 500, false, "Internal server error!!");
  }
};

export const allFollowUp = async (req, res) => {
  try {
    const userId = req.userId;
    if (!userId) {
      return response(res, 404, false, "user not found!!");
    }
    const getAllFollows = await followModel.find({ userId }).populate("postId");
    const allFollows = {
      data: getAllFollows,
      totalFollows: getAllFollows.length,
    };
    return response(res, 200, true, "All followup Details", { allFollows });
  } catch (error) {
    console.error("All FollowUp Error:", error.message);
    return response(res, 500, false, "Internal server error!!");
  }
};

export const updateFollowstatus = async (req, res) => {
  try {
    const { id } = req.params;
    const { status } = req.body || {};
    if (!mongoose.Types.ObjectId.isValid(id)) {
      return response(res, 400, false, "Invalid postId");
    }
    if (!status || Object.keys(req.body).length === 0) {
      return response(res, 400, false, "update field is required");
    }
    if (!followStatusEnum.includes(status)) {
      return response(res, 400, false, "Invalid status Detail");
    }
    const followUpdate = await followModel.findByIdAndUpdate(
      id,
      { status },
      { new: true }
    );
    if (!followUpdate) {
      return response(res, 400, false, "followup update not found!");
    }
    return response(res, 200, true, "Status Updated Successfully", {
      followUpdate,
    });
  } catch (error) {
    console.error("Update status Error:", error.message);
    return response(res, 500, false, "Internal server error!!");
  }
};
