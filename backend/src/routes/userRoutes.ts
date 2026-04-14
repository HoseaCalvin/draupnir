import express, { Router } from "express";
import { login, register, updateUser, deleteUser, verifyUser } from "../controllers/userController";
import { authenticationToken } from "../middleware/auth.middleware";

const userRouter: Router = express.Router();

userRouter.post("/login", login);
userRouter.post("/verify", verifyUser);
userRouter.post("/register", register);
userRouter.patch("/update/:id", updateUser);
userRouter.delete("/delete/:id", deleteUser);

export default userRouter;