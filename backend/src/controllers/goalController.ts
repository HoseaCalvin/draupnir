import { Request, Response } from "express";

import { sql } from "../configs/database"
import { failedMessage, notFoundMesage, serverErrorMessage, successMessage } from "../misc/messages";

export const insertGoal = async (req: Request, res: Response) => {
    const { user_id, name, target_balance, deadline } = req.body;

    if(!user_id || !deadline || !name || !target_balance) {
        return failedMessage(res, "All fields are required!");
    }

    if(target_balance <= 0) {
        return failedMessage(res, "Target Balance must have a value more than zero!");
    }

    try {
        const insertGoal = await sql`
            INSERT INTO goal (user_id, name, target_balance, deadline)
                VALUES (${user_id}, ${name}, ${target_balance}, ${deadline})
            RETURNING
                *
        `

        if(insertGoal.length === 0) {
            return failedMessage(res, "Failed to insert a goal!");
        }

        successMessage(res, insertGoal);
    } catch (error) {
        serverErrorMessage(res);    
    }
}

export const getGoalById = async (req: Request, res: Response) => {
    const { id } = req.params;

    try {
        const getGoal = await sql`
            SELECT
                *
            FROM
                goal
            WHERE
                id = ${id}
        `

        successMessage(res, getGoal);
    } catch (error) {
        serverErrorMessage(res);
    }
}

export const getGoalByUserId = async (req: Request, res: Response) => {
    const { user_id } = req.params;

    try {
        const userGoal = await sql`
            SELECT
                *
            FROM
                goal
            WHERE
                user_id = ${user_id}
            ORDER BY
                name
        `

        successMessage(res, userGoal);
    } catch (error) {
        serverErrorMessage(res);
    }
}

export const updateGoal = async (req: Request, res: Response) => {
    const { id, user_id, name, target_balance, deadline } = req.body;

    if(!id || !user_id || !target_balance || !deadline) {
        return failedMessage(res, "All fields are required");
    }

    if(target_balance <= 0) {
        return failedMessage(res, "Target Balance must have a value more than zero!");
    }

    try {
        const updateGoal = await sql`
            UPDATE goal
            SET
                name = ${name},
                deadline = ${deadline},
                target_balance = ${target_balance}
            WHERE
               id = ${id} AND
               user_id = ${user_id}
            RETURNING
                *
        `

        if(updateGoal.length === 0) {
            return notFoundMesage(res, "User or Goal not found!");
        }

        successMessage(res, updateGoal);
    } catch (error) {
        serverErrorMessage(res);
    }
}

export const deleteGoal = async (req: Request, res: Response) => {
    const { id } = req.params;

    try {
        const deleteGoal = await sql`
            DELETE FROM goal
            WHERE
                id = ${id}
            RETURNING 
                *
        `

        if(deleteGoal.length === 0) {
            return notFoundMesage(res, "User or Goal not found!");
        }

        successMessage(res, deleteGoal);
    } catch (error) {
        serverErrorMessage(res);
    }
}