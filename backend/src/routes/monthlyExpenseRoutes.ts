import express, { Router } from "express";
import { deleteMonthlyExpense, getMonthlyExpense, insertMonthlyExpense } from "../controllers/monthlyExpenseController";

const monthlyExpenseRouter: Router = express.Router();

monthlyExpenseRouter.post("/insert", insertMonthlyExpense);
monthlyExpenseRouter.get("/get/:user_id", getMonthlyExpense);
monthlyExpenseRouter.delete("/delete", deleteMonthlyExpense);

export default monthlyExpenseRouter;