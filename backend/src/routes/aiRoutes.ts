import express from "express";
import { generateAnalysis, getAnalysis, getSummary } from "../controllers/aiController";

const aiRouter = express.Router();

aiRouter.post("/generate", generateAnalysis);
aiRouter.get("/get/detailed/:user_id", getAnalysis);
aiRouter.get("/get/summary/:user_id", getSummary);

export default aiRouter;