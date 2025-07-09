import { Request, Response } from "express";
import { User } from "./user.model";
import httpStatus from "http-status";

/* eslint-disable @typescript-eslint/no-explicit-any */
const createUser = async (req: Request, res: Response) => {
  try {
    const { name, email } = req.body;
    const user = await User.create({
      name,
      email,
    });
    res.status(httpStatus.CREATED).json({
      message: "User created successfully",
      user,
    });
  } catch (err: any) {
    console.log(err);
    res.status(httpStatus.BAD_REQUEST).json({
      message: `Something Went wrong ${err.message}`,
    });
  }
};

export const userController = {
  createUser
}