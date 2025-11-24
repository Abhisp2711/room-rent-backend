import mongoose from "mongoose";

const roomSchema = new mongoose.Schema(
  {
    roomNumber: { type: String, required: true, unique: true },
    monthlyRent: { type: Number, required: true },
    isAvailable: { type: Boolean, default: true },
    photos: [
      {
        url: { type: String },
        public_id: { type: String },
      },
    ],
    tenant: {
      userId: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
      name: { type: String },
      email: { type: String },
      startDate: { type: Date },
    },
  },
  { timestamps: true }
);

export default mongoose.model("Room", roomSchema);
