"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.userRegisterHandler = void 0;
const client_1 = __importDefault(require("../../prisma/client"));
const cloudinary_1 = require("cloudinary");
const bcrypt_1 = __importDefault(require("bcrypt"));
const user_1 = __importDefault(require("../validations/user"));
cloudinary_1.v2.config({
    cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
    api_key: process.env.CLOUDINARY_API_KEY,
    api_secret: process.env.CLOUDINARY_API_SECRET,
});
const userRegisterHandler = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const body = req.body;
        if (!req.file) {
            return res.status(400).json({
                status: 400,
                message: "No certifcate selected",
            });
        }
        const validation = user_1.default.safeParse(body);
        if (!validation.success)
            return res.json({
                status: 400,
                message: validation.error.errors[0].path +
                    " " +
                    validation.error.errors[0].message,
            });
        const cloudinaryUpload = yield cloudinary_1.v2.uploader.upload(req.file.path, {
            folder: "certificates",
            resource_type: "auto",
        });
        const hashedPassword = yield bcrypt_1.default.hash(body.password, 10);
        const camp = yield client_1.default.user.create({
            data: {
                certifcate: cloudinaryUpload.secure_url || "",
                firstname: body.firstname,
                lastname: body.lastname,
                phone: body.phone,
                role: body.role,
                approved: body.approved,
                district: body.district,
                sector: body.sector,
                password: hashedPassword,
            },
        });
        if (camp) {
            return res.json({
                status: 200,
                message: "Registration success",
                data: {
                    certificateUrl: cloudinaryUpload.secure_url,
                },
            });
        }
        else {
            return res.json({
                status: 400,
                message: "Registration failed",
            });
        }
    }
    catch (err) {
        console.error(err);
        return res.status(500).json({
            status: 500,
            message: "Error occured while uploading certificate",
            error: err instanceof Error ? err.message : "Unknown error",
        });
    }
});
exports.userRegisterHandler = userRegisterHandler;
