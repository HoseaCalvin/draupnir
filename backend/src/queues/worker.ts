import { Worker } from "bullmq";
import { connection } from "../configs/redis";
import { recordMonthlyFinancialReport, runMonthlyIncome, runMonthlyExpense } from "./jobs";

new Worker("tasks", async job => {
    switch (job.name) {
        case "monthly-financial-report":
            return recordMonthlyFinancialReport();
            
        case "monthly-income":
            return runMonthlyIncome();

        case "monthly-expense":
            return runMonthlyExpense();
    }
}, { 
    connection, 
    concurrency: 10 
});

console.log("Worker started successfully!");