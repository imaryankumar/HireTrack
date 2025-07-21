import response from "../utils/response.js";
import userModel from "../models/user.model.js";

const rolebaseAuth = (roles) => {
  return async (req, res, next) => {
    try {
      const userId = req.userId;
      if (!userId) {
        return response(res, 400, false, "Invalid user ID");
      }
      const user = await userModel.findById(userId).select("role");
      if (!user) {
        return response(res, 404, false, "User not found");
      }
      if (!roles.includes(user.role)) {
        return response(res, 403, false, "Access denied!!");
      }
      next();
    } catch (error) {
      console.error("Role Based Auth Error:", error.message);
      return response(res, 500, false, "Internal server error!!");
    }
  };
};

export default rolebaseAuth;
