import express, { Router } from "express";
import { deleteMonthlyExpense, getMonthlyExpense, getTotalAmountOfMonthlyExpense, insertMonthlyExpense } from "../controllers/monthlyExpenseController";

const monthlyExpenseRouter: Router = express.Router();

monthlyExpenseRouter.post("/insert", insertMonthlyExpense);
monthlyExpenseRouter.get("/get/:user_id", getMonthlyExpense);
monthlyExpenseRouter.get("/total/get/:user_id", getTotalAmountOfMonthlyExpense);
monthlyExpenseRouter.delete("/delete", deleteMonthlyExpense);

export default monthlyExpenseRouter;