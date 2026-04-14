import express, { Router } from "express";
import { insertTransactionLog, getTransactionLog, getAllTransactionLog } from "../controllers/transactionLogController";

const transactionLogRouter: Router = express.Router();

transactionLogRouter.post("/insert", insertTransactionLog);
transactionLogRouter.get("/get/all/:user_id", getAllTransactionLog);
transactionLogRouter.get("/get/:user_id", getTransactionLog);

export default transactionLogRouter;