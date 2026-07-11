import express, { Router } from "express";
import { deleteMonthlyIncome, getMonthlyIncome, getTotalAmountOfMonthlyIncome, insertMonthlyIncome } from "../controllers/monthlyIncomeController";

const monthlyIncomeRouter: Router = express.Router();

monthlyIncomeRouter.post("/insert", insertMonthlyIncome);
monthlyIncomeRouter.get("/get/:user_id", getMonthlyIncome);
monthlyIncomeRouter.get("/total/get/:user_id", getTotalAmountOfMonthlyIncome);
monthlyIncomeRouter.delete("/delete", deleteMonthlyIncome);

export default monthlyIncomeRouter;