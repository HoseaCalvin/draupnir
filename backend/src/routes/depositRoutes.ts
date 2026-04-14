import express, { Router } from "express"
import { updateDeposit, getDepositByUserId, reduceDeposit, insertDepositList, getDepositList, deleteDepositList } from '../controllers/depositController'

const depositRouter: Router = express.Router();

depositRouter.get("/get/:user_id", getDepositByUserId);
depositRouter.patch("/update/:user_id", updateDeposit);
depositRouter.patch("/update/reduce/:user_id", reduceDeposit);
depositRouter.post("/insert/list", insertDepositList);
depositRouter.get("/get/list/:user_id", getDepositList);
depositRouter.delete("/delete/list/:user_id", deleteDepositList);

export default depositRouter;