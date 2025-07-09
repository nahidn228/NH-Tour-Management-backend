/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable @typescript-eslint/no-unused-vars */
import { NextFunction, Request, Response } from "express";

import httpStatus from "http-status";
import { UserServices } from "./user.service";
import catchAsync from "../../utils/catchAsync";

// const createUser = async (req: Request, res: Response, next: NextFunction) => {
//   try {
// const user = await UserServices.createUser(req.body);
// res.status(httpStatus.CREATED).json({
//   message: "User created successfully",
//   user,
// });
//   } catch (err: any) {
//     console.log(err);
//     next(err);
//   }
// };

const createUser = catchAsync(
  async (req: Request, res: Response, next: NextFunction) => {
    const user = await UserServices.createUser(req.body);
    res.status(httpStatus.CREATED).json({
      success: true,
      message: "User created successfully",
      user,
    });
  }
);

const getAllUsers = catchAsync(
  async (req: Request, res: Response, next: NextFunction) => {
    const users = await UserServices.getAllUsers();
    res.status(httpStatus.OK).json({
      success: true,
      message: "User Retrieved successfully",
      users,
    });
  }
);

export const userController = {
  createUser,
  getAllUsers,
};
