/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable @typescript-eslint/no-unused-vars */
import httpStatus from "http-status";
import { NextFunction, Request, Response } from "express";
import catchAsync from "../../utils/catchAsync";
import { sendResponse } from "../../utils/sendResponse";
import { AuthServices } from "./auth.service";
import AppError from "../../errorHelper/AppError";
import { setAuthCookie } from "../../utils/setCookie";
import { createUserTokens } from "../../utils/userTokens";
import { envVars } from "../../config/env";
import { JwtPayload } from "jsonwebtoken";
import passport from "passport";

const credentialsLogin = catchAsync(
  async (req: Request, res: Response, next: NextFunction) => {
    // const loginInfo = await AuthServices.credentialsLogin(req.body);

    passport.authenticate("local", async (err: any, user: any, info: any) => {
      if (err) {
        return next(err);
      }

      if (!user) {
        return new AppError(httpStatus.NOT_FOUND, info.message);
      }

      const userToken = await createUserTokens(user);

      // delete user.toObject().password;

      const { password: pass, ...rest } = user.toObject();

      setAuthCookie(res, userToken);

      sendResponse(res, {
        success: true,
        message: "User Logged In Successful",
        statusCode: httpStatus.OK,
        data: {
          accessToken: userToken.accessToken,
          refreshToken: userToken.refreshToken,
          user: rest,
        },
      });
    })(req, res, next);

    // res.cookie("accessToken", loginInfo.accessToken, {
    //   httpOnly: true,
    //   secure: false,
    // });

    // //set refresh token in cookie
    // res.cookie("refreshToken", loginInfo.refreshToken, {
    //   httpOnly: true,
    //   secure: false,
    // });
    //  setAuthCookie(res, loginInfo);

    // sendResponse(res, {
    //   success: true,
    //   message: "User Logged In Successful",
    //   statusCode: httpStatus.OK,
    //   data: loginInfo,
    // });
  }
);

const getNewAccessToken = catchAsync(
  async (req: Request, res: Response, next: NextFunction) => {
    const refreshToken = req.cookies.refreshToken;

    if (!refreshToken) {
      throw new AppError(httpStatus.BAD_REQUEST, "No refresh token received");
    }

    const tokenInfo = await AuthServices.getNewAccessToken(refreshToken);

    // res.cookie("accessToken", tokenInfo.accessToken, {
    //   httpOnly: true,
    //   secure: false,
    // });

    setAuthCookie(res, tokenInfo);

    sendResponse(res, {
      success: true,
      message: "New access token retrieved Successful",
      statusCode: httpStatus.OK,
      data: tokenInfo,
    });
  }
);

const logout = catchAsync(
  async (req: Request, res: Response, next: NextFunction) => {
    res.clearCookie("accessToken", {
      httpOnly: true,
      secure: false,
      sameSite: "lax",
    });
    res.clearCookie("refreshToken", {
      httpOnly: true,
      secure: false,
      sameSite: "lax",
    });

    sendResponse(res, {
      success: true,
      message: "User Logged out Successful",
      statusCode: httpStatus.OK,
      data: null,
    });
  }
);
const resetPassword = catchAsync(
  async (req: Request, res: Response, next: NextFunction) => {
    const oldPassword = req.body.oldPassword;
    const newPassword = req.body.newPassword;
    const decodedToken = req.user;

    await AuthServices.resetPassword(
      oldPassword,
      newPassword,
      decodedToken as JwtPayload
    );

    sendResponse(res, {
      success: true,
      message: "Password changed Successfully",
      statusCode: httpStatus.OK,
      data: null,
    });
  }
);
const googleCallbackController = catchAsync(
  async (req: Request, res: Response, next: NextFunction) => {
    let redirectTo = req.query.state ? (req.query.state as string) : "";
    if (redirectTo.startsWith("/")) {
      redirectTo = redirectTo.slice(1);
    }
    const user = req.user;

    if (!user) {
      throw new AppError(httpStatus.NOT_FOUND, "User not found");
    }

    const tokenInfo = createUserTokens(user);
    setAuthCookie(res, tokenInfo);

    // sendResponse(res, {
    //   success: true,
    //   message: "Password changed Successfully",
    //   statusCode: httpStatus.OK,
    //   data: null,
    // });

    res.redirect(`${envVars.FRONTEND_URL}/${redirectTo}`);
  }
);

export const AuthControllers = {
  credentialsLogin,
  getNewAccessToken,
  logout,
  resetPassword,
  googleCallbackController,
};
