import { Queue } from "bullmq";
import { connection } from "../configs/redis";

export const taskQueue = new Queue("tasks", {
    connection
});

