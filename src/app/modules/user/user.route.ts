import httpStatus from "http-status";
import { JwtPayload } from "jsonwebtoken";
import { NextFunction, Request, Response, Router } from "express";
import { userController } from "./user.controller";
import { createUserZodSchema } from "./user.validation";

import { validateRequest } from "../../middleware/validateRequest";
import AppError from "../../errorHelper/AppError";
import { Role } from "./user.interface";
import { verifyToken } from "../../utils/jwt";
import { envVars } from "../../config/env";

const router = Router();

const checkAuth =
  (...authRole: string[]) =>
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      const accessToken = req.headers.authorization;
      if (!accessToken) {
        throw new AppError(httpStatus.BAD_REQUEST, "No Token Received");
      }
      // const verifiedToken = jwt.verify(accessToken, "secret");

      const verifiedToken = verifyToken(accessToken, envVars.JWT_ACCESS_SECRET);

      if (!verifiedToken) {
        throw new AppError(httpStatus.BAD_REQUEST, "You are Not Authorized");
      }

      if ((verifiedToken as JwtPayload).role !== Role.ADMIN) {
        throw new AppError(
          httpStatus.BAD_REQUEST,
          "You are Not Permitted to Do This Action"
        );
      }

      next();
    } catch (err) {
      next(err);
    }
  };

router.post(
  "/register",
  validateRequest(createUserZodSchema),
  userController.createUser
);

router.get(
  "/all-users",
  checkAuth("ADMIN", "SUPER_ADMIN"),
  userController.getAllUsers
);

export const UserRoutes = router;
