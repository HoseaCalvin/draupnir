import { Request, Response } from "express";

import { sql } from "../configs/database";
import { failedMessage, notFoundMesage, serverErrorMessage, successMessage } from "../misc/messages";

export const insertMonthlyExpense = async (req: Request, res: Response) => {
    const { user_id, name, amount } = req.body;

    if(!user_id || !name || !amount) {
        return failedMessage(res, "All fields are required!");
    }

    try {
        const insertExpense = await sql`
            INSERT INTO expense_list (user_id, name, amount)
                VALUES (${user_id}, ${name}, ${amount})
            RETURNING
                *
        `

        if(!insertExpense) {
            return failedMessage(res, "One of the fields is missing!");
        }

        successMessage(res, insertExpense[0]);
    } catch (error) {
        serverErrorMessage(res);
    }
}

export const reduceBalance = async (user_id: string) => {
    if(!user_id) {
        console.log("user_id is missing!");
    }

    try {
        const reduceBalance = await sql`
            UPDATE
                finance
            SET
                balance = balance - (
                    SELECT
                        COALESCE(SUM(amount), 0)
                    FROM
                        expense_list
                    WHERE
                        user_id = ${user_id}
                )
            WHERE
                user_id = ${user_id};
        `

        return reduceBalance;
    } catch (error) {
        console.error("Error in reducing balance!", error);
    }
}

export const getMonthlyExpense = async (req: Request, res: Response) => {
    const { user_id } = req.params;

    if(!user_id) {
        return failedMessage(res, "user_id is missing!");
    }

    try {
        const getExpense = await sql`
            SELECT
                *
            FROM
                expense_list
            WHERE
                user_id = ${user_id}
        `

        successMessage(res, getExpense);
    } catch (error) {
        serverErrorMessage(res);
    }
}

export const deleteMonthlyExpense = async (req: Request, res: Response) => {
    const { id, user_id } = req.body;

    if(!id || !user_id) {
        return failedMessage(res, "id or user_id is missing!");
    }

    try {
        const deleteExpense = await sql`
            DELETE FROM
                expense_list
            WHERE
                id = ${id} 
                AND user_id = ${user_id}
        `

        if(!deleteExpense) {
            return notFoundMesage(res, "user_id not found!");
        }

        successMessage(res, deleteExpense);
    } catch (error) {
        serverErrorMessage(res);
    }    
}