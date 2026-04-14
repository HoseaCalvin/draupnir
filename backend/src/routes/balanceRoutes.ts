import express, { Router } from "express";
import { getBalance, reduceBalance, updateBalance } from "../controllers/balanceController";

const currentBalanceRouter: Router = express.Router();

currentBalanceRouter.get("/get/:user_id", getBalance);
currentBalanceRouter.patch("/update/reduce/:user_id", reduceBalance);
currentBalanceRouter.patch("/update/:user_id", updateBalance);

export default currentBalanceRouter;