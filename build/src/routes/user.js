"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const multer_1 = __importDefault(require("multer"));
const user_1 = require("../controllers/user");
const multerStorage_1 = require("../utils/multerStorage");
const upload = (0, multer_1.default)({ storage: multerStorage_1.storage });
const userRouter = express_1.default.Router();
userRouter.post("/", upload.single("file"), user_1.userRegisterHandler);
exports.default = userRouter;
