import { GoogleGenAI, Content } from '@google/genai';
import { Request, Response } from "express";
import { failedMessage, serverErrorMessage, successMessage } from "../misc/messages";
import { sql } from "../configs/database";

const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY });

export const generateAnalysis = async (req: Request, res: Response) => {
    const { user_id } = req.body;

    if(!user_id) {
        return failedMessage(res, "user_id is missing!");
    }

    let currentFinance:  Record<string, any>[] = [];
    let currentLargestExpense: Record<string, any>[] = [];
    let pastFinancial: Record<string, any>[] = [];
    let pastLargestExpense: Record<string, any>[] = [];

    try {
        currentFinance = await sql`
            SELECT
                balance,
                SUM(amount)::INTEGER AS deposit,
                expense
            FROM
                finance f
                JOIN deposit_list dl ON f.user_id = dl.user_id
            WHERE
                f.user_id = ${user_id}
            GROUP BY
                balance,
                expense;
        `
    } catch (error) {
        console.log("Error in fetching currentFinance!", error);
        return serverErrorMessage(res, error);
    }

    try {
        currentLargestExpense = await sql`
            SELECT
                amount,
                category
            FROM
                transaction_log tl
                JOIN transaction_category tc ON tl.category_id = tc.id
            WHERE
                user_id = ${user_id} 
                AND transaction_name = 'Expense'
                AND recorded_date >= date_trunc('month', CURRENT_DATE)
                AND recorded_date < date_trunc('month', CURRENT_DATE) + INTERVAL '1 month'
            ORDER BY
                amount DESC
            LIMIT 1;
        `
    } catch (error) {
        console.log("Error in fetching currentLargestExpense!", error);
        return serverErrorMessage(res, error);
    }

    try {
        pastFinancial = await sql`
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
    } catch (error) {
        console.log("Error in fetching pastFinancial!", error);
        return serverErrorMessage(res, error);
    }

    try {
        pastLargestExpense = await sql`
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
    } catch (error) {
        console.log("Error in fetching pastLargestExpense!", error);
        return serverErrorMessage(res, error);
    }

    const currentFinancialJSON = currentFinance.map((record: any) => ({
        balance: Number(record.balance || 0),
        deposit: Number(record.deposit || 0),
        expense: Number(record.expense || 0),
        largest_expense: {
            amount: Number(currentLargestExpense[0]?.amount || 0),
            category: currentLargestExpense[0]?.category ?? 'None'
        }
    }));

    const lastMonthFinacialJSON = pastFinancial.map((record: any) => ({
        balance: Number(record.balance_history || 0),
        deposit: Number(record.deposit_history || 0),
        expense: Number(record.expense_history || 0),
        largest_expense: {
            amount: Number(pastLargestExpense[0]?.amount || 0),
            category: pastLargestExpense[0]?.category ?? 'None'
        }
    }));
        
    try {
        const result = await ai.models.generateContent({
            model: 'gemini-2.5-flash',
            contents: `
                You are a senior financial analyst.

                Write a concise monthly financial summary in text form.
                Do not invent numbers. 
                Do tell the user about their current financial condition, how it compares to last month, and provide insights on how to improve their financial sustainability.
                Do tell their largest expense and give advice on how to reduce it if possible.

                The currency used is Indonesian Rupiah (IDR). Hence, every amount must be preceded with Rp.

                Requirements:
                - Use ## for section headings.
                - Use **bold** for important numbers and section titles.
                - Use bullet points instead of long paragraphs.
                - Use double new lines to separate paragraphs.
                - Separate paragraphs with blank lines.
                - Do not wrap the response in triple backticks.
                
                Data:
                Current Month Snapshot: ${JSON.stringify(currentFinancialJSON)}
                Last Month Snapshot: ${JSON.stringify(lastMonthFinacialJSON)}
            `
        });

        const detailedResponse = result.text;

        if(detailedResponse) {
            const insertContent = await sql`
                INSERT INTO monthly_ai_report (user_id, ai_summary, data, ai_detailed_text, report_period) VALUES
                (
                    ${user_id},
                    '',
                    ${JSON.stringify(currentFinancialJSON)},
                    ${detailedResponse},
                    date_trunc('month', CURRENT_DATE) - INTERVAL '1 month'
                )
            `
            
            if(!insertContent) {
                return failedMessage(res, "Failed to insert AI generation into table!");
            }
        }

        successMessage(res, detailedResponse);
    } catch (error) {
        console.log("Error in generating AI analysis!", error);
        return serverErrorMessage(res, error);
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