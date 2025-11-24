import mongoose from "mongoose";

const tempUserSchema = new mongoose.Schema({
  name: String,
  email: { type: String, unique: true },
  password: String,
  otp: String,
  otpExpires: Date,
});

export default mongoose.model("TempUser", tempUserSchema);
