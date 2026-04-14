import express, { Router } from "express";
import { getCategories } from "../controllers/transactionCategoryController";

const transactionCategoryRouter: Router = express.Router();

transactionCategoryRouter.get('/get', getCategories);

export default transactionCategoryRouter;