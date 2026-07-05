import { sql } from "../configs/database";
import { getAllUsers } from "../controllers/userController";
import { insertHistory } from "../controllers/monthlyFinanceHistoryController";
import { insertIncomeToBalance } from "../controllers/monthlyIncomeController";
import { reduceBalance } from "../controllers/monthlyExpenseController";

const isAlreadyProcessed = async (userId: string, name: string, monthInterval: number) => {
    const state = await sql`
        SELECT 
            *
        FROM 
            monthly_processing
        WHERE 
            user_id = ${userId}
            AND name = ${name}
            AND last_month_processed = EXTRACT(MONTH FROM CURRENT_DATE - MAKE_INTERVAL(months => ${monthInterval}))
            AND last_year_processed = EXTRACT(YEAR FROM CURRENT_DATE - MAKE_INTERVAL(months => ${monthInterval}))
    `;

    return state.length > 0;
}

const markAsProcessed = async (userId: string, name: string, monthInterval: number) => {
    await sql`
        INSERT INTO monthly_processing (user_id, name, last_month_processed, last_year_processed)
        VALUES (${userId}, ${name}, EXTRACT(MONTH FROM CURRENT_DATE - MAKE_INTERVAL(months => ${monthInterval})), EXTRACT(YEAR FROM CURRENT_DATE - MAKE_INTERVAL(months => ${monthInterval})))
        ON CONFLICT (user_id, name)
        DO UPDATE 
            SET 
                last_month_processed = EXCLUDED.last_month_processed, 
                last_year_processed = EXCLUDED.last_year_processed
    `;
};

const isThisMonthProcessed = async (userId: string, name: string) => {
    return isAlreadyProcessed(userId, name, 0);
}

const isLastMonthProcessed = async (userId: string, name: string) => {
    return isAlreadyProcessed(userId, name, 1);
}

const markThisMonthAsProcessed = async (userId: string, name: string) => {
    markAsProcessed(userId, name, 0);
}

const markLastMonthAsProcessed = async (userId: string, name: string) => {
    markAsProcessed(userId, name, 1);
}

export const recordMonthlyFinancialReport = async () => { 
    const users = await getAllUsers();

    for(const user of users) {
        if(await isLastMonthProcessed(user.id, 'monthly-financial-report')) {
            continue;
        }

        try {
            await insertHistory(user.id); 
            await markLastMonthAsProcessed(user.id, 'monthly-financial-report');

            console.log(`Monthly financial report processed for user ${user.id}`);
        } catch (error) {
            console.error("Error occurred while recording monthly financial report!", error);
        }
    }
}

export const runMonthlyIncome = async () => {
    const users = await getAllUsers();

    for(const user of users) {
        if(await isThisMonthProcessed(user.id, 'monthly-income')) {
            continue;
        }

        try {
            await insertIncomeToBalance(user.id);
            await markThisMonthAsProcessed(user.id, 'monthly-income');

            console.log(`Monthly income processed for user ${user.id}`);
        } catch (error) {
            console.error("Error occurred while running monthly income!", error);
        }
    }
}

export const runMonthlyExpense = async () => {
    const users = await getAllUsers();

    for(const user of users) {
        if(await isThisMonthProcessed(user.id, 'monthly-expense')) {
            continue;
        }

        try {
            await reduceBalance(user.id);
            await markThisMonthAsProcessed(user.id, 'monthly-expense');

            console.log(`Monthly expense processed for user ${user.id}`);
        } catch (error) {
            console.error("Error occurred while running monthly expense!", error);
        }

    }
}