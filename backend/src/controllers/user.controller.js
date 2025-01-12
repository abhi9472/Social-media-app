import { ApiError } from "../utils/ApeError.js";
import { asyncHandler } from "../utils/asyncHandler.js";
import { uploadOnCloudinary } from "../utils/cloudinary.js";
import { User } from "../models/user.model.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import { mailUser } from "../utils/nodeMailer.js";
import dotenv from "dotenv";
// import { Suggestion } from "../models/suggestion.model.js";
// const Suggestion = require('../models/suggestion.model.js');
dotenv.config();

import jwt, { decode } from "jsonwebtoken";
function getRandomInt() {
  return Math.floor(Math.random() * (99999 - 10000 + 1)) + 10000;
}

async function generateAccessRefreshToken(id) {
  try {
    const user = await User.findOne(id).select("-password");
    const accessToken = user.generateAccessToken();
    const refreshToken = user.generateRefreshToken();

    user.refreshToken = refreshToken;
    await user.save({ validateBeforeSave: false });

    return { accessToken, refreshToken };
  } catch (error) {
    throw new ApiError(401, `${error.message}`);
  }
}

const registerUser = asyncHandler(async (req, res) => {
  const { username, password, email } = req.body;

  // if(
  //     [name,email,phonenum,password,phoneNum].some((field)=>field.trim()==="")
  // )

  // {
  //     throw new ApiError(400,"All fields are required")
  // }
  const existeduser = await User.findOne({
    $or: [{ username }],
  });

  if (existeduser) {
    throw new ApiError(401, "User already exist");
  }

  const avatarlocalpath = req.files?.avatar[0]?.path;

  if (!avatarlocalpath) {
    throw new ApiError(400, "Avatar is required");
  }
  const avatar = await uploadOnCloudinary(avatarlocalpath);
  if (!avatar) {
    throw new ApiError(400, "Avatar file is required");
  }
  const user = await User.create({
    username,
    avatar: avatar.url,
    password,
    email,
    // Username:Username.toLowerCase()
  });
  const createdUser = await User.findById(user._id).select(
    "-password -refreshToken"
  );

  if (!createdUser) {
    throw new ApiError(500, "Something went wrong while registering the user");
  }

  return res
    .status(201)
    .json(new ApiResponse(200, createdUser, "User registered Successfully"));
});
const loginUser = asyncHandler(async (req, res) => {
  // console.log("inside controller");
  const { username, password } = req.body;

  if (!username) {
    throw new ApiError(400, "username is required");
  }

  const user = await User.findOne({
    $or: [{ username }],
  });

  if (!user) {
    throw new ApiError(400, "user doesnot exist");
  }
  // console.log(user);
  const checkpass = await user.comparePassword(password);

  if (!checkpass) {
    throw new ApiError(400, "Password is wrong");
  }
  const loginUser = await User.findById(user._id).select(
    "-password -refreshToken"
  );
  const options = {
    httpOnly: true,
    secure: true,
    sameSite: "none",
    path: "/",
  };

  const { accessToken, refreshToken } = await generateAccessRefreshToken(
    loginUser._id
  );
  return res
    .status(200)
    .cookie("accessToken", accessToken, options)
    .cookie("refreshToken", refreshToken, options)
    .json(
      new ApiResponse(200, { user: loginUser }, "User logged in successfully")
    );
});

const logoutUser = asyncHandler(async (req, res) => {
  const user = await User.findById(req.user._id).select("-password");

  user.refreshToken = undefined;
  await user.save({ validateBeforeSave: false });

  const options = {
    expires: new Date(Date.now() + 100 * 24 * 60 * 60 * 1000),
    httpOnly: true,
    secure: true,
    sameSite: "none",
    path: "/",
  };

  return res
    .status(200)
    .clearCookie("accessToken", options)
    .clearCookie("refreshToken", options)
    .json(new ApiResponse(200, user, "user log Out Done"));
});

const userdetail = asyncHandler(async (req, res) => {
  const user = req.user._id;

  try {
    const admin = await User.findById(user);

    if (!admin) {
      return res.status(401).json(new ApiResponse(401, "Admin not found"));
    }
    return res
      .status(200)
      .json(new ApiResponse(200, "Admin fetched successfully", admin));
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
});

const forgotpassword = asyncHandler(async (req, res) => {
  // const id=req.user._id;

  const { username, newpassword } = req.body;
  try {
    const user = await User.findOne({ username });
    if (!user) {
      throw new ApiError(401, "Email id is wrong");
    }

    user.password = newpassword;
    user.refreshToken = null;
    user.save();

    return res
      .status(200)
      .json(new ApiResponse(200, {}, "Password Reset Done"));
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
});
let otp;

const forgetPassword = asyncHandler(async (req, res) => {
  try {
    const { email } = req.body;
    const user = await User.findOne({
      email: email,
    }).select("-password -refreshToken");

    const verificationCode = getRandomInt();
    const verificationString = jwt.sign(
      {
        verificationCode: verificationCode,
      },
      process.env.REGISTER_TOKEN_PASS
    );

    user.verificationCode = verificationString;
    user.save({ validateBeforeSave: false });

    const message = `<div style="font-family: Arial, sans-serif; padding: 20px;">
            <p style="font-size: 16px;">Authenticate your Email:</p>
            <p style="font-size: 16px;">OTP: ${verificationCode}</p>

            </div>`;

    mailUser(user.email, "Forget Password Request", message);

    res.status(200).json(new ApiResponse(200, user, "OTP Send - Verify Email"));
  } catch (error) {
    throw new ApiError(500, `${error.message}`);
  }
});
const verifyForgetOTP = asyncHandler(async (req, res) => {
  try {
    const { id, OTP } = req.body;

    if (!OTP) throw new ApiError(401, "Enter OTP First");

    if (!id) throw new ApiError(500, "Use Link : Server Error");

    const userObj = await User.findById(id).select("-password");

    if (!userObj) throw new ApiError(404, "User Not Found");

    const decodedOTP = jwt.verify(
      userObj.verificationCode,
      process.env.REGISTER_TOKEN_PASS
    );

    if (decodedOTP.verificationCode !== Number(OTP))
      throw new ApiError(409, "OTP Wrong");

    res.status(200).json(new ApiResponse(200, {}, "OTP Verified"));
  } catch (error) {
    new ApiError(500, `${error.message}`);
  }
});

const newPassword = asyncHandler(async (req, res) => {
  try {
    const { userID, password } = req.body;
    const user = await User.findById(userID);

    if (!user) throw new ApiError(404, "User Not Found");

    user.password = password;

    await user.save({ validateBeforeSave: false });

    res
      .status(200)
      .json(new ApiResponse(200, {}, "Password Updated Successfully"));
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

export {
  registerUser,
  loginUser,
  logoutUser,
  userdetail,
  forgotpassword,
  forgetPassword,
  verifyForgetOTP,
  newPassword,
};
