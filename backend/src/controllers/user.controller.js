import response from "../utils/response.js";
import userModel, { roleEnum } from "../models/user.model.js";
import jwt from "jsonwebtoken";
import bcrypt from "bcryptjs";

export const userSignup = async (req, res) => {
  try {
    const username = req.body.username?.trim();
    const email = req.body.email?.toLowerCase().trim();
    const password = req.body.password;

    if (!username || !email || !password) {
      return response(res, 400, false, "All fields are required!");
    }

    if (!/^\S+@\S+\.\S+$/.test(email)) {
      return response(res, 400, false, "Invalid email format.");
    }

    if (password.length < 6) {
      return response(
        res,
        400,
        false,
        "Password must be at least 6 characters long"
      );
    }

    const userExist = await userModel.findOne({ email });

    if (userExist) {
      return response(
        res,
        400,
        false,
        "User already registered with this email."
      );
    }

    const avatarPic = `https://avatar.iran.liara.run/username?username=${
      email.slice(0, 2) || "us"
    }`;

    const hashSalt = await bcrypt.genSalt(10);
    const hashPassword = await bcrypt.hash(password, hashSalt);

    const newUser = await userModel.create({
      username,
      email,
      password: hashPassword,
      avatar: {
        url: avatarPic,
        public_id: username,
      },
    });

    return response(res, 201, true, "user created successfully !!", {
      newUser,
    });
  } catch (error) {
    console.error("Signup Error:", error.message);
    return response(res, 500, false, "Internal server error!!");
  }
};

export const userLogin = async (req, res) => {
  try {
    const email = req.body.email?.toLowerCase().trim();
    const password = req.body.password;

    if (!email || !password) {
      return response(res, 400, false, "All fields are required!");
    }
    const isUserExist = await userModel.findOne({ email }).select("+password");
    if (!isUserExist) {
      return response(res, 400, false, "User not registered.");
    }
    const isComparePassword = await bcrypt.compare(
      password,
      isUserExist.password
    );

    if (!isComparePassword) {
      return response(res, 400, false, "Invalid credentials.");
    }

    const token = jwt.sign(
      { userId: isUserExist._id },
      process.env.SECRET_KEY,
      {
        expiresIn: "7d",
      }
    );
    const user = {
      role: isUserExist.role,
      email: isUserExist.email,
    };

    return response(res, 200, true, "Login successfully", { token, user });
  } catch (error) {
    console.error("Login Error:", error.message);
    return response(res, 500, false, "Internal server error!!");
  }
};

export const userProfile = async (req, res) => {
  try {
    const userId = req.userId;
    if (!userId) {
      return response(res, 400, false, "Invalid userid");
    }
    const user = await userModel.findById(userId).select("-password");
    if (!user) {
      return response(res, 400, false, "user not found!!");
    }
    return response(res, 200, true, "user details", { user });
  } catch (error) {
    console.error("User Profile Error:", error.message);
    return response(res, 500, false, "Internal server error!!");
  }
};

export const allUsers = async (req, res) => {
  try {
    const userId = req.userId;
    if (!userId) {
      return response(res, 400, false, "Invalid userId");
    }
    const users = await userModel.find().select("-password -role");
    if (!users) {
      return response(res, 400, false, "user not found!!");
    }
    const allUsers = {
      users,
      totalUsers: users.length,
    };
    return response(res, 200, true, "Get all users", { allUsers });
  } catch (error) {
    console.error("All Users Error:", error.message);
    return response(res, 500, false, "Internal server error!!");
  }
};

export const updateUserDetail = async (req, res) => {
  try {
    const userId = req.userId;
    const updateValue = req.body || {};
    if (!updateValue || Object.keys(updateValue).length === 0) {
      return response(res, 400, false, "No update value provided!!");
    }
    if (!userId) {
      return response(res, 400, false, "Invalid userId");
    }
    const userUpdate = await userModel.findByIdAndUpdate(userId, updateValue, {
      new: true,
    });
    if (!userUpdate) {
      return response(res, 400, false, "updated user not found!!");
    }
    return response(res, 200, true, "updated user", { userUpdate });
  } catch (error) {
    console.error("User Update Error:", error.message);
    return response(res, 500, false, "Internal server error!!");
  }
};

export const adminRoleUpdate = async (req, res) => {
  try {
    const targetUserId = req.params.id;
    const { role } = req.body || {};
    if (!role) {
      return response(res, 400, false, "update field required!!");
    }
    if (!roleEnum.includes(role)) {
      return response(res, 400, false, "Invalid role value");
    }
    if (!targetUserId) {
      return response(res, 400, false, "Invalid userId");
    }
    const roleUpdated = await userModel.findByIdAndUpdate(
      targetUserId,
      { role },
      {
        new: true,
      }
    );
    if (!roleUpdated) {
      return response(res, 400, false, "user not found!!");
    }
    return response(res, 200, true, "Role Updated successfully", {
      roleUpdated,
    });
  } catch (error) {
    console.error("All Users Error:", error.message);
    return response(res, 500, false, "Internal server error!!");
  }
};
