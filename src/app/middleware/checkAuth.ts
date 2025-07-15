import httpStatus from "http-status";
import { NextFunction, Request, Response } from "express";
import AppError from "../errorHelper/AppError";
import { verifyToken } from "../utils/jwt";
import { envVars } from "../config/env";
import { JwtPayload } from "jsonwebtoken";
import { User } from "../modules/user/user.model";
import { IsActive } from "../modules/user/user.interface";

export const checkAuth =
  (...authRoles: string[]) =>
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      const accessToken = req.headers.authorization;
      if (!accessToken) {
        throw new AppError(httpStatus.BAD_REQUEST, "No Token Received");
      }
      // const verifiedToken = jwt.verify(accessToken, "secret");

      const verifiedToken = verifyToken(
        accessToken,
        envVars.JWT_ACCESS_SECRET
      ) as JwtPayload;
     



      const isUserExist = await User.findOne({ email: verifiedToken.email });

  if (!isUserExist) {
    throw new AppError(httpStatus.BAD_REQUEST, "User doesn't exist");
  }
  if (
    isUserExist.isActive === IsActive.BLOCKED ||
    isUserExist.isActive === IsActive.INACTIVE
  ) {
    throw new AppError(
      httpStatus.BAD_REQUEST,
      `User is ${isUserExist.isActive}`
    );
  }
  if (isUserExist.isDeleted) {
    throw new AppError(httpStatus.BAD_REQUEST, "User is Deleted");
  }


 if (!authRoles.includes(verifiedToken.role)) {
        throw new AppError(
          httpStatus.BAD_REQUEST,
          "You are Not Permitted to View This Route"
        );
      }




      //global type declaration
      req.user = verifiedToken;

      // if ((verifiedToken as JwtPayload).role !== authRoles.includes) {
      //   throw new AppError(
      //     httpStatus.BAD_REQUEST,
      //     "You are Not Permitted to Do This Action"
      //   );
      // }

      next();
    } catch (err) {
      next(err);
    }
  };
