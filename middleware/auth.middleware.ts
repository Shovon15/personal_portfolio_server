import jwt from "jsonwebtoken";
import { asyncHandler } from "../utils/asyncHandler";
import { accessTokenSecret } from "../secret";
import CustomError from "../utils/errorHandler";
import { NextFunction, Request, Response } from "express";
import UserModel from "../models/userModel";

import { JwtPayload } from "jsonwebtoken";

interface CustomRequest extends Request {
	user?: any; // Define the user property
	token?: string;
}
export const isAuthenticated = asyncHandler(async (req: CustomRequest, res: Response, next: NextFunction) => {
	try {

		const token = req.headers.authorization;

		if (!token) {
			return next(new CustomError(401, "Please login to access this resource."));
		}

		const decoded = jwt.verify(token, accessTokenSecret) as JwtPayload;

		if (!decoded) {
			return next(new CustomError(401, "Access token is not valid."));
		}

		const user = await UserModel.findById(decoded?.id).select("-refreshToken");

		if (!user) {
			return next(new CustomError(401, "User session not found. please login"));
		}

		req.user = user._id.toString();
		req.token = token;

		next();
	} catch (error: any) {
		throw new CustomError(400, error.message || "Access token is not valid.")
	}
});
