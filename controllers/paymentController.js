import Payment from "../models/Payment.js";
import Room from "../models/Room.js";
import razorpay from "../utils/razorpay.js";
import crypto from "crypto";

// =========================
// Create Razorpay Order (Online Payment)
// =========================
export const createOrder = async (req, res) => {
  try {
    const { amount, roomId, month } = req.body;

    if (!amount || !roomId)
      return res.status(400).json({ message: "amount and roomId required" });

    const room = await Room.findById(roomId);
    if (!room) return res.status(404).json({ message: "Room not found" });

    // Ensure receipt length <= 40 characters
    const receipt = `rent_${roomId.toString().slice(0, 30)}_${
      month?.slice(0, 10) || "none"
    }`;

    const order = await razorpay.orders.create({
      amount: Math.round(amount * 100), // ₹ to paise
      currency: "INR",
      receipt,
    });

    res.json(order);
  } catch (err) {
    console.error("Order Creation Error:", err);
    res.status(500).json({ message: err.message });
  }
};

// =========================
// Verify Razorpay Payment & Save
// =========================
export const verifyAndSave = async (req, res) => {
  try {
    const {
      razorpay_order_id,
      razorpay_payment_id,
      razorpay_signature,
      roomId,
      amount,
      month,
    } = req.body;

    if (
      !razorpay_order_id ||
      !razorpay_payment_id ||
      !razorpay_signature ||
      !roomId ||
      !amount
    )
      return res.status(400).json({ message: "Missing required fields" });

    const room = await Room.findById(roomId);
    if (!room) return res.status(404).json({ message: "Room not found" });

    // Verify signature
    const generated_signature = crypto
      .createHmac("sha256", process.env.RAZORPAY_SECRET)
      .update(`${razorpay_order_id}|${razorpay_payment_id}`)
      .digest("hex");

    if (generated_signature !== razorpay_signature)
      return res.status(400).json({ message: "Payment verification failed" });

    // Payment verified, save in DB
    const payment = await Payment.create({
      roomId,
      tenantId: room.tenant?.userId,
      tenantName: room.tenant?.name,
      month,
      amount,
      paymentMethod: "razorpay",
      razorpayPaymentId: razorpay_payment_id,
      paidOn: new Date(),
    });

    res.json({ message: "Payment verified and saved", payment });
  } catch (err) {
    console.error("Payment verification error:", err);
    res.status(500).json({ message: err.message });
  }
};

// =========================
// Record Cash Payment (Admin)
// =========================
export const recordCashPayment = async (req, res) => {
  try {
    const { roomId, amount, month } = req.body;

    if (!roomId || !amount || !month)
      return res
        .status(400)
        .json({ message: "roomId, amount, month required" });

    const room = await Room.findById(roomId);
    if (!room) return res.status(404).json({ message: "Room not found" });

    const payment = await Payment.create({
      roomId,
      tenantId: room.tenant?.userId,
      tenantName: room.tenant?.name,
      month,
      amount,
      paymentMethod: "cash",
      paidOn: new Date(),
    });

    res.json({ message: "Cash payment recorded", payment });
  } catch (err) {
    console.error("Cash Payment Error:", err);
    res.status(500).json({ message: err.message });
  }
};

// =========================
// Get All Payments
// =========================
export const getPayments = async (req, res) => {
  try {
    const payments = await Payment.find()
      .populate("roomId")
      .sort({ paidOn: -1 });
    res.json(payments);
  } catch (err) {
    console.error("Get Payment Error:", err);
    res.status(500).json({ message: err.message });
  }
};
