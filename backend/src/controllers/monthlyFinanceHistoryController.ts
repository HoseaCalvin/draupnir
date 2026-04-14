import { Request, Response } from "express";

import { sql } from "../configs/database";
import { failedMessage, notFoundMesage, serverErrorMessage, successMessage } from "../misc/messages";

export const insertHistory = async (user_id: string) => {
    if(!user_id) {
        console.log("user_id is null!");
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
                    user_id = ${user_id} AND 
                    AND recorded_date >= date_trunc('month', CURRENT_DATE) - INTERVAL '1 month'
                    AND recorded_date < date_trunc('month', CURRENT_DATE)
        `

        if(!insert) {
            console.log("user_id not found!");
            return;
        }

    } catch (error) {
        console.error("There was an error in generating your financial report!");
    }
}

export const getHistory = async (req: Request, res: Response) => {
    const { user_id } = req.params;

    if(!user_id) {
        return notFoundMesage(res, "user_id must not be empty!");
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