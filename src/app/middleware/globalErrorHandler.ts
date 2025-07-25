/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable @typescript-eslint/no-unused-vars */
import { NextFunction, Request, Response } from "express";
import { envVars } from "../config/env";
import AppError from "../errorHelper/AppError";

export const globalErrorHandler = (
  err: any,
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const errorSource: any = [];

  let statusCode = 500;
  let message = `Something went wrong!! ${err.message}`;

  if (err.code === 11000) {
    const matchedArray = err.message.match(/"([^"]*)"/);
    statusCode = 400;
    message = `${matchedArray[1]} already exist !!`;
  } else if (err.name === "CastError") {
    statusCode = 400;
    message = "Invalid MongoDB ObjectId, Please provide a valid id";
  } else if (err.name === "ZodError") {
    statusCode = 400;
    message = "Zod Error";
    console.log(err.issues);
    err.issues.forEach((issue: any) => {
      errorSource.push({
        path: issue.path[issue.path.length - 1],
        message: issue.message,
      });
    });
  } else if (err instanceof AppError) {
    statusCode = err.statusCode;
    message = err.message;
  } else if (err instanceof Error) {
    statusCode = 500;
    message = err.message;
  }

  res.status(statusCode).json({
    success: false,
    message,
    errorSource,
    err,
    stack: envVars.NODE_ENV === "development" ? err.stack : null,
  });
};
