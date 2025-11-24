import mongoose from "mongoose";

const userSchema = new mongoose.Schema(
  {
    name: { type: String, required: true },
    email: { type: String, unique: true, required: true },
    password: { type: String, required: true },
    role: { type: String, default: "user" },
    photo: { type: String, default: null },
    photoId: { type: String, default: null },
    phone: { type: String, default: null },
    address: { type: String, default: null },
    aadhar: { type: String, default: null },
    otherDocs: [{ type: String }],
  },
  { timestamps: true }
);

export default mongoose.model("User", userSchema);
