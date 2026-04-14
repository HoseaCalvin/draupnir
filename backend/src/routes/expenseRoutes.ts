import express, { Router } from "express";
import { getExpense, updateExpense, deleteExpense } from "../controllers/expenseController"

const expenseRouter: Router = express.Router();

expenseRouter.get("/get/:user_id", getExpense);
expenseRouter.patch("/update/:user_id", updateExpense);
expenseRouter.delete("/delete/:user_id", deleteExpense);

export default expenseRouter;