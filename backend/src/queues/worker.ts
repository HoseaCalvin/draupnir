import { Worker } from "bullmq";
import { connection } from "../configs/redis";
import { recordMonthlyFinancialReport, runMonthlyIncome, runMonthlyExpense } from "./jobs";

new Worker("scheduled-jobs", async job => {
    switch (job.name) {
        case "monthly-financial-report":
            return recordMonthlyFinancialReport();
            
        case "monthly-income":
            return runMonthlyIncome();

        case "monthly-expense":
            return runMonthlyExpense();
    }
}, { connection });

console.log("Worker started successfully!");