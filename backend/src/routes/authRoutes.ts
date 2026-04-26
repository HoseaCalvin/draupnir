import express from "express";
import { authMe, login, logout, resetPassword } from "../controllers/authController";
import { authenticationToken } from "../middleware/auth.middleware";

const authRouter = express.Router();

authRouter.get("/me", authenticationToken, authMe);
authRouter.post("/login", login);
authRouter.post("/logout", authenticationToken, logout);
authRouter.patch("/reset", resetPassword);

export default authRouter;