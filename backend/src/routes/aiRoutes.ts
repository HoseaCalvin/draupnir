import express from "express";
import { generateAnalysis, getAnalysis, getSummary } from "../controllers/aiController";

const aiRouter = express.Router();

aiRouter.post("/analysis/generate", generateAnalysis);
aiRouter.get("/analysis/get/:user_id", getAnalysis);
aiRouter.get("/summary/get/:user_id", getSummary);

export default aiRouter;