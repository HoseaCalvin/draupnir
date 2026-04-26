import { Request, Response } from "express";
import { sql } from "../configs/database";
import { failedMessage, serverErrorMessage, successMessage } from "../misc/messages";

export const getCategories = async (req: Request, res: Response) => {
    try {
        const getCategories = await sql`
            SELECT
                id,
                category,
                type
            FROM
                transaction_category
        `

        if(getCategories.length === 0) {
            return failedMessage(res, "No data is available in Category table!");
        }

        successMessage(res, getCategories);
    } catch (error) {
        serverErrorMessage(res);
    }
}