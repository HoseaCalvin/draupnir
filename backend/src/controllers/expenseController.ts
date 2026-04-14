import { Request, Response } from "express";

import { sql } from "../configs/database";
import { failedMessage, notFoundMesage, serverErrorMessage, successMessage } from "../misc/messages";

export const getExpense = async (req: Request, res: Response) => {
    const { user_id } = req.params;

    try {
        const getExpense = await sql`
            SELECT 
                expense AS expense
            FROM
                finance
            WHERE
                user_id = ${user_id}
        `

        if(getExpense.length === 0) {
            return failedMessage(res, "Expense not found!");
        }

        successMessage(res, getExpense[0]);
    } catch (error) {
        serverErrorMessage(res);
    }
}

export const updateExpense = async (req: Request, res: Response) => {
    const { user_id } = req.params;
    const { expense } = req.body;

    if(!expense) {
        return failedMessage(res, "Expense must have minimum values!");
    }

    try {
        const addExpense = await sql`
            UPDATE finance
            SET
                expense = (expense + ${expense})
            WHERE
                user_id = ${user_id}
            RETURNING
                *
        `

        successMessage(res, addExpense);
    } catch (error) {
        serverErrorMessage(res);
    }
}

export const deleteExpense = async (req: Request, res: Response) => {
    const { user_id } = req.params;

    if(!user_id) {
        return failedMessage(res, "user_id is missing!");
    }
    
    try {
        const deleteExpense = await sql`
            UPDATE finance
            SET
                expense = 0
            WHERE 
                user_id = ${user_id}
            RETURNING
                *
        `

        if(deleteExpense.length === 0) {
            return notFoundMesage(res, deleteExpense[0]);
        }

        successMessage(res, deleteExpense);
    } catch (error) {
        serverErrorMessage(res);        
    }
}