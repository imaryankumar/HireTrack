import mongoose from "mongoose";
import JobApplication from "../models/posts.model.js";
import userModel from "../models/user.model.js";
import response from "../utils/response.js";
import notificationModel from "../models/notification.model.js";
import { emitToUser } from "../utils/socket.js";
import { cloudinary } from "../utils/Cloudinary.js";

export const postCreated = async (req, res) => {
  try {
    const userId = req.userId;
    const filename = req.file.path || null;
    const { companyName, position, location, salaryRange, notes, status } =
      req.body || {};

    if (!userId) {
      return response(res, 400, false, "userId not found!!");
    }

    if (!companyName || !position || !location) {
      return response(res, 400, false, "All fields are required!");
    }

    const isPostApplied = await JobApplication.findOne({
      user: userId,
      companyName,
    });
    if (isPostApplied) {
      return response(res, 400, false, "Already add this application!!");
    }

    const userPost = await JobApplication.create({
      companyName,
      user: userId,
      position,
      status,
      appliedDate: new Date(),
      location,
      salaryRange,
      notes,
      resume: filename
        ? {
            url: filename,
            public_id: `resume_${userId}`,
          }
        : undefined,
    });

    const allAdmins = await userModel.find({ role: "admin" });
    if (!allAdmins) {
      return response(res, 400, false, "Admin not found!");
    }
    // for (const admin of allAdmins) {
    //   const notification = await notificationModel.create({
    //     sender: userId,
    //     receiver: admin._id,
    //     type: "JOB_APPLIED",
    //     message: `Applied to ${companyName}`,
    //   });
    //   emitToUser(admin._id.toString(), "newNotification", notification);
    // }

    const postDetails = {
      companyName: userPost.companyName,
      position: userPost.position,
      status: userPost.status,
      location: userPost.location,
      salaryRange: userPost.salaryRange,
      notes: userPost.notes,
      pdfurl: userPost.resume.url || null,
    };

    return response(res, 201, true, "Post Created Successfully!!", {
      postDetails,
    });
  } catch (error) {
    console.error("Job Application Error:", error.message);
    return response(res, 500, false, "Internal server error!!");
  }
};

export const allPosts = async (req, res) => {
  const { status, search = "", page = 1, limit = 10 } = req.query;
  try {
    const query = { user: req.userId };
    if (status) query.status = status;

    if (search) {
      const searchRegex = new RegExp(search, "i");
      query.$or = [
        { companyName: searchRegex },
        { position: searchRegex },
        { location: searchRegex },
      ];
    }

    // Pagination logic
    const skip = (Number(page) - 1) * Number(limit);

    const getAllPosts = await JobApplication.find(query)
      .select("-user")
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(Number(limit));

    // Count total for pagination
    const totalPosts = await JobApplication.countDocuments(query);

    const [appliedCount, interviewCount, offerCount, rejectCount] =
      await Promise.all([
        JobApplication.countDocuments({ user: req.userId, status: "applied" }),
        JobApplication.countDocuments({
          user: req.userId,
          status: "interviewing",
        }),
        JobApplication.countDocuments({ user: req.userId, status: "offer" }),
        JobApplication.countDocuments({ user: req.userId, status: "rejected" }),
      ]);

    const allPosts = {
      getAllPosts,
      jobsLength: {
        appliedCount,
        interviewCount,
        offerCount,
        rejectCount,
      },
      totalPost: totalPosts,
      currentPage: Number(page),
      totalPages: Math.ceil(totalPosts / Number(limit)),
    };

    return response(res, 200, true, "Get all posts", { allPosts });
  } catch (error) {
    console.error("All Post Error:", error.message);
    return response(res, 500, false, "Internal server error!!");
  }
};

export const getPost = async (req, res) => {
  try {
    const userId = req.params.id;
    if (!mongoose.Types.ObjectId.isValid(userId)) {
      return response(res, 400, false, "Invalid Post ID");
    }
    const post = await JobApplication.findById(userId).select("-user");
    if (!post) {
      return response(res, 400, false, "Post not found!!");
    }
    return response(res, 200, true, "post details", { post });
  } catch (error) {
    console.error("All Post Error:", error.message);
    return response(res, 500, false, "Internal server error!!");
  }
};

