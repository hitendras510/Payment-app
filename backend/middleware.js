import jwt from "jsonwebtoken";
import { JWT_SECRET } from "./config.js";

const authMiddleware = (req, res, next) => {
  const authHeader = req.headers.authorization;

  // Header must exist AND start with "Bearer "
  if (!authHeader || !authHeader.startsWith("Bearer ")) {
    return res.status(403).json({
      message: "Unauthorized",
    });
  }

  const token = authHeader.split(" ")[1];

  try {
    const decoded = jwt.verify(token, JWT_SECRET);
    req.userId = decoded.userId;
    next();
  } catch (err) {
    return res.status(403).json({
      message: "Unauthorized",
    });
  }
};

export { authMiddleware };
