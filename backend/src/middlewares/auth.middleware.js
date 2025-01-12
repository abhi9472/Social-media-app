import { ApiError } from "../utils/ApeError.js";
import { asyncHandler } from "../utils/asyncHandler.js";
import jwt from "jsonwebtoken"
import { User } from "../models/user.model.js";

export const verifyJwt=asyncHandler(async(req,res,next)=>{
    try {
        const token=req.cookies?.accessToken;

    if(!token)
        {
            throw new ApiError(401,"unauthorized request")
        }

    const decodedToken=jwt.verify(token,process.env.ACCESS_TOKEN_SECRET)

    const user= await User.findById(decodedToken?._id).select("-refreshToken -password")

    if(!user)
        {
            throw new ApiError(401,"Invalid acces token")
        }
    req.user=user;
    next()

        
    } catch (error) {

        throw new ApiError(401,error?.message || "Invalid acces token")
        
    }

}) 