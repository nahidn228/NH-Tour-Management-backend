import { NextFunction, Request, Response } from "express";

import httpStatus from "http-status";
import { UserServices } from "./user.service";

/* eslint-disable @typescript-eslint/no-explicit-any */
const createUser = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const user = await UserServices.createUser(req.body);
    res.status(httpStatus.CREATED).json({
      message: "User created successfully",
      user,
    });
  } catch (err: any) {
    console.log(err);
    next(err);
  }
};

export const userController = {
  createUser,
};
