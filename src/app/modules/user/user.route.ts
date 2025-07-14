import httpStatus from "http-status";
import jwt, { JwtPayload } from "jsonwebtoken";
import { NextFunction, Request, Response, Router } from "express";
import { userController } from "./user.controller";
import { createUserZodSchema } from "./user.validation";

import { validateRequest } from "../../middleware/validateRequest";
import AppError from "../../errorHelper/AppError";
import { Role } from "./user.interface";

const router = Router();

router.post(
  "/register",
  validateRequest(createUserZodSchema),
  userController.createUser
);

router.get(
  "/all-users",
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      const accessToken = req.headers.authorization;
      if (!accessToken) {
        throw new AppError(httpStatus.BAD_REQUEST, "No Token Received");
      }
      const verifyToken = jwt.verify(accessToken, "secret");

      if (!verifyToken) {
        throw new AppError(httpStatus.BAD_REQUEST, "You are Not Authorized");
      }

      if ((verifyToken as JwtPayload).role !== Role.ADMIN || Role.SUPER_ADMIN) {
        throw new AppError(
          httpStatus.BAD_REQUEST,
          "You are Not Permitted to Do This Action"
        );
      }

      next();
    } catch (err) {
      next(err);
    }
  },
  userController.getAllUsers
);

export const UserRoutes = router;
