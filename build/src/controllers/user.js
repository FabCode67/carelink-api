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
var __rest = (this && this.__rest) || function (s, e) {
    var t = {};
    for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p) && e.indexOf(p) < 0)
        t[p] = s[p];
    if (s != null && typeof Object.getOwnPropertySymbols === "function")
        for (var i = 0, p = Object.getOwnPropertySymbols(s); i < p.length; i++) {
            if (e.indexOf(p[i]) < 0 && Object.prototype.propertyIsEnumerable.call(s, p[i]))
                t[p[i]] = s[p[i]];
        }
    return t;
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.approveUserHandler = exports.userRegisterHandler = void 0;
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
    var _a;
    try {
        const body = req.body;
        let cloudinaryUpload;
        const validation = user_1.default.safeParse(body);
        if (!validation.success)
            return res.json({
                status: 400,
                message: validation.error.errors[0].path +
                    " " +
                    validation.error.errors[0].message,
            });
        const user = yield client_1.default.user.findFirst({
            where: {
                phone: body.phone,
            },
        });
        if (user)
            return res.json({
                status: 400,
                message: "Another user with provided phone number is already exist.",
            });
        if (!req.file && body.role == "physician") {
            return res.status(400).json({
                status: 400,
                message: "No certifcate selected",
            });
        }
        else if (req.file) {
            cloudinaryUpload = yield cloudinary_1.v2.uploader.upload(req.file.path, {
                folder: "certificates",
                resource_type: "auto",
            });
        }
        else {
            cloudinaryUpload = null;
        }
        const hashedPassword = yield bcrypt_1.default.hash(body.password, 10);
        const camp = yield client_1.default.user.create({
            data: {
                certifcate: (cloudinaryUpload === null || cloudinaryUpload === void 0 ? void 0 : cloudinaryUpload.secure_url) || "",
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
                    certificateUrl: (_a = cloudinaryUpload === null || cloudinaryUpload === void 0 ? void 0 : cloudinaryUpload.secure_url) !== null && _a !== void 0 ? _a : null,
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
const approveUserHandler = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { userId } = req.params;
        if (!userId) {
            return res.json({
                status: 400,
                success: false,
                message: "Physician Identity is required",
            });
        }
        const existingUser = yield client_1.default.user.findUnique({
            where: {
                id: userId,
            },
        });
        if (!existingUser) {
            return res.json({
                status: 404,
                success: false,
                message: "Physician not found",
            });
        }
        if (existingUser.approved) {
            return res.json({
                status: 200,
                success: true,
                message: "This physician is already approved",
                data: existingUser,
            });
        }
        const updatedUser = yield client_1.default.user.update({
            where: {
                id: userId,
            },
            data: {
                approved: true,
            },
        });
        const { password } = updatedUser, userWithoutPassword = __rest(updatedUser, ["password"]);
        return res.status(200).json({
            success: true,
            message: "Physician account is approved successfully",
            data: userWithoutPassword,
        });
    }
    catch (error) {
        console.error("User approval error:", error);
        return res.status(500).json({
            success: false,
            message: "An error occurred while approving the user",
        });
    }
});
exports.approveUserHandler = approveUserHandler;
