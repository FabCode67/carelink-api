import prisma from "../../prisma/client";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import { Request, Response } from "express";

export const SignInHandler = async (
  req: Request,
  res: Response
): Promise<any> => {
  try {
    const body = req.body;
    const user = await prisma.user.findFirst({
      where: {
        phone: body.phone,
      },
    });
    if (!user)
      return res.json({
        status: 400,
        message: "Provided phone number is invalid.",
      });
    const passwordMatch = await bcrypt.compare(body.password, user.password);
    if (!passwordMatch)
      return res.json({ status: 400, message: "Password is incorrect" });
    if (user.role == "physician" && !user.approved)
      return res.json({
        status: 400,
        message: "Your physician account has not yet been approved!",
      });
    const accessToken = jwt.sign(
      {
        id: user.id,
        email: user.email,
        role: user.role,
      },
      process.env.JWT_SECRETE!,
      { expiresIn: "1d" }
    );
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
  } catch (err) {
    console.error(err);
  }
};
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
