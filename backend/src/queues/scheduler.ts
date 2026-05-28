import { taskQueue } from "./queue";

export async function scheduleJob() {
    await taskQueue.add("monthly-financial-report", {
        repeat: { pattern: "0 0 1 * *"}
    });

    await taskQueue.add("monthly-income", {}, {
        repeat: { pattern: "0 0 28 * *"}
    });

    await taskQueue.add("monthly-expense", {}, {
        repeat: { pattern: "1 0 1 * *" }
    });
}

scheduleJob();

console.log("Scheduler started successfully!");