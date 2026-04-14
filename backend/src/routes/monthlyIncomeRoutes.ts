import express, { Router } from "express";
import { deleteMonthlyIncome, getMonthlyIncome, insertMonthlyIncome } from "../controllers/monthlyIncomeController";

const monthlyIncomeRouter: Router = express.Router();

monthlyIncomeRouter.post("/insert", insertMonthlyIncome);
monthlyIncomeRouter.get("/get/:user_id", getMonthlyIncome);
monthlyIncomeRouter.delete("/delete", deleteMonthlyIncome);

export default monthlyIncomeRouter;