import mongoose from "mongoose";

const paymentSchema = new mongoose.Schema(
  {
    roomId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Room",
      required: true,
    },
    tenantId: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
    tenantName: { type: String },
    month: { type: String, required: true }, // e.g., "November-2025"
    amount: { type: Number, required: true },
    paymentMethod: {
      type: String,
      enum: ["online", "cash"],
      default: "online",
    },
    razorpayPaymentId: { type: String },
    paidOn: { type: Date, default: Date.now },
  },
  { timestamps: true }
);

export default mongoose.model("Payment", paymentSchema);
