"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const zod_1 = require("zod");
const userValidation = zod_1.z.object({
    firstname: zod_1.z.string().min(2),
    lastname: zod_1.z.string().min(2),
    phone: zod_1.z.string().min(10),
    role: zod_1.z.string().min(2),
    district: zod_1.z.string(),
    sector: zod_1.z.string(),
    password: zod_1.z.string(),
});
exports.default = userValidation;
