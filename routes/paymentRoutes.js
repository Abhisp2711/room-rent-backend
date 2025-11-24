import express from "express";
import { adminMiddleware } from "../middleware/adminMiddleware.js";
import { authMiddleware } from "../middleware/authMiddleware.js";
import {
  createOrder,
  verifyAndSave,
  recordCashPayment,
  getPayments,
} from "../controllers/paymentController.js";

const router = express.Router();

// Online payment (Razorpay)
router.post("/create-order", authMiddleware, createOrder);
router.post("/verify", authMiddleware, verifyAndSave);

// Cash payment (Admin only)
router.post("/cash", authMiddleware, adminMiddleware, recordCashPayment);

// Get all payments (Admin only)
router.get("/", authMiddleware, adminMiddleware, getPayments);

export default router;
