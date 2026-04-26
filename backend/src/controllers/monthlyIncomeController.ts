import { Request, Response } from "express";

import { sql } from "../configs/database";
import { failedMessage, notFoundMesage, serverErrorMessage, successMessage } from "../misc/messages";

export const insertMonthlyIncome = async (req: Request, res: Response) => {
    const { user_id, name, amount } = req.body;

    if(!user_id || !name || !amount) {
        return failedMessage(res, "All fields are required!");
    }

    try {
        const insertIncome = await sql`
            INSERT INTO income_list (user_id, name, amount)
                VALUES (${user_id}, ${name}, ${amount})
            RETURNING
                *
        `

        if(insertIncome.length === 0) {
            return failedMessage(res, "Failed to insert an Income Item!");
        }

        successMessage(res, insertIncome[0]);
    } catch (error) {
        serverErrorMessage(res);
    }
}

export const addIncomeToBalance = async (user_id: string) => {
    if(!user_id) {
        console.log("User ID is missing!");
    }

    try {
        const appendBalance = await sql`
            UPDATE
                finance
            SET
                balance = balance + (
                    SELECT
                        COALESCE(SUM(amount), 0)
                    FROM
                        income_list
                    WHERE
                        user_id = ${user_id}
                )
            WHERE
                user_id = ${user_id};
        `

        return appendBalance;
    } catch (error) {
        console.error("There was an error while adding income to your balance!", error);
    }
}

export const getMonthlyIncome = async (req: Request, res: Response) => {
    const { user_id } = req.params;

    if(!user_id) {
        return failedMessage(res, "User ID is missing!");
    }

    try {
        const getIncome = await sql`
            SELECT
                *
            FROM
                income_list
            WHERE
                user_id = ${user_id}
        `

        successMessage(res, getIncome);
    } catch (error) {
        serverErrorMessage(res);
    }
}

export const deleteMonthlyIncome = async (req: Request, res: Response) => {
    const { id, user_id } = req.body;

    if(!id || !user_id) {
        return failedMessage(res, "All fields are required!");
    }

    try {
        const deleteIncome = await sql`
            DELETE FROM
                income_list
            WHERE
                id = ${id} AND
                user_id = ${user_id}
            RETURNING
                *
        `

        if(deleteIncome.length === 0) {
            return notFoundMesage(res, "User or Income Item not found!");
        }

        successMessage(res, deleteIncome);
    } catch (error) {
        serverErrorMessage(res);
    }
}