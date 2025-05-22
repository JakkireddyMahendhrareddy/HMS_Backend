import jwt from "jsonwebtoken";
import { User } from "../models/userModel.js";

export const auth = async (req, res, next) => {
  try {
    // Get token from cookies or Authorization header
    const jwtToken =
      req.cookies.jwtToken ||
      req.header("Authorization")?.replace("Bearer ", ""); //chnaged by Mahendhra for checking postman

    // If token not found
    if (!jwtToken) {
      throw new Error("Unauthorized User");
    }

    // Verify token
    const decodedToken = jwt.verify(jwtToken, process.env.JWT_SECRET_KEY);
    const { id } = decodedToken;

    // Find user in DB
    const user = await User.findById(id);
    if (!user) {
      throw new Error("User Not Found");
    }

    // Attach user to request
    req.user = user;
    next();
  } catch (err) {
    res.status(401).json({ message: err.message });
  }
};
