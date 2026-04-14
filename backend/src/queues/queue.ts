import { Queue } from "bullmq";
import { connection } from "../configs/redis";

export const taskQueue = new Queue("scheduled-jobs", {
    connection
});

