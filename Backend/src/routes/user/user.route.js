import { Router } from "express";
import rateLimit from "express-rate-limit";
import {
  changeMyPassword,
  getAllUsers,
  getMyProfile,
  getMostActiveUsers,
  getUserDetails,
  getUserFirstName,
  loginUser,
  logoutUser,
  refreshAccessToken,
  registerUser,
  removeUser,
  updateMyProfile,
} from "../../controllers/user/user.controller.js";
import { verifyJWT } from "../../middleware/auth.middleware.js";
import { verifyAdmin } from "../../middleware/isAdmin.middleware.js";

const router = Router();

const authLimiter = rateLimit({
  windowMs: 10 * 60 * 1000,
  max: Number(process.env.AUTH_RATE_LIMIT_MAX || 25),
  standardHeaders: true,
  legacyHeaders: false,
  message: {
    success: false,
    message: "Too many authentication attempts. Please try again later.",
  },
});

router.route("/register").post(authLimiter, registerUser);
router.route("/login").post(authLimiter, loginUser);
router.route("/refresh-token").post(authLimiter, refreshAccessToken);
router.route("/logout").post(verifyJWT, logoutUser);
router.route("/me").get(verifyJWT, getMyProfile);
router.route("/me").patch(verifyJWT, updateMyProfile);
router.route("/me/change-password").post(verifyJWT, changeMyPassword);
router.route("/get-user-first-name").get(verifyJWT, getUserFirstName);
router.route("/get-user-details").get(verifyJWT, verifyAdmin, getUserDetails);
router.route("/get-all-users").get(verifyJWT, verifyAdmin, getAllUsers);
router
  .route("/most-active-users")
  .get(verifyJWT, verifyAdmin, getMostActiveUsers);
router.route("/remove-user/:userId").delete(verifyJWT, verifyAdmin, removeUser);
export default router;
