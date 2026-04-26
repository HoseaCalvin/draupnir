import { Request, Response } from "express";
import jwt from "jsonwebtoken";
import bcrypt from "bcrypt";
import { sql } from "../configs/database";

import { serverErrorMessage, failedMessage, successMessage } from '../misc/messages'

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

export const login = async (req: Request, res: Response) => {
    const { username, password } = req.body;

    if(!username || !password) {
        return failedMessage(res, "All fields are required!");
    }

    try {
        const getUser = await sql`
            SELECT
                id,
                username,
                email,
                dob,
                password,
                gender
            FROM
                "user"
            WHERE
                username = ${username}
            LIMIT 1
        `

        if(getUser.length === 0) {
            return failedMessage(res, "User not found!");
        }

        const user = getUser[0];
        const isPasswordMatch = await bcrypt.compare(password, user.password);

        if (!isPasswordMatch) {
            return failedMessage(res, "Invalid credentials!");
        }

        if(getUser.length > 0) {
            const token = jwt.sign(
                { 
                    user: {
                        id: user.id,
                        username: user.username,
                        email: user.email,
                        dob: user.dob,
                        gender: user.gender
                    }
                }, 
                process.env.JWT_SECRET!, 
                { 
                    expiresIn: "12h" 
                }
            );

            res.cookie('token', token, {
                httpOnly: true,
                secure: false,
                sameSite: 'lax',
                path: '/'
            });

            return res.status(200).json({
                success: true,
                user: {
                    id: user.id,
                    username: user.username,
                    email: user.email,
                    dob: user.dob,
                    gender: user.gender
                }
            });            
        }
    } catch (error) {
        serverErrorMessage(res);        
    }
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

export const resetPassword = async (req: Request, res: Response) => {
    const { email, password } = req.body;

    if(!email || email.trim().length <= 0) {
        return failedMessage(res, "Email is required!");
    }

    if(!password || password.trim().length <= 0) {
        return failedMessage(res, "Password is required!");
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    try {
        const resetPassword = await sql`
            UPDATE "user"
                SET password = ${hashedPassword}
            WHERE 
                email = ${email}
            RETURNING 
                *
        `

        if(resetPassword.length === 0) {
            return failedMessage(res, "User not found!");
        }

        successMessage(res, resetPassword[0]);
    } catch (error) {
        serverErrorMessage(res);
    }
}