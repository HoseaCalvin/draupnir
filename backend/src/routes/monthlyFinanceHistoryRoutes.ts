import express, { Router } from "express";
import { getHistory, insertHistory } from "../controllers/monthlyFinanceHistoryController";

const monthlyFinanceHistoryRouter: Router = express.Router();

monthlyFinanceHistoryRouter.get("/get/:user_id", getHistory);

export default monthlyFinanceHistoryRouter;