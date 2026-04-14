import { getAllUsers } from "../controllers/userController";
import { insertHistory } from "../controllers/monthlyFinanceHistoryController";
import { addIncomeToBalance } from "../controllers/monthlyIncomeController";
import { reduceBalance } from "../controllers/monthlyExpenseController";

export const recordMonthlyFinancialReport = async () => {
    const users = await getAllUsers();

    for(const user of users) {
        await insertHistory(user?.id);
    }    
}

export const runMonthlyIncome = async () => {
    const users = await getAllUsers();

    for(const user of users) {
        await addIncomeToBalance(user?.id);
    }
}

export const runMonthlyExpense = async () => {
    const users = await getAllUsers();
    
    for(const user of users) {
        await reduceBalance(user?.id);
    }
}