import jwt from "jsonwebtoken";
import response from "../utils/response.js";

const isUserAuth = async (req, res, next) => {
  try {
    const authHeader = req.headers.authorization;
    if (!authHeader || !authHeader.startsWith("Bearer ")) {
      return response(res, 401, false, "Unauthorized: No token provided");
    }

    const token = authHeader.split(" ")[1];

    jwt.verify(token, process.env.SECRET_KEY, (err, decoded) => {
      if (err) {
        return response(res, 401, false, "Unauthorized: Invalid token");
      }
      req.userId = decoded.userId;
      next();
    });
  } catch (error) {
    console.error("User Auth Error:", error.message);
    return response(res, 500, false, "Internal server error!!");
  }
};

export default isUserAuth;