export const updatePost = async (req, res) => {
  try {
    const userId = req.params.id;
    if (!mongoose.Types.ObjectId.isValid(userId)) {
      return response(res, 400, false, "Invalid Post ID");
    }
    const updateValue = req.body || {};
    if (!updateValue || Object.keys(updateValue).length === 0) {
      return response(res, 400, false, "No update value provided!!");
    }
    const post = await JobApplication.findById(userId);
    if (!post) {
      return response(res, 404, false, "Post not found!!");
    }
    if (req.file) {
      if (post.resume?.public_id) {
        await cloudinary.uploader.destroy(post.resume.public_id, {
          resource_type: "raw",
        });
      }
      updateValue.resume = {
        url: req.file.path,
        public_id: req.file.filename,
      };
    }
    const updatePost = await JobApplication.findByIdAndUpdate(
      userId,
      updateValue,
      { new: true }
    ).select("-user");
    if (!updatePost) {
      return response(res, 400, false, "updated post not found!!");
    }
    return response(res, 200, true, "Updated Posts", { updatePost });
  } catch (error) {
    console.error("Update Post Error:", error.message);
    return response(res, 500, false, "Internal server error!!");
  }
};

export const deletePost = async (req, res) => {
  try {
    const userId = req.params.id;
    if (!mongoose.Types.ObjectId.isValid(userId)) {
      return response(res, 400, false, "Invalid Post ID");
    }
    const post = await JobApplication.findById(userId);
    if (!post) {
      return response(res, 404, false, "Post not found!!");
    }
    if (post.resume?.public_id) {
      await cloudinary.uploader.destroy(post.resume.public_id, {
        resource_type: "raw",
      });
    }

    const deletePost = await JobApplication.findByIdAndDelete(userId);
    if (!deletePost) {
      return response(res, 400, false, "deleted post not found!!");
    }
    return response(res, 200, true, "Deleted Posts");
  } catch (error) {
    console.error("Delete Post Error:", error.message);
    return response(res, 500, false, "Internal server error!!");
  }
};

export const savePosts = async (req, res) => {
  try {
    const { postId } = req.params;
    const userId = req.userId;
    if (!mongoose.Types.ObjectId.isValid(postId)) {
      return response(res, 400, false, "Invalid post ID");
    }
    const post = await JobApplication.findById(postId);

    if (!post) {
      return response(res, 404, false, "Post not found!");
    }

    const user = await userModel.findById(userId);
    if (!user) {
      return response(res, 404, false, "User not found");
    }

    const index = user.savedPosts.indexOf(postId);
    if (index !== -1) {
      //unsave post
      user.savedPosts.splice(index, 1);
      await user.save();
      return response(res, 200, true, "Post unsaved successfully", {
        savedPosts: user.savedPosts,
      });
    } else {
      //save post
      user.savedPosts.push(postId);
      await user.save();
      return response(res, 200, true, "Post saved successfully!", {
        savedPosts: user.savedPosts,
      });
    }
  } catch (error) {
    console.error("Save Post Error:", error.message);
    return response(res, 500, false, "Internal server error!!");
  }
};

export const saveAllPosts = async (req, res) => {
  try {
    const { search = "", page = 1, limit = 10 } = req.query;
    const userId = req.userId;
    const skip = Number(page - 1) * Number(limit);

    const matchCondition = search
      ? {
          $or: [
            { companyName: { $regex: search, $options: "i" } },
            { position: { $regex: search, $options: "i" } },
            { location: { $regex: search, $options: "i" } },
          ],
        }
      : {};

    const user = await userModel.findById(userId).populate({
      path: "savedPosts",
      match: matchCondition,
      options: {
        sort: { createdAt: -1 },
        skip: parseInt(skip),
        limit: parseInt(limit),
      },
    });

    if (!user) {
      return response(res, 404, false, "User not found!!");
    }
    const allposts = {
      savePosts: user.savedPosts,
      totalPost: user.savedPosts.length,
      currentPage: Number(page),
    };
    return response(res, 200, true, "Get all posts", { allposts });
  } catch (error) {
    console.error("Save Post Error:", error.message);
    return response(res, 500, false, "Internal server error!!");
  }
};

export const deleteSavePost = async (req, res) => {
  try {
    const { postId } = req.params;
    const userId = req.userId;
    if (!mongoose.Types.ObjectId.isValid(postId)) {
      return response(res, 400, false, "Invalid post ID");
    }
    const user = await userModel.findById(userId);
    if (!user) {
      return response(res, 404, false, "user not found!!");
    }
    const alreadySaved = user.savedPosts.some((id) => id.toString() === postId);
    if (!alreadySaved) {
      return response(res, 400, false, "Post already deleted from saved list!");
    }
    user.savedPosts = user.savedPosts.filter((id) => id.toString() !== postId);
    await user.save();
    return response(res, 200, false, "Post removed from saved successfully!");
  } catch (error) {
    console.error("Delete Post Error:", error.message);
    return response(res, 500, false, "Internal server error!!");
  }
};
