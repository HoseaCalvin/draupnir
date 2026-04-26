import { Request, Response } from "express";

import { sql } from "../configs/database";
import { serverErrorMessage, failedMessage, successMessage, notFoundMesage } from "../misc/messages";

export const getDepositByUserId = async (req: Request, res: Response) => {
    const { user_id } = req.params;

    if(!user_id) {
        return failedMessage(res, "User ID is missing!");
    }

    try {
        const getDepositByUserId = await sql`
            SELECT
                *
            FROM
                finance
            WHERE
                user_id = ${user_id}
        `

        successMessage(res, getDepositByUserId[0]);
    } catch (error) {
        serverErrorMessage(res);
    }
}

export const reduceDeposit = async (req: Request, res: Response) => {
    const { user_id } = req.params;
    const { deposit } = req.body;

    if(!deposit || deposit <= 0) {
        return failedMessage(res, "Deposit must have a value more than zero!");
    }

    if(!user_id) {
        return failedMessage(res, "User ID is missing!");
    }

    try {
        const reduceDeposit = await sql`
            UPDATE finance
            SET
                deposit = (deposit - ${deposit})
            WHERE
                user_id = ${user_id}
            RETURNING
                *
        `

        if(reduceDeposit.length === 0) {
            return notFoundMesage(res, "User not found!");
        }

        successMessage(res, reduceDeposit);
    } catch (error) {
        serverErrorMessage(res);        
    }
}

export const updateDeposit = async (req: Request, res: Response) => {
    const { user_id } = req.params;
    const { deposit } = req.body;

    if(!deposit || deposit <= 0) {
        return failedMessage(res, "Deposit must have a value more than zero!");
    }

    if(!user_id) {
        return failedMessage(res, "User ID is missing!");
    }

    try {
        const updateDeposit = await sql`
            UPDATE 
                finance
            SET 
                deposit = (deposit + ${deposit})
            WHERE
                user_id = ${user_id}
            RETURNING
                *
        `

        if(updateDeposit.length === 0) {
            return notFoundMesage(res, "User not found!");
        }

        successMessage(res, updateDeposit);
    } catch (error) {
        serverErrorMessage(res);
    }
}

export const insertDepositList = async (req: Request, res: Response) => {
    const { user_id, bank_name, deposit_category, interest, amount, deadline } = req.body;

    if(!user_id || !bank_name || !deposit_category || !interest || !amount || !deadline) {
        return failedMessage(res, "All fields are required");
    }

    if(interest <= 0) {
        return failedMessage(res, "Interest must have a value more than zero!");
    }

    if(amount <= 0) {
        return failedMessage(res, "Amount must have a value more than zero!");
    }

    try {
        const insertDeposit = await sql`
            INSERT INTO deposit_list (user_id, bank_name, deposit_category, interest, amount, deadline)
                VALUES (${user_id}, ${bank_name}, ${deposit_category}, ${interest}, ${amount}, ${deadline})
            RETURNING
                *
        `

        if(insertDeposit.length === 0) {
            return failedMessage(res, "Failed to insert a deposit");
        }

        successMessage(res, insertDeposit[0]);
    } catch (error) {
        serverErrorMessage(res);
    }
}

export const getDepositList = async (req: Request, res: Response) => {
    const { user_id } = req.params;

    if(!user_id) {
        return failedMessage(res, "User ID is missing!");
    }

    try {
        const getDeposit = await sql`
            SELECT
                dl.id,
                bank_name,
                category,
                interest,
                amount,
                deadline
            FROM
                deposit_list dl
                JOIN transaction_category tc ON dl.deposit_category = tc.id
            WHERE
                user_id = ${user_id}
        `

        successMessage(res, getDeposit);
    } catch (error) {
        serverErrorMessage(res);
    }
}

export const deleteDepositList = async (req: Request, res: Response) => {
    const { user_id } = req.params;
    const { deposit_id } = req.body;

    if(!deposit_id || !user_id) {
        return failedMessage(res, "All fields are required!");
    }

    try {
        const deleteDeposit = await sql`
            DELETE FROM 
                deposit_list
            WHERE
                id = ${deposit_id} 
                AND user_id = ${user_id}
            RETURNING
                *
        `

        if(deleteDeposit.length === 0) {
            return failedMessage(res, "User or Deposit not found!");
        }

        successMessage(res, deleteDeposit);
    } catch (error) {
        serverErrorMessage(res);
    }
}