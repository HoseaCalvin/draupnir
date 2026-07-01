import express, { Router } from "express"
import { updateDeposit, getDepositByUserId, reduceDeposit, insertDepositList, getDepositList, deleteDepositList } from '../controllers/depositController'

const depositRouter: Router = express.Router();

depositRouter.get("/get/:user_id", getDepositByUserId);
depositRouter.patch("/update/:user_id", updateDeposit);
depositRouter.post("/list/insert", insertDepositList);
depositRouter.get("/list/get/:user_id", getDepositList);
depositRouter.delete("/list/delete/:user_id", deleteDepositList);


export default depositRouter;