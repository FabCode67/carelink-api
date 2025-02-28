import { Request, Response, NextFunction } from "express";
import jwt from "jsonwebtoken";

declare global {
  namespace Express {
    interface Request {
      user?: {
        id: string;
        role: string;
      };
    }
  }
}

export const authMiddleware = (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const token = req.cookies?.token;
    if (!token) {
      res.status(401).json({
        status: 401,
        message: "Unauthorized access!",
      });
      return;
    }
    const decoded = jwt.verify(token, process.env.JWT_SECRETE!) as {
      id: string;
      role: string;
    };
    req.user = {
      id: decoded.id,
      role: decoded.role,
    };
    next();
  } catch (error) {
    if (error instanceof jwt.TokenExpiredError) {
      res.status(401).json({
        status: 401,
        message: "Token expired",
      });
    } else if (error instanceof jwt.JsonWebTokenError) {
      res.status(401).json({
        status: 401,
        message: "Invalid token",
      });
    } else {
      console.error(error);
      res.status(500).json({
        status: 500,
        message: "Internal server error",
      });
    }
  }
};