import express, { Router } from "express";
import { register, updateUserBiodata, deleteUser, verifyUser, updateUserPassword } from "../controllers/userController";

const userRouter: Router = express.Router();

userRouter.post("/verify", verifyUser);
userRouter.post("/register", register);
userRouter.patch("/biodata/update/:id", updateUserBiodata);
userRouter.patch("/password/update/:id", updateUserPassword);
userRouter.delete("/delete/:id", deleteUser);

export default userRouter;