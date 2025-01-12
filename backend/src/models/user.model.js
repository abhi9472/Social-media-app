import mongoose from "mongoose";
const { Schema } = mongoose;

import jwt from "jsonwebtoken";
import bcrypt from "bcrypt";

const userSchema = mongoose.Schema(
  {
    username: {
      type: String,
      required: true,
      unique: true,
    },
    email: {
      type: String,
      required: true,
      unique: true,
    },
    password: {
      type: String,
      required: true,
    },
    friends: [{ type: mongoose.Schema.Types.ObjectId, ref: "User" }],
    interests: [String],
  },
  { timestamps: true }
);

userSchema.pre("save", async function (next) {
  if (!this.isModified("password")) return next;
  this.password = await bcrypt.hash(this.password, 10);
  next();
});
// userSchema.methods.isPasswordCorrect=async function(password){
//     return await bcrypt.compare(password,this.password)

// }
// userSchema.methods.isPasswordCorrect = async function(password){
//     return await bcrypt.compare(password, this.password)
// }
userSchema.methods.comparePassword = async function (password) {
  return bcrypt.compare(password, this.password);
};
userSchema.methods.generateAccessToken = function () {
  console.log(process.env.ACCESS_TOKEN_SECRET);
  return jwt.sign(
    {
      _id: this._id,
      email: this.email,
      username: this.username,
      name: this.name,
    },
    process.env.ACCESS_TOKEN_SECRET,
    {
      expiresIn: process.env.ACCESS_TOKEN_EXPIRY,
    }
  );
};
userSchema.methods.generateRefreshToken = function () {
  return jwt.sign(
    {
      _id: this._id,
    },
    process.env.REFRESH_TOKEN_SECRET,
    {
      expiresIn: process.env.REFRESH_TOKEN_EXPIRY,
    }
  );
};

export const User = mongoose.model("User", userSchema);
