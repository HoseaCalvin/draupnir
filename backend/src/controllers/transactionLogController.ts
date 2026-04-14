import { Request, Response } from "express";

import { sql } from "../configs/database";
import { failedMessage, notFoundMesage, serverErrorMessage, successMessage } from "../misc/messages";

export const insertTransactionLog = async (req: Request, res: Response) => {
    const { user_id, recorded_date, transaction_name, amount, category_id } = req.body;

    if(!user_id || !recorded_date || !transaction_name) {
        return failedMessage(res, "All fields are required!");
    }

    try {
        const insertLog = await sql`
            INSERT INTO transaction_log (user_id, recorded_date, transaction_name, amount, category_id)
                VALUES (${user_id}, ${recorded_date}, ${transaction_name}, ${amount}, ${category_id})
            RETURNING 
                *
        `

        successMessage(res, insertLog);
    } catch (error) {
        serverErrorMessage(res);
    }
}

export const getAllTransactionLog = async (req: Request, res: Response) => {
    const { user_id } = req.params;
    const { range } = req.query;

    if(!user_id) {
        return failedMessage(res, "user_id is missing!");
    }

    try {
        let lowerBoundDate: Date | null = null;
        let upperBoundDate: Date | null = null;

        switch (range) {
            case "this_month":
                lowerBoundDate = new Date();
                lowerBoundDate.setDate(1);
                lowerBoundDate.setHours(0, 0, 0, 0);

                upperBoundDate = new Date();
                upperBoundDate.setMonth(upperBoundDate.getMonth() + 1);
                upperBoundDate.setDate(1);
                upperBoundDate.setHours(0, 0, 0, 0);
                break;
            case "last_month":
                lowerBoundDate = new Date();
                lowerBoundDate.setMonth((new Date(Date.now()).getMonth() + 11) % 12);
                lowerBoundDate.setDate(1);
                lowerBoundDate.setHours(0, 0, 0, 0);

                upperBoundDate = new Date();
                upperBoundDate.setMonth(upperBoundDate.getMonth());
                upperBoundDate.setDate(1);
                upperBoundDate.setHours(0, 0, 0, 0);
                break;
            case "last_year":
                lowerBoundDate = new Date();
                lowerBoundDate.setFullYear(lowerBoundDate.getFullYear() - 1);
                lowerBoundDate.setMonth(1);
                lowerBoundDate.setDate(1);
                lowerBoundDate.setHours(0, 0, 0, 0);

                upperBoundDate = new Date();
                upperBoundDate.setFullYear(upperBoundDate.getFullYear());
                break;
            case "all":
                lowerBoundDate = new Date(0);
                upperBoundDate = new Date();
                break;                
        }

        const getLog = await sql`
            SELECT
                recorded_date, 
                transaction_name, 
                CASE type
                    WHEN 'DEPOSIT_INSERT' THEN 'Insert (' || category || ')'
                    ELSE category
                END AS category, 
                amount
            FROM 
                transaction_log tl
                LEFT JOIN transaction_category tc ON tl.category_id = tc.id
            WHERE
                user_id = ${user_id} AND 
                recorded_date >= ${lowerBoundDate} AND recorded_date <= ${upperBoundDate}
            ORDER BY 
                recorded_date DESC, transaction_name
        `;
            
        if(!getLog) {
            return notFoundMesage(res, "Couldn't find user's transaction logs!");
        }
        
        successMessage(res, getLog);
    } catch (error) {
        serverErrorMessage(res);
    }
}

export const getTransactionLog = async (req: Request, res: Response) => {
    const { user_id } = req.params;

    if(!user_id) {
        return failedMessage(res, "user_id is missing!");
    }

    try {
        const getLog = await sql`
            SELECT
                recorded_date,
                transaction_name,
                amount
            FROM
                transaction_log
            WHERE
                user_id = ${user_id} AND
                recorded_date = CURRENT_DATE
        `

        if(!getLog) {
           return notFoundMesage(res, "Couldn't find user's transaction logs!");
        }
        
        successMessage(res, getLog);
    } catch (error) {
        serverErrorMessage(res);
        console.error("Error in fetching transaction log data", error);
    }
}