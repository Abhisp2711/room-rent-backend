import express from "express";
import { authMiddleware } from "../middleware/authMiddleware.js";
import { adminMiddleware } from "../middleware/adminMiddleware.js";
import { cloudinaryUpload } from "../middleware/upload.js";
import {
  createRoom,
  updateRoom,
  deleteRoom,
  getAllRooms,
  getRoomById,
} from "../controllers/roomController.js";

const router = express.Router();

// Admin Only - Multiple Photos
router.post(
  "/create",
  authMiddleware,
  adminMiddleware,
  cloudinaryUpload("room_photos").array("photos", 5), // max 5 photos
  createRoom
);

router.put(
  "/update/:id",
  authMiddleware,
  adminMiddleware,
  cloudinaryUpload("room_photos").array("photos", 5),
  updateRoom
);

router.delete("/delete/:id", authMiddleware, adminMiddleware, deleteRoom);

// Public / Users
router.get("/", getAllRooms);
router.get("/:id", getRoomById);

export default router;
