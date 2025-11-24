import User from "../models/User.js";
import TempUser from "../models/TempUser.js";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import { sendOTP } from "../utils/email.js";
import { v2 as cloudinary } from "cloudinary";

// STEP 1: Register → Save tempUser → Send OTP
export const register = async (req, res) => {
  try {
    const { name, email, password } = req.body;
    console.log(name, email, password);
    const exist = await User.findOne({ email });
    if (exist) return res.status(400).json({ error: "Email already exists" });

    const hashed = await bcrypt.hash(password, 10);
    const otp = Math.floor(100000 + Math.random() * 900000).toString();

    await TempUser.findOneAndDelete({ email });

    await TempUser.create({
      name,
      email,
      password: hashed,
      otp,
      otpExpires: Date.now() + 10 * 60 * 1000,
    });

    await sendOTP(email, otp, name);

    res.json({ message: "OTP sent to email" });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// STEP 2: Verify OTP → Create final user
export const verifyOTP = async (req, res) => {
  try {
    const { email, otp } = req.body;

    const tempUser = await TempUser.findOne({ email });
    if (!tempUser) return res.status(400).json({ error: "No temp user found" });

    if (tempUser.otp !== otp)
      return res.status(400).json({ error: "Invalid OTP" });

    if (tempUser.otpExpires < Date.now())
      return res.status(400).json({ error: "OTP expired" });

    const newUser = await User.create({
      name: tempUser.name,
      email,
      password: tempUser.password,
    });

    await TempUser.deleteOne({ email });

    res.json({ message: "Registration completed", user: newUser });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// LOGIN
export const login = async (req, res) => {
  try {
    const { email, password } = req.body;

    const user = await User.findOne({ email });
    if (!user) return res.status(404).json({ error: "Not registered" });

    const match = await bcrypt.compare(password, user.password);
    if (!match) return res.status(400).json({ error: "Wrong password" });

    const token = jwt.sign(
      { id: user._id, email: user.email, role: user.role },
      process.env.JWT_SECRET,
      { expiresIn: "7d" }
    );

    res.json({ token, user });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

export const updateProfile = async (req, res) => {
  try {
    const userId = req.user.id; // comes from authMiddleware
    const { phone, address, aadhar } = req.body;
    const file = req.file;

    const user = await User.findById(userId);
    if (!user) return res.status(404).json({ error: "User not found" });

    // Remove previous photo from Cloudinary if exists
    if (file && user.photoId) {
      await cloudinary.uploader.destroy(user.photoId);
    }

    let photoUrl = user.photo;
    let photoId = user.photoId;

    // Upload new photo if provided
    if (file) {
      const result = await cloudinary.uploader.upload(file.path, {
        folder: "user_photos",
      });
      photoUrl = result.secure_url;
      photoId = result.public_id;
    }

    // Update user info
    user.photo = photoUrl;
    user.photoId = photoId;
    user.phone = phone || user.phone;
    user.address = address || user.address;
    user.aadhar = aadhar || user.aadhar;

    await user.save();

    res.json({ message: "Profile updated successfully", user });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};
