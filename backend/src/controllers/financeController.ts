import { Request, Response } from "express"
import { sql } from "../configs/database";
import { notFoundMesage, successMessage, failedMessage, serverErrorMessage } from "../misc/messages";

export const insertFinance = async (req: Request, res: Response) => {
    const { user_id } = req.params;
    
    if(!user_id) {
        return failedMessage(res, "user_id must not be empty!");
    }

    try {
        const insertFinance = await sql`
            INSERT INTO "finance" (user_id, balance, deposit, expense, recorded_date)
                VALUES (${user_id}, 0, 0, 0, CURRENT_DATE)
        `

        successMessage(res, insertFinance);
    } catch (error) {
        serverErrorMessage(res);
    }
}

export const getFinance = async (req: Request, res: Response) => {
    const { user_id } = req.params;

    if(!user_id) {
        return failedMessage(res, "user_id must not be empty!");
    }

    try {
        const getFinance = await sql`
            SELECT
                balance,
                deposit,
                expense
            FROM
                finance
            WHERE
                user_id = ${user_id}
        `

        if(getFinance.length === 0) {
            return notFoundMesage(res, "user_id not found!");
        }

        successMessage(res, getFinance);
    } catch (error) {
        serverErrorMessage(res);
    }
}

export const getFinanceDate = async (req: Request, res: Response) => {
    const { user_id } = req.params;

    if(!user_id) {
        return notFoundMesage(res, "user_id must not be empty!");
    }

    try {
        const getFinanceDate = await sql`
            SELECT
                recorded_date
            FROM
                finance
            WHERE
                user_id = ${user_id}
        `
        if(getFinanceDate.length === 0) {
            return notFoundMesage(res, "user_id not found!");
        }

        successMessage(res, getFinanceDate);
    } catch (error) {
        serverErrorMessage(res);
    }
}

export const updateFinanceDate = async (req: Request, res: Response) => {
    const { user_id } = req.params;
    
    if(!user_id) {
        return notFoundMesage(res, "user_id must not be empty!");
    }

    try {
        const updateDate = await sql`
            UPDATE finance
            SET
                recorded_date = CURRENT_DATE,
                expense = 0
            WHERE
                user_id = ${user_id}
        `

        successMessage(res, updateDate);
    } catch (error) {
        serverErrorMessage(res);
    }
}

export const deleteFinance = async (req: Request, res: Response) => {
    const { user_id } = req.params;

    if(!user_id) {
        return failedMessage(res, "user_id is missing!");
    }

    try {
        const deleteFinance = await sql`
            DELETE FROM finance
            WHERE
                user_id = ${user_id}
            RETURNING
                *
        `
        
        if(deleteFinance.length === 0) {
            return notFoundMesage(res, "user_id not found!");
        }

        successMessage(res, deleteFinance);
    } catch (error) {
        serverErrorMessage(res);
    }
}