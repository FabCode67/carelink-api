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
exports.SignInHandler = void 0;
const client_1 = __importDefault(require("../../prisma/client"));
const bcrypt_1 = __importDefault(require("bcrypt"));
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const SignInHandler = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const body = req.body;
        const user = yield client_1.default.user.findFirst({
            where: {
                phone: body.phone,
            },
        });
        if (!user)
            return res.json({
                status: 400,
                message: "Provided phone number is invalid.",
            });
        const passwordMatch = yield bcrypt_1.default.compare(body.password, user.password);
        if (!passwordMatch)
            return res.json({ status: 400, message: "Password is incorrect" });
        if (user.role == "physician" && !user.approved)
            return res.json({
                status: 400,
                message: "Your physician account has not yet been approved!",
            });
        const accessToken = jsonwebtoken_1.default.sign({
            id: user.id,
            email: user.email,
            role: user.role,
        }, process.env.JWT_SECRETE, { expiresIn: "1d" });
        res.cookie("token", accessToken, {
            httpOnly: true,
            secure: process.env.NODE_ENV === "production",
            sameSite: true,
            maxAge: 3600000 * 12,
        });
        const { firstname, lastname, role } = user;
        return res.json({
            status: 200,
            message: `Success. Welcome back ${firstname}!`,
            user: {
                firstname,
                lastname,
                role,
            },
        });
    }
    catch (err) {
        console.error(err);
    }
});
exports.SignInHandler = SignInHandler;
// export const getAuthUserInfo = async (
//   req: Request,
//   res: Response
// ): Promise<any> => {
//   try {
//     const id = req?.user?.id;
//     const userInfo = await prisma.user.findFirst({
//       where: {
//         id: id,
//       },
//     });
//     if (!userInfo)
//       return res.json({
//         status: 400,
//         data: null,
//       });
//     return res.json({
//       status: 200,
//       data: userInfo,
//     });
//   } catch (err) {
//     console.error(err);
//     return res.status(500).json({
//       success: false,
//       message: "Internal server error",
//       error: err,
//     });
//   }
// };
