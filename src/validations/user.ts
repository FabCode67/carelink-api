import { z } from "zod";

const userValidation = z.object({
  firstname: z.string().min(2),
  lastname: z.string().min(2),
  phone: z.string().min(10),
  role: z.string().min(2),
  district: z.string(),
  sector: z.string(),
  password: z.string(),
});
export default userValidation;
