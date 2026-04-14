import { taskQueue } from "./queue";

export async function scheduleJob() {
    await taskQueue.add("monthly-financial-report", {}, {
        jobId: "monthly-financial-report",
        repeat: { pattern: "0 0 28 * *"}
    });

    await taskQueue.add("monthly-income", {}, {
        jobId: "monthly-income",
        repeat: { pattern: "0 0 28 * *"}
    });

    await taskQueue.add("monthly-expense", {}, {
        jobId: "monthly-expense",
        repeat: { pattern: "0 0 1 * *"}
    });
}

scheduleJob();

console.log("Scheduler started successfully!");