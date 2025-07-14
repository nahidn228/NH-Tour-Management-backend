import { NextFunction, Request, Router } from "express";
import { userController } from "./user.controller";
import z from "zod";

const router = Router();

router.post(
  "/register",
  async (req: Request, res: Response, next: NextFunction) => {
    const createUserZodSchema = z.object({
      name: z
        .string({ invalid_type_error: "Name must be string" })
        .min(2, { message: "Name is too short, Minimum 2 character long" })
        .max(50, { message: "Name too long, Maximum 50 character long" }),
      email: z.string().email(),
      password: z
        .string({ invalid_type_error: "Password must be string" })
        .min(8, { message: "Password must be at least 8 characters long." })
        .regex(/^(?=.*[A-Z])/, {
          message: "Password must contain at least 1 uppercase letter.",
        })
        .regex(/^(?=.*[!@#$%^&*])/, {
          message: "Password must contain at least 1 special character.",
        })
        .regex(/^(?=.*\d)/, {
          message: "Password must contain at least 1 number.",
        }),
      phone: z
        .string({ invalid_type_error: "Phone Number must be string" })
        .regex(/^(?:\+8801\d{9}|01\d{9})$/, {
          message:
            "Phone number must be valid for Bangladesh. Format: +8801XXXXXXXXX or 01XXXXXXXXX",
        })
        .optional(),

      address: z
        .string({ invalid_type_error: "Address must be string" })
        .max(200, { message: "Address cannot exceed 200 characters." })
        .optional(),
    });

    req.body = await createUserZodSchema.parseAsync(req.body);
    console.log(req.body);
    // next();
  },
  userController.createUser
);
router.get("/all-users", userController.getAllUsers);

export const UserRoutes = router;
