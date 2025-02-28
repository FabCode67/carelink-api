import cors from "cors";
import express, { Express, Request, Response } from "express";
import cookieParser from "cookie-parser";
import userRouter from "./routes/user";
import authRouter from "./routes/auth";

const app: Express = express();
const PORT = 3000;
app.use(cors({
    origin: '*',
    allowedHeaders: "*"
}))
app.use(cookieParser());
app.use(express.json());
app.use("/api/v1/user", userRouter);
app.use("/api/v1/auth", authRouter);
app.get("/", async(req: Request, res: Response):Promise<any> => {
    console.log(req.url)
    return res.json({
        status: 200,
        message: "Welcome to the API"
    })
})
app.listen(PORT, () => {
    console.log(`Server running on http://localhost:${PORT}`);
});