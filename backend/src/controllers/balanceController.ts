import { Response, Request } from "express";

import { sql } from "../configs/database";
import { serverErrorMessage, successMessage, failedMessage } from "../misc/messages";

import { insertTransactionLog } from "./transactionLogController";

export const getBalance = async (req: Request, res: Response) => {
    const { user_id } = req.params;

    try {
        const getBalance = await sql`
            SELECT
                SUM(balance) AS balance
            FROM
                finance
            WHERE
                user_id = ${user_id}
            GROUP BY
                user_id
        `

        successMessage(res, getBalance[0]);
    } catch (error) {
        serverErrorMessage(res);        
    }
}

export const updateBalance = async (req: Request, res: Response) => {
    const { user_id } = req.params;
    const { current_balance, category_id } = req.body;

    if(!user_id) {
        return failedMessage(res, "User ID is missing!");
    }

    if(current_balance <= 0) {
        return failedMessage(res, "Current Balance must have a value more than zero!");
    }

    if(!category_id) {
        return failedMessage(res, "Category ID is missing!");
    }
    
    try {
        const updateBalance = await sql`
            UPDATE 
                finance
            SET
                balance = (balance + ${current_balance})
            WHERE
                user_id = ${user_id}
            RETURNING
                *
        `

        if(updateBalance.length === 0) {
            return failedMessage(res, "User not found or query failed to execute!");
        }

        const insertedTransaction = await insertTransactionLog(user_id, new Date(), "Balance", current_balance, category_id);

        if(insertedTransaction.length === 0) {
            return failedMessage(res, "Query failed to execute!");
        }

        successMessage(res, {
            finance: updateBalance[0],
            transaction: insertedTransaction[0]
        });
    } catch (error) {
        serverErrorMessage(res);        
    }
}