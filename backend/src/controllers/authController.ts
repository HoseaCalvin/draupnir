import { Request, Response } from "express";
import jwt from "jsonwebtoken";
import { authenticationToken } from "../middleware/auth.middleware";

export const authMe = async (req: Request, res: Response) => {
    // const token = req.cookies?.token;

    // if (!token) {
    //     return res.status(401).json({ success: false, message: "No token" });
    // }

    // try {
    //     const decoded = jwt.verify(token, process.env.JWT_SECRET!);
        
    //     return res.json({ success: true, user: (decoded as any).user });
    // } catch (err) {
    //     console.error("JWT verification failed:", err);
    //     return res.status(401).json({ success: false, message: "Invalid token" });
    // }

    return res.json(req.user);
}

export const logout = async (req: Request, res: Response) => {
    res.clearCookie("token", {
        httpOnly: true,
        secure: process.env.NODE_ENV === "production",
        sameSite: "strict",
        path: "/"        
    });

    return res.status(200).json({
        success: true,
        message: "Logged out successfully!"
    });
}