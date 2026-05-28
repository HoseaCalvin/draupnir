import { GoogleGenerativeAI } from "@google/generative-ai";
import { Request, Response } from "express";
import { failedMessage, serverErrorMessage, successMessage } from "../misc/messages";
import { sql } from "../configs/database";

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY!);

const model = genAI.getGenerativeModel({ 
    model: 'gemini-2.5-flash',
    generationConfig: { responseMimeType: "application/json" }
})

export const generateAnalysis = async (req: Request, res: Response) => {
    const { user_id } = req.body;

    if(!user_id) {
        return failedMessage(res, "user_id is missing!");
    }

    try {
        const currentFinancial = await sql`
            SELECT
                balance,
                deposit,
                expense
            FROM
                finance
            WHERE
                user_id = ${user_id};
        `

        const pastFinancial = await sql`
            SELECT
                balance_history,
                deposit_history,
                expense_history
            FROM
                monthly_finance_history
            WHERE
                user_id = ${user_id}
                AND recorded_date >= date_trunc('month', CURRENT_DATE) - INTERVAL '1 month'
                AND recorded_date < date_trunc('month', CURRENT_DATE);
        `

        const currentLargestExpense = await sql`
            SELECT
                amount,
                category
            FROM
                transaction_log tl
                JOIN transaction_category tc ON tl.category_id = tc.id
            WHERE
                user_id = ${user_id} 
                AND transaction_name = 'Expense'
                AND recorded_date = CURRENT_DATE
            ORDER BY
                amount DESC
            LIMIT 1;
        `

        const pastLargestExpense = await sql`
            SELECT
                amount,
                category
            FROM
                transaction_log tl
                JOIN transaction_category tc ON tl.category_id = tc.id
            WHERE
                user_id = ${user_id} 
                AND transaction_name = 'Expense'
                AND recorded_date >= date_trunc('month', CURRENT_DATE) - INTERVAL '1 month'
                AND recorded_date < date_trunc('month', CURRENT_DATE)
            ORDER BY
                amount DESC
            LIMIT 1;
        `

        const aiData = {
            balance: Number(currentFinancial[0].balance),
            deposit: Number(currentFinancial[0].deposit),
            expense: Number(currentFinancial[0].expense),
            net: Number(currentFinancial[0].balance - currentFinancial[0].expense),
            largest_expense: {
                amount: Number(currentLargestExpense[0]?.amount),
                category: currentLargestExpense[0]?.category ?? 'None'
            },

            balance_history: Number(pastFinancial[0].balance_history),
            deposit_history: Number(pastFinancial[0].deposit_history),
            expense_history: Number(pastFinancial[0].expense_history),
            past_net: Number(pastFinancial[0].balance_history - pastFinancial[0].expense_history),
            past_largest_expense: {
                amount: Number(pastLargestExpense[0]?.amount),
                category: pastLargestExpense[0]?.category ?? 'None'
            }
        }

        const result = await model.generateContent(`
            You are a financial analyst.

            Write a concise monthly financial summary in text form.
            Do not invent numbers.
            Do not add strange symbols like ""\n"". Give 'Enter' properly.

            The currency used is Indonesian Rupiah (IDR). Hence, every amount must be preceded with Rp.

            Data:
            ${JSON.stringify(aiData)}
        `);

        const shortResult = await model.generateContent(`
            You are a financial analyst.

            Write a concise summary of the provided financial data in one sentence and not more than 30 words.
            The summary must be in text form!
            Do not invent numbers.

            The currency used is Indonesian Rupiah (IDR). Hence, every amount must be preceded with Rp.

            Data:
            ${JSON.stringify(aiData)}
        `);

        const detailedResponse = result.response.text();
        const summaryResponse = shortResult.response.text();

        if(detailedResponse && summaryResponse) {
            const insertContent = await sql`
                INSERT INTO monthly_ai_report (user_id, ai_summary, data, ai_detailed_text, report_period) VALUES
                (
                    ${user_id},
                    ${summaryResponse},
                    ${aiData},
                    ${detailedResponse},
                    date_trunc('month', CURRENT_DATE) - INTERVAL '1 month'
                )
            `
            
            if(!insertContent) {
                return failedMessage(res, "Failed to insert AI generation into table!");
            }

            successMessage(res, insertContent);
        }
    } catch (error) {
        serverErrorMessage(res);
        console.log("Error in generating AI analysis!", error)
    }
} 

export const getSummary = async (req: Request, res: Response) => {
    const { user_id } = req.params;

    if(!user_id) {
        return failedMessage(res, "user_id is missing!");
    }

    try {
        const fetchSummary = await sql`
            SELECT
                ai_summary,
                report_period
            FROM
                monthly_ai_report
            WHERE
                user_id = ${user_id} 
                AND EXTRACT(MONTH FROM recorded_date) = EXTRACT(MONTH FROM CURRENT_DATE)
            `
        
        successMessage(res, fetchSummary);
    } catch (error) {
        serverErrorMessage(res);
    }
}

export const getAnalysis = async (req: Request, res: Response) => {
    const { user_id } = req.params;

    if(!user_id) {
        return failedMessage(res, "user_id is missing!");
    }

    try {
        const fetchContent = await sql`
            SELECT
                ai_detailed_text
            FROM
                monthly_ai_report
            WHERE
                user_id = ${user_id} 
                AND EXTRACT(MONTH FROM recorded_date) = EXTRACT(MONTH FROM CURRENT_DATE)
        `

        successMessage(res, fetchContent);
    } catch (error) {
        serverErrorMessage(res);        
    }
}

export const chat = async (req: Request, res: Response) => {
    const { prompt } = req.body;

    if(!prompt) {
        return failedMessage(res, "Prompt must not be empty!");
    }

    
}

// Save the response in a table to prevent constant generation every time user starts the app.
// Fetch the response after creation.
// If a new month starts, prompt the AI to generate anothe response.

// The table should save ID, date, and response text.