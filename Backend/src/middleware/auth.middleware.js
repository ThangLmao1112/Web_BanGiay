import { ApiError } from "../utils/ApiError.js";
import { User } from "../models/user/user.model.js";
import jwt from "jsonwebtoken";
import { asyncHandler } from "../utils/asyncHandler.js";

export const verifyJWT = asyncHandler(async (req, res, next) => {
    try {
        const token =
            req.cookies?.accessToken ||
            req.header("Authorization")?.replace("Bearer ", "");

        if (!token) {
            throw new ApiError(401, "Unauthorized request");
        }

        const accessTokenSecret =
            process.env.ACCESS_TOKEN_SECRET || process.env.JWT_SECRET;
        
        if (!accessTokenSecret) {
            throw new ApiError(500, "Missing ACCESS_TOKEN_SECRET or JWT_SECRET in environment");
        }

        const decodedToken = jwt.verify(token, accessTokenSecret);
        const user = await User.findById(decodedToken?._id).select(
            "-password -refreshToken"
        );

        if (!user) {
            throw new ApiError(401, "Invalid accessToken");
        }

        req.user = user;
        next();
    } catch (error) {
        next(new ApiError(401, error?.message || "Invalid accessToken"));
    }
});
