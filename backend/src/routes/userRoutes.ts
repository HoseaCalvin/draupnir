import express, { Router } from "express";
import { register, updateUserBiodata, deleteUser, verifyUser, updateUserEmail, updateUserPassword } from "../controllers/userController";

const userRouter: Router = express.Router();

userRouter.post("/verify", verifyUser);
userRouter.post("/register", register);
userRouter.patch("/update/biodata/:id", updateUserBiodata);
userRouter.patch("/update/email/:id", updateUserEmail);
userRouter.patch("/update/password/:id", updateUserPassword);
userRouter.delete("/delete/:id", deleteUser);

export default userRouter;