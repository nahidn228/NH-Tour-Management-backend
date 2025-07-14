/* eslint-disable @typescript-eslint/no-unused-vars */
import httpStatus from "http-status";
import { NextFunction, Request, Response } from "express";
import catchAsync from "../../utils/catchAsync";
import { sendResponse } from "../../utils/sendResponse";
import { AuthServices } from "./auth.service";

const credentialsLogin = catchAsync(
  async (req: Request, res: Response, next: NextFunction) => {
    const loginInfo = await AuthServices.credentialsLogin(req.body);

    sendResponse(res, {
      success: true,
      message: "User Logged In Successful",
      statusCode: httpStatus.OK,
      data: loginInfo,
    });
  }
);

export const AuthControllers = {
  credentialsLogin,
};
