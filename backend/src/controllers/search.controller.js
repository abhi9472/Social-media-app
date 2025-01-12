// const express = require("express");
import { asyncHandler } from "../utils/asyncHandler.js";
// import { uploadOnCloudinary } from "../utils/cloudinary.js";
import { User } from "../models/user.model.js";
import { ApiError } from "../utils/ApeError.js";
// import { Products } from "../models/product.model.js";

import mongoose from "mongoose";

// const router = express.Router();

// Get initial users (paginated)
const getAllUsers = asyncHandler(async (req, res) => {
  const { page = 1, limit = 10 } = req.query;

  const users = await User.find()
    .skip((page - 1) * limit)
    .limit(parseInt(limit))
    .lean()
    .exec();

  users.reverse();
  res.json(users);
});

// Search users
const searchUsers = asyncHandler(async (req, res) => {
  const { query } = req.query;

  if (!query) {
    throw new ApiError(400, "Search query is required");
  }

  const users = await User.find({
    $or: [
      { username: { $regex: query, $options: "i" } },
      { email: { $regex: query, $options: "i" } },
    ],
  })
    .lean()
    .exec();

  res.json(users);
});

// Get friends list
const getFriendsList = asyncHandler(async (req, res) => {
  const { userId } = req.query;

  if (!userId) {
    throw new ApiError(400, "User ID is required");
  }

  const user = await User.findById(userId)
    .populate({
      path: "friends",
      select: "-password -refreshToken",
    })
    .lean()
    .exec();

  if (!user) {
    throw new ApiError(404, "User not found");
  }

  user.friends.reverse(); // Reverse friends list if needed
  res.json(user.friends);
});

// Unfriend a user
const unfriendUser = asyncHandler(async (req, res) => {
  const { userId } = req.query;
  const { friendId } = req.params;

  if (!userId || !friendId) {
    throw new ApiError(400, "User ID and Friend ID are required");
  }

  const user = await User.findById(userId).exec();

  if (!user) {
    throw new ApiError(404, "User not found");
  }

  user.friends = user.friends.filter(
    (friend) => friend.toString() !== friendId
  );
  await user.save();

  res.json({ message: "Friend removed successfully" });
});

const addFriend = asyncHandler(async (req, res) => {
  const { userId, friendId } = req.body;

  if (!userId || !friendId) {
    throw new ApiError(400, "Both userId and friendId are required");
  }

  // Find the user and friend
  const user = await User.findById(userId).exec();
  const friend = await User.findById(friendId).exec();

  if (!user || !friend) {
    throw new ApiError(404, "User or Friend not found");
  }

  // Check if the friend is already in the list
  if (user.friends.includes(friendId)) {
    throw new ApiError(400, "Friend already added");
  }

  // Add the friend
  user.friends.push(friendId);
  await user.save();

  res.json({ message: "Friend added successfully" });
});

const recommendFriends = asyncHandler(async (req, res) => {
  const { userId } = req.query;

  if (!userId) {
    throw new ApiError(400, "User ID is required");
  }

  // Find the user and their friends
  const user = await User.findById(userId).populate("friends").exec();
  if (!user) {
    throw new ApiError(404, "User not found");
  }

  const userFriends = user.friends.map((friend) => friend._id.toString());

  // Find all users excluding the current user
  const allUsers = await User.find({ _id: { $ne: userId } })
    .populate("friends")
    .exec();

  const recommendations = allUsers
    .filter((candidate) => !userFriends.includes(candidate._id.toString())) // Exclude existing friends
    .map((candidate) => {
      // Calculate mutual friends
      const mutualFriends = candidate.friends.filter((friend) =>
        userFriends.includes(friend._id.toString())
      );

      // Calculate common interests
      const commonInterests = user.interests.filter((interest) =>
        candidate.interests.includes(interest)
      );

      return {
        _id: candidate._id,
        name: candidate.name,
        email: candidate.email,
        mutualFriends: mutualFriends.length,
        commonInterests,
      };
    })
    .sort((a, b) => b.mutualFriends - a.mutualFriends); // Sort by mutual friends (desc)

  res.json(recommendations);
});
// Define routes
// router.get('/users', getAllUsers);
// router.get('/users/search', searchUsers);
// router.get('/friends', getFriendsList);
// router.delete('/friends/:friendId', unfriendUser);

// module.exports = router;
export {
  getAllUsers,
  searchUsers,
  getFriendsList,
  unfriendUser,
  addFriend,
  recommendFriends,
};
