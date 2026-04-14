import { Request, Response, NextFunction } from "express";
import jwt, { JwtPayload } from "jsonwebtoken";

declare module "express-serve-static-core" {
  interface Request {
    user?: string | JwtPayload;
  }
}

export const authenticationToken = (req: Request, res: Response, next: NextFunction) => {
    const token = req.cookies?.token;

    if (!token) {
        return res.status(401).json({ success: false, message: "Missing token!" });
    }

    try {
        const payload = jwt.verify(token, process.env.JWT_SECRET!);
        req.user = payload;
        next();
    } catch {
        res.status(401).json({ success: false, message: "Invalid or expired token!" });
    }
}