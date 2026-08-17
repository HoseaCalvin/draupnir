import { Request, Response } from "express";
import { sql } from "../configs/database";
import bcrypt from "bcrypt";

import { notFoundMesage, serverErrorMessage, successMessage, failedMessage } from '../misc/messages'

export const verifyUser = async (req: Request, res: Response) => {
    const { user_id, password } = req.body;

    if(!user_id || !password) {
        return failedMessage(res, "All fields are required!");
    }

    if(!password || password.trim().length <= 0) {
        return failedMessage(res, "Password must not be empty!");
    }

    try {
        const getUser = await sql`
            SELECT
                id,
                password
            FROM
                "user"
            WHERE
                id = ${user_id}
            LIMIT 1
        `

        if(getUser.length === 0) {
            return failedMessage(res, "verifyUser: User not found!");
        }

        const user = getUser[0];
        const isPasswordMatch = await bcrypt.compare(password, user.password);

        if(!isPasswordMatch) {
            return failedMessage(res, "Invalid credentials!");
        }

        successMessage(res, {
            user: {
                id: user.id
            }
        });
    } catch (error) {
        serverErrorMessage(res);
    }
}

export const register = async (req: Request, res: Response) => {
    const { username, email, password } = req.body;

    if(!username || !email || !password) {
        return failedMessage(res, "All fields are required!");
    }

    if(username.trim().length <= 0) {
        return failedMessage(res, "Username must not be empty!");
    }

    if(email.trim().length <= 0) {
        return failedMessage(res, "Email must not be empty!");
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    try {
        const insertUser = await sql`
            INSERT INTO "user" (username, email, password)
                VALUES (${username}, ${email}, ${hashedPassword})
            RETURNING
                "id";
        `

        if(insertUser) {
            await sql`
                INSERT INTO finance (user_id, balance, deposit, expense)
                    VALUES (${insertUser[0].id}, 0, 0, 0)
            `
        }

        successMessage(res, insertUser[0]);
    } catch (error) {
        serverErrorMessage(res);
        console.error("Error in registering user!", error);
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
        console.log("No Users found!");
    }

    return getUsers;
}

export const updateUserBiodata = async (req: Request, res: Response) => {
    const { id } = req.params;
    const { username, email } = req.body;

    if(!username || !email) {
        return failedMessage(res, "All fields are required!");
    }

    if(username.trim().length <= 0) {
        return failedMessage(res, "Username must not be empty!");
    }

    if(email.trim().length <= 0) {
        return failedMessage(res, "Email must not be empty!");
    }

    try {
        const updateUserBiodata = await sql`
            UPDATE "user"
            SET
                username = ${username},
                email = ${email}
            WHERE
                id = ${id}
            RETURNING 
                *
        `

        if(updateUserBiodata.length === 0) {
            return notFoundMesage(res, "User not found!");
        }

        successMessage(res, updateUserBiodata[0]);
    } catch (error) {
        serverErrorMessage(res);
    }
}

export const updateUserPassword = async (req: Request, res: Response) => {
    const { id } = req.params;
    const { password, confirmPassword } = req.body;
    
    if(!id || !password || !confirmPassword) {
        return failedMessage(res, "All fields are required!");
    }

    if(password !== confirmPassword && confirmPassword.trim().length > 0) {
        return failedMessage(res, "Passwords must match!");
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    try {
        const updateUserPassword = await sql`
            UPDATE "user"
            SET
                password = ${hashedPassword}
            WHERE
                id = ${id}
            RETURNING 
                *
        `

        if(updateUserPassword.length === 0) {
            return notFoundMesage(res, "User not found!");
        }

        successMessage(res, updateUserPassword[0]);        
    } catch (error) {
        serverErrorMessage(res);
    }
}

export const deleteUser = async (req: Request, res: Response) => {
    const { id } = req.params;
    const { email } = req.body;

    if(!id || !email) {
        return failedMessage(res, "All fields are required!");
    }
    
    try {
        const deleteUser = await sql`
            DELETE FROM "user"
            WHERE
                id = ${id}
                AND email = ${email}
            RETURNING
                *
        `

        if(deleteUser.length === 0) {
            return notFoundMesage(res, "User not found!");
        }

        successMessage(res, deleteUser[0]);
    } catch (error) {
        serverErrorMessage(res);
    }
}