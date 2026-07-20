import express from "express";
import authRouter from "./modules/auth/auth.routes";
import { authenticate } from "./shared/middlewares/authMiddleware";
import householdRouter from "./modules/household/household.routes";

const app = express();

app.use(express.json());

app.use("/auth", authRouter);
app.use("/household", authenticate, householdRouter);

export default app;
