import express from "express";
import { authMe, logout } from "../controllers/authController";
import { authenticationToken } from "../middleware/auth.middleware";

const authRouter = express.Router();

authRouter.get("/me", authenticationToken, authMe);
authRouter.post("/logout", authenticationToken, logout);

export default authRouter;