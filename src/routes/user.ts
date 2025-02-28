
import express from "express";
import multer from "multer";
import { userRegisterHandler } from "../controllers/user";
import { storage } from "../utils/multerStorage";
const upload = multer({ storage: storage });
const userRouter = express.Router();
userRouter.post("/", upload.single("file"), userRegisterHandler);


export default userRouter;
