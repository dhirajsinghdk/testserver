import  jwt  from "jsonwebtoken";
import { Response, NextFunction } from "express";
import {IUser} from "../interface/user.interface";
import {formatResponse} from "./responseMessage"

const jwtToken = process.env.JWT_SECRET_KEY || ""

const authenticate = (
  req: any,
  res: Response,
  next: NextFunction
) => {
  const token = req.headers.authorization?.split(" ")[1];

  if (!token) {
    formatResponse(res, 401, false, "Authentication required.");
    return;
  }

  try {
    const decoded = jwt.verify(token, jwtToken) as Partial<IUser>;
    req.user = decoded;
    next();
  } catch (error) {
    res.status(403).json({
      message: "Invalid token.",
      error: error instanceof Error ? error.message : "Unknown error",
    });
  }
};

export default {
  authenticate,
};
