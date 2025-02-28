import cors from "cors";
import express, { Express } from "express";
import cookieParser from "cookie-parser";
import userRouter from "./routes/user";
import authRouter from "./routes/auth";

const app: Express = express();
const PORT = 3000;
app.use(cookieParser());
app.use(express.json());
app.use("/api/v1/user", userRouter);
app.use("/api/v1/auth", authRouter);
app.listen(PORT, () => console.log(`Listing to port...${PORT}`));
