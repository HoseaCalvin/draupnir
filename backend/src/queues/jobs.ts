import { sql } from "../configs/database";
import { getAllUsers } from "../controllers/userController";
import { insertHistory } from "../controllers/monthlyFinanceHistoryController";
import { addIncomeToBalance } from "../controllers/monthlyIncomeController";
import { reduceBalance, resetExpense } from "../controllers/monthlyExpenseController";

export const recordMonthlyFinancialReport = async () => { 
    const users = await getAllUsers();

    for(const user of users) {
        if(await isAlreadyProcessed(user.id, 'financial_report') === false) {
            return;
        }

        await insertHistory(user.id); 

        try {
            await sql`
                INSERT INTO monthly_processing (user_id, name, month, year) VALUES
                    (${user.id}, 'financial_report', EXTRACT(MONTH FROM CURRENT_DATE) + 1, EXTRACT(YEAR FROM CURRENT_DATE))
                    ON CONFLICT (user_id, name)
                    DO UPDATE
                    SET
                        month = EXCLUDED.month,
                        year = EXCLUDED.year
            `        
        } catch (error) {
            console.error("Error occurred while recording monthly financial report!", error);
        }
    }
}

export const runMonthlyIncome = async () => {
    const users = await getAllUsers();

    for(const user of users) {
        if(await isAlreadyProcessed(user.id, 'monthly_income') === false) {
            return;
        }

        await addIncomeToBalance(user.id);

        try {
            await sql`
                INSERT INTO monthly_processing (user_id, name, month, year) VALUES
                    (${user.id}, 'monthly_income', EXTRACT(MONTH FROM CURRENT_DATE) + 1, EXTRACT(YEAR FROM CURRENT_DATE))
                    ON CONFLICT (user_id, name)
                    DO UPDATE
                    SET
                        month = EXCLUDED.month,
                        year = EXCLUDED.year
            `        
        } catch (error) {
            console.error("Error occurred while running monthly income!", error);
        }
    }
}

export const runMonthlyExpense = async () => {
    const users = await getAllUsers();

    for(const user of users) {
        if(await isAlreadyProcessed(user.id, 'monthly_expense') === false) {
            return;
        }

        await resetExpense();
        await reduceBalance(user.id);

        try {
            await sql`
                INSERT INTO monthly_processing (user_id, name, month, year) VALUES
                    (${user.id}, 'monthly_expense', EXTRACT(MONTH FROM CURRENT_DATE) + 1, EXTRACT(YEAR FROM CURRENT_DATE))
                    ON CONFLICT (user_id, name)
                    DO UPDATE
                    SET
                        month = EXCLUDED.month,
                        year = EXCLUDED.year
            `            
        } catch (error) {
            console.error("Error occurred while running monthly expense!", error);
        }

    }
}

const isAlreadyProcessed = async (userId: string, name: string) => {
    const state = await sql`
        SELECT 1
        FROM monthly_processing
        WHERE
            user_id = ${userId}
            AND name = ${name}
            AND month = EXTRACT(MONTH FROM CURRENT_DATE)
            AND year = EXTRACT(YEAR FROM CURRENT_DATE)
    `;

    return state.length > 0;
}