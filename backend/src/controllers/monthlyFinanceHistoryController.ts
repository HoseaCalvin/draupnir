import { Request, Response } from "express";

import { sql } from "../configs/database";
import { notFoundMesage, serverErrorMessage, successMessage } from "../misc/messages";

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
                AND EXTRACT(YEAR FROM recorded_date) = EXTRACT(YEAR FROM CURRENT_DATE)
            ORDER BY
                recorded_date
        `

        successMessage(res, getHistory);
    } catch (error) {
        serverErrorMessage(res);
    }
}

export const insertHistory = async (user_id: string) => {
    if(!user_id) {
        console.log("User ID is missing!");
        return;
    }

    let insert: Record<string, any>[] = [];
    try {
        insert = await sql`
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
            RETURNING
                *
        `

        if(insert.length === 0) {
            console.log("User not found or query returned no results!");
            return [];
        }

        return insert;
    } catch (error) {
        console.error("There was an error while inserting your financial report!", error);
        return [];
    }
}