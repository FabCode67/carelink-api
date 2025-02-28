import express, { Router } from "express";
import { SignInHandler } from "../controllers/auth.js";

const authRouter: Router = express.Router();

authRouter.post("/", SignInHandler);


export default authRouter;
