import { Router } from "express";
import  {register,filterbyfullname,getAllUsers,postallChatUsers,login,logout,getAllChatUsers,getProfile,forgot,reset,updateAccountDetails,changeCurrentPassword,getCurrentUser}from "../controllers/user.controller.js";
import upload from "../middleware/multer.middleware.js"
import { authorizedRoles, verifyjwt } from "../middleware/auth.middleware.js";
const router=Router();

router.route("/register").post(upload.single("avatar"),register);
router.route("/allchatusers").get(verifyjwt,getAllChatUsers);
router.route("/postallchatusers").post(verifyjwt,postallChatUsers);
router.route("/login").post(login);
router.route("/logout").post(verifyjwt,logout);
router.route("/me").post(verifyjwt,getProfile);
router.route("/reset").post(forgot);
router.route("/reset/:resetToken").post(reset);
router.route("/user-details").post(verifyjwt,getCurrentUser);
router.route("/change-password").post(verifyjwt,changeCurrentPassword);
router.route("/change-details").post(verifyjwt,updateAccountDetails);
router.route("/alldata").get(verifyjwt,getAllUsers);
// router.route('/total-revenue').get(verifyjwt,calculateTotalRevenue);
router.route('/filterbyfullname').post(filterbyfullname);
export default router;