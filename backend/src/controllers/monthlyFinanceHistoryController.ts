import { Request, Response } from "express";

import { sql } from "../configs/database";
import { failedMessage, notFoundMesage, serverErrorMessage, successMessage } from "../misc/messages";

export const insertHistory = async (user_id: string) => {
    if(!user_id) {
        console.log("User ID is missing!");
        return;
    }

    try {
        const insert = await sql`
            INSERT INTO monthly_finance_history
                SELECT
                  gen_random_uuid(),
                  user_id,
                  balance,
                  deposit,
                  expense,
                  recorded_date             
                FROM
                    finance
                WHERE
                    user_id = ${user_id} 
                    AND recorded_date >= date_trunc('month', CURRENT_DATE) - INTERVAL '1 month'
                    AND recorded_date < date_trunc('month', CURRENT_DATE)
            RETURNING
                *
        `

        if(insert.length === 0) {
            console.log("User not found!");
            return;
        }

    } catch (error) {
        console.error("There was an error while inserting your financial report!", error);
    }
}

export const getHistory = async (req: Request, res: Response) => {
    const { user_id } = req.params;

    if(!user_id) {
        return notFoundMesage(res, "User ID is missing!");
    }    

    try {
        const getHistory = await sql`
            SELECT
                *
            FROM
                monthly_finance_history
            WHERE
                user_id = ${user_id}
            ORDER BY
                recorded_date
        `

        successMessage(res, getHistory);
    } catch (error) {
        serverErrorMessage(res);
    }
}