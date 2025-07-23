import JobApplication from "../models/posts.model.js";
import response from "../utils/response.js";

export const postCreated = async (req, res) => {
  try {
    const userId = req.userId;

    const { companyName, position, location, salaryRange, notes, status } =
      req.body;

    if (!userId) {
      return response(res, 400, false, "userId not found!!");
    }

    if (!companyName || !position || !location) {
      return response(res, 400, false, "All fields are required!");
    }

    const isPostApplied = await JobApplication.findOne({ companyName });
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
    });

    const postDetails = {
      companyName: userPost.companyName,
      position: userPost.position,
      status: userPost.status,
      location: userPost.location,
      salaryRange: userPost.salaryRange,
      notes: userPost.notes,
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
  try {
    const getAllPosts = await JobApplication.find().select("-user");
    if (!getAllPosts) {
      return response(res, 400, false, "Post not found!!");
    }
    const allPosts = {
      getAllPosts,
      totalPost: getAllPosts.length,
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
    if (!userId) {
      return response(res, 400, false, "userId not found!!");
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
    const updateValue = req.body;
    if (!updateValue || Object.keys(updateValue).length === 0) {
      return response(res, 400, false, "No update value provided!!");
    }
    if (!userId) {
      return response(res, 400, false, "userId not found!!");
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
    if (!userId) {
      return response(res, 400, false, "userId not found!!");
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
