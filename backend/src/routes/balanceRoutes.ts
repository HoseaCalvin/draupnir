import express, { Router } from "express";
import { getBalance, updateBalance } from "../controllers/balanceController";

const currentBalanceRouter: Router = express.Router();

currentBalanceRouter.get("/get/:user_id", getBalance);
currentBalanceRouter.patch("/update/:user_id", updateBalance);

export default currentBalanceRouter;