import { Request, Response } from "express";
import { sql } from "../configs/database";
import jwt from "jsonwebtoken";

import { notFoundMesage, serverErrorMessage, successMessage, failedMessage } from '../misc/messages'

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
                dob,
                gender
            FROM
                "user"
            WHERE
                username = ${username} AND
                password = ${password}
            LIMIT 1
        `

        if(getUser.length === 0) {
            return failedMessage(res, "Invalid credentials!");
        }

        if(getUser.length > 0) {
            const token = jwt.sign(
                { 
                    user: getUser[0]
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
                user: getUser[0]
            });            
        }
    } catch (error) {
        serverErrorMessage(res);        
    }
}

export const verifyUser = async (req: Request, res: Response) => {
    const { user_id, password } = req.body;

    if(!user_id || !password) {
        return failedMessage(res, "Password is required!");
    }

    try {
        const getUser = await sql`
            SELECT
                id
            FROM
                "user"
            WHERE
                id = ${user_id} AND
                password = ${password}
            LIMIT 1
        `

        if(getUser.length === 0) {
            return failedMessage(res, "Invalid credentials!");
        }

        successMessage(res, getUser[0]);
    } catch (error) {
        serverErrorMessage(res);
    }
}

export const register = async (req: Request, res: Response) => {
    const { username, dob, gender, password } = req.body;

    if(!username || !dob || !gender || !password) {
        return failedMessage(res, "All fields are required!");
    }

    try {
        const insertUser = await sql`
            INSERT INTO "user" (username, dob, gender, password, created_at)
                VALUES (${username}, ${dob}, ${gender}, ${password}, CURRENT_DATE)
            RETURNING
                "id";
        `

        if(insertUser) {
            await sql`
                INSERT INTO finance (user_id, balance, emergency_fund, expense)
                    VALUES (${insertUser[0].id}, 0, 0, 0)
            `

            successMessage(res, insertUser[0]);
        } else {
            return failedMessage(res, "Error in creating 'finance' table!")
        }
    } catch (error) {
        serverErrorMessage(res);
    }
}

export const getAllUsers = async () => {
    const getUsers = await sql`
        SELECT
            *
        FROM
            "user"
    `

    if(getUsers.length === 0) {
        console.log("No users found!");
    }

    return getUsers;
}

export const updateUser = async (req: Request, res: Response) => {
    const { id } = req.params;
    const { username, dob, gender, password } = req.body;

    try {
        const updateUser = await sql`
            UPDATE "user"
            SET
                username = ${username},
                dob = ${dob},
                gender = ${gender},
                password = ${password}
            WHERE
                id = ${id}
            RETURNING *
        `

        if(updateUser.length === 0) {
            return notFoundMesage(res, "User not found!");
        }

        successMessage(res, updateUser);
    } catch (error) {
        serverErrorMessage(res);
    }
}

export const deleteUser = async (req: Request, res: Response) => {
    const { id } = req.params;

    try {
        const deleteUser = await sql`
            DELETE FROM "user"
            WHERE
                id = ${id}
            RETURNING
                *
        `

        if(deleteUser.length === 0) {
            return notFoundMesage(res, "User not found!");
        }

        successMessage(res, deleteUser);
    } catch (error) {
        serverErrorMessage(res);
    }
}