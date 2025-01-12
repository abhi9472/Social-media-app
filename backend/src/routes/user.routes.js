import { Router } from "express";
import {
  forgetPassword,
  forgotpassword,
  loginUser,
  logoutUser,
  newPassword,
  registerUser,
  // createSuggestion,
  userdetail,
  verifyForgetOTP,
} from "../controllers/user.controller.js";
import { upload } from "../middlewares/multer.middleware.js";
import { verifyJwt } from "../middlewares/auth.middleware.js";
import {
  addFriend,
  getAllUsers,
  getFriendsList,
  recommendFriends,
  searchUsers,
  unfriendUser,
} from "../controllers/search.controller.js";
// import { isAdmin } from "../middlewares/isAdmin.middleware.js";
// import {
//   addhome,
//   allhomes,
//   gethomedetail,
//   getuserhome,
// } from "../controllers/products.controllers.js";
// import {
//   deleteHome,
//   updateavatar,
//   updatelocation,
//   updatepassword,
//   updatePhoneNum,
//   updateprice,
// } from "../controllers/updatehome.controllers.js";

const router = Router();

// function test(){
//     console.log("ok");
//     return true;
// }

router.route("/register").post(
  upload.fields([
    {
      name: "avatar",
      maxCount: 1,
    },
  ]),
  registerUser
);

router.post(
  "/updateavatar",
  verifyJwt,
  // isAdmin,
  upload.single("avatar")
  // updateavatar
);

router.route("/login").post(loginUser);
router.route("/logout").post(verifyJwt, logoutUser);
// router.route("/updatepassword").patch(verifyJwt, updatepassword);

// router.route("/addhome").post(
//   verifyJwt,
//   // isAdmin,
//   upload.fields([
//     {
//       name: "image",
//     },
//   ]),
//   addhome
// );
// router.route("/userdetail").post(verifyJwt, userdetail);
// export { getAllUsers, searchUsers, getFriendsList, unfriendUser };

router.route("/allusers").post(getAllUsers);
router.route("/searchusers").post(searchUsers);
router.route("/getlist").post(getFriendsList);
router.route("/unfriend").post(unfriendUser);
router.route("/add").post(addFriend);
router.route("/recommend").post(recommendFriends);

// router.route("/getuserhome").post(verifyJwt, getuserhome);
// router.route("/gethomedetail").get(gethomedetail);
// router.get('gethomedetail', gethomedetail);

// router.route("/updateprice").patch(verifyJwt,updateprice);
// router.route("/updatelocation").patch(verifyJwt, isAdmin, updatelocation);
// router.route("/updatephone").patch(verifyJwt, isAdmin, updatePhoneNum);

// router.route("/forgotpassword").post(forgotpassword);
// router.route("/forgetpassword").post(forgetPassword);
// router.route("/verifyotp").post(verifyForgetOTP);
// router.route("/newpassword").post(newPassword);
// // router.route("/suggestion").post(createSuggestion);
// router.route("/newPassword").post(newPassword);

// router.route("/deletehome").patch(verifyJwt, isAdmin, deleteHome);

export default router;
