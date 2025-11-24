import express from "express";
import { authMiddleware } from "../middleware/authMiddleware.js";
import { cloudinaryUpload } from "../middleware/upload.js";
import {
  register,
  verifyOTP,
  login,
  updateProfile,
} from "../controllers/authController.js";

const router = express.Router();

router.post("/register", register);
router.post("/verify-otp", verifyOTP);
router.post("/login", login);

router.put(
  "/update-profile",
  authMiddleware,
  cloudinaryUpload("user_photos").single("photo"),
  updateProfile
);

export default router;
