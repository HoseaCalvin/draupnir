import express from "express";
import dotenv from "dotenv";
import cors from "cors";
import morgan from "morgan";
// import helmet from "helmet";
import path from "path";
import cookieParser from "cookie-parser";

import userRouter from "./routes/userRoutes";
import currentBalanceRouter from "./routes/balanceRoutes";
import depositRouter from "./routes/depositRoutes";
import expenseRouter from "./routes/expenseRoutes";
import goalRouter from "./routes/goalRoutes";
import authRouter from "./routes/authRoutes";
import transactionLogRouter from "./routes/transactionLogRoutes";
import financeRouter from "./routes/financeRoutes";
import monthlyFinanceHistoryRouter from "./routes/monthlyFinanceHistoryRoutes";
import transactionCategoryRouter from "./routes/transactionCategoryRoutes";
import monthlyIncomeRouter from "./routes/monthlyIncomeRoutes";
import monthlyExpenseRouter from "./routes/monthlyExpenseRoutes";
import aiRouter from "./routes/aiRoutes";

dotenv.config({ path: path.resolve(__dirname, "../.env") });

const app = express();

app.use(cookieParser());
app.use(cors({
    origin: "http://localhost:3000",
    credentials: true,              
  }));
app.use(morgan("dev"));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
// app.use(helmet());

app.use("/api/users", userRouter);
app.use("/api/finance", financeRouter);
app.use("/api/currentBalance", currentBalanceRouter);
app.use("/api/deposit", depositRouter);
app.use("/api/expense", expenseRouter);
app.use("/api/goals", goalRouter);
app.use("/api/transactionLog", transactionLogRouter);
app.use("/api/transactionCategory", transactionCategoryRouter);
app.use("/api/financeHistory", monthlyFinanceHistoryRouter);
app.use("/api/monthlyIncome", monthlyIncomeRouter);
app.use("/api/monthlyExpense", monthlyExpenseRouter)
app.use("/api/ai", aiRouter);
app.use("/api/auth", authRouter);

const port = process.env.PORT || 5002;

app.listen(port, () => {
  console.log("Server started at " + port + "!");
});
