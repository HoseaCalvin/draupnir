import { Response, Request } from "express";

import { sql } from "../configs/database";
import { serverErrorMessage, notFoundMesage, successMessage, failedMessage } from "../misc/messages";

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

export const reduceBalance = async (req: Request, res: Response) => {
    const { user_id } = req.params;
    const { expense } = req.body;

    if(!expense || expense <= 0) {
        return failedMessage(res, "Expense must have a value more than zero!");
    }

    try {
        const reduceBalance = await sql`
            UPDATE 
                finance
            SET 
                balance = (balance - ${expense})
            WHERE
                user_id = ${user_id}
            RETURNING
                *
        `

        if(reduceBalance.length === 0) {
            return failedMessage(res, "User not found!");
        }

        successMessage(res, reduceBalance);
    } catch (error) {
        serverErrorMessage(res);
    }
}

export const updateBalance = async (req: Request, res: Response) => {
    const { user_id } = req.params;
    const { current_balance } = req.body;

    if(!current_balance || current_balance <= 0) {
        return failedMessage(res, "Current Balance must have a value more than zero!");
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
            return failedMessage(res, "User not found!");
        }

        successMessage(res, updateBalance);
    } catch (error) {
        serverErrorMessage(res);        
    }
}