import express, { Router } from "express";
import { insertFinance, deleteFinance, updateFinanceDate, getFinance, getFinanceDate } from "../controllers/financeController";

const financeRouter: Router = express.Router();

financeRouter.post("/insert/:user_id", insertFinance);
financeRouter.get("/get/:user_id", getFinance);
financeRouter.get("/get/date/:user_id", getFinanceDate);
financeRouter.patch("/update/:user_id", updateFinanceDate);
financeRouter.delete("/delete", deleteFinance);

export default financeRouter;