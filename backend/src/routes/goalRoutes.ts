import express, { Router } from "express";
import { insertGoal, getGoalByUserId, updateGoal, deleteGoal, getGoalById } from "../controllers/goalController";

const goalRouter: Router = express.Router();

goalRouter.post("/insert", insertGoal);
goalRouter.get("/get/:id", getGoalById);
goalRouter.get("/get/user/:user_id", getGoalByUserId);
goalRouter.patch("/update", updateGoal);
goalRouter.delete("/delete/:id", deleteGoal);

export default goalRouter;