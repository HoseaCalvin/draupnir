import { Request, Response } from "express";

import { sql } from "../configs/database";
import { failedMessage, notFoundMesage, serverErrorMessage, successMessage } from "../misc/messages";
import { insertTransactionLog } from "./transactionLogController";

export const getExpense = async (req: Request, res: Response) => {
    const { user_id } = req.params;

    try {
        const fetchedExpense = await sql`
            SELECT 
                expense AS expense
            FROM
                finance
            WHERE
                user_id = ${user_id}
        `

        successMessage(res, fetchedExpense[0]);
    } catch (error) {
        serverErrorMessage(res);
    }
}

export const updateExpense = async (req: Request, res: Response) => {
    const { user_id } = req.params;
    const { expense, category_id } = req.body;

    if(!user_id) {
        return failedMessage(res, "User ID is missing!");
    }

    if(!expense) {
        return failedMessage(res, "Expense must have a value more than zero!");
    }

    if(!category_id) {
        return failedMessage(res, "Category ID is missing!");
    }

    try {
        const updatedExpense = await sql`
            UPDATE finance
            SET
                expense = (expense + ${expense}),
                balance = (balance - ${expense})
            WHERE
                user_id = ${user_id}
            RETURNING
                *
        `

        if(updatedExpense.length === 0) {
            return failedMessage(res, "User not found or query failed to execute!");
        }

        const insertedTransaction = await insertTransactionLog(user_id, new Date(), "Expense", expense, category_id);

        if(insertedTransaction.length === 0) {
            return failedMessage(res, "Query failed to execute!");
        }

        successMessage(res, {
            expense: updatedExpense[0],
            transaction: insertedTransaction[0]
        });
    } catch (error) {
        serverErrorMessage(res, error);
    }
}

export const deleteExpense = async (req: Request, res: Response) => {
    const { user_id } = req.params;

    if(!user_id) {
        return failedMessage(res, "User ID is missing!");
    }
    
    try {
        const deletedExpense = await sql`
            UPDATE finance
            SET
                expense = 0
            WHERE 
                user_id = ${user_id}
            RETURNING
                *
        `

        if(deletedExpense.length === 0) {
            return notFoundMesage(res, "User not found!");
        }

        successMessage(res, deletedExpense);
    } catch (error) {
        serverErrorMessage(res, error);        
    }
}