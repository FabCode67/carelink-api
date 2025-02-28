import prisma from "../../prisma/client";
import { Request, Response } from "express";
import { v2 as cloudinary } from "cloudinary";
import bcrypt from "bcrypt";
import userValidation from "../validations/user";

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});
export const userRegisterHandler = async (
  req: Request,
  res: Response
): Promise<any> => {
  try {
    const body = req.body;
    if (!req.file) {
      return res.status(400).json({
        status: 400,
        message: "No certifcate selected",
      });
    }
    const validation = userValidation.safeParse(body);
    if (!validation.success)
      return res.json({
        status: 400,
        message:
          validation.error.errors[0].path +
          " " +
          validation.error.errors[0].message,
      });

    const cloudinaryUpload = await cloudinary.uploader.upload(req.file.path, {
      folder: "certificates",
      resource_type: "auto",
    });
    const hashedPassword = await bcrypt.hash(body.password, 10);
    const camp = await prisma.user.create({
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
    } else {
      return res.json({
        status: 400,
        message: "Registration failed",
      });
    }
  } catch (err) {
    console.error(err);
    return res.status(500).json({
      status: 500,
      message: "Error occured while uploading certificate",
      error: err instanceof Error ? err.message : "Unknown error",
    });
  }
};
