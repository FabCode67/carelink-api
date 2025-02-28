import cors from "cors"
import express, { Express } from "express";
import cookieParser from "cookie-parser";
import userRouter from "./routes/user";

const app: Express = express();
const PORT = 3000;
app.use(cookieParser())
app.use(express.json());
app.use("/api/v1/user",userRouter)
app.listen(PORT, () => console.log(`Listing to port...${PORT}`));
