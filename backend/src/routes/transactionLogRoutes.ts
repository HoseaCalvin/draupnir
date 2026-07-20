import express, { Router } from "express";
import { getTransactionLog, getAllTransactionLog } from "../controllers/transactionLogController";

const transactionLogRouter: Router = express.Router();

transactionLogRouter.get("/all/get/:user_id", getAllTransactionLog);
transactionLogRouter.get("/get/:user_id", getTransactionLog);

export default transactionLogRouter;