import Room from "../models/Room.js";
import { v2 as cloudinary } from "cloudinary";

// ------------------- ADMIN CONTROLLERS -------------------

// CREATE ROOM (Admin Only)
export const createRoom = async (req, res) => {
  try {
    const { roomNumber, monthlyRent } = req.body;

    if (!roomNumber || !monthlyRent) {
      return res
        .status(400)
        .json({ error: "Room number and monthly rent required" });
    }

    const exists = await Room.findOne({ roomNumber });
    if (exists)
      return res.status(400).json({ error: "Room number already exists" });

    let photos = [];
    if (req.files) {
      for (const file of req.files) {
        const uploaded = await cloudinary.uploader.upload(file.path, {
          folder: "room_photos",
        });
        photos.push({
          url: uploaded.secure_url,
          public_id: uploaded.public_id,
        });
      }
    }

    const room = await Room.create({ roomNumber, monthlyRent, photos });

    res.json({ message: "Room added successfully", room });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// ASSIGN TENANT (Admin only)
export const assignTenant = async (req, res) => {
  try {
    const roomId = req.params.id;
    const { userId, name, email, startDate } = req.body;

    const room = await Room.findById(roomId);
    if (!room) return res.status(404).json({ error: "Room not found" });
    if (!room.isAvailable)
      return res.status(400).json({ error: "Room already occupied" });

    room.tenant = { userId, name, email, startDate };
    room.isAvailable = false;
    await room.save();

    res.json({ message: "Tenant assigned successfully", room });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// UNASSIGN TENANT (Admin only )

export const unassignTenant = async (req, res) => {
  try {
    const roomId = req.params.id;

    const room = await Room.findById(roomId);
    if (!room) return res.status(404).json({ error: "Room not found" });

    if (room.isAvailable) {
      return res.status(400).json({ error: "Room is already empty" });
    }

    room.tenant = null;
    room.isAvailable = true;

    await room.save();

    res.json({ message: "Tenant unassigned successfully ", room });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// UPDATE ROOM (Admin)
export const updateRoom = async (req, res) => {
  try {
    const updated = await Room.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
    });
    if (!updated) return res.status(404).json({ error: "Room not found" });
    res.json({ message: "Room updated", room: updated });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// DELETE ROOM (Admin)
export const deleteRoom = async (req, res) => {
  try {
    const room = await Room.findById(req.params.id);
    if (!room) return res.status(404).json({ error: "Room not found" });

    if (room.photos && room.photos.length > 0) {
      for (const photo of room.photos) {
        if (photo.public_id) {
          await cloudinary.uploader.destroy(photo.public_id);
        }
      }
    }

    await Room.findByIdAndDelete(req.params.id);

    res.json({ message: "Room and its images deleted successfully" });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// ------------------- PUBLIC CONTROLLERS -------------------

// GET ALL ROOMS (Public)
export const getAllRooms = async (req, res) => {
  try {
    const rooms = await Room.find().lean();

    const formattedRooms = rooms.map((room) => ({
      id: room._id,
      roomNumber: room.roomNumber,
      monthlyRent: room.monthlyRent,
      isAvailable: room.isAvailable,
      status: room.isAvailable ? "Available" : "Occupied",
      tenant: room.tenant?.name || null,
      photos: room.photos?.map((p) => p.url) || [], // <-- ADDED
    }));

    res.json(formattedRooms);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// GET SINGLE ROOM (Public)
export const getRoomById = async (req, res) => {
  try {
    const room = await Room.findById(req.params.id).lean();
    if (!room) return res.status(404).json({ error: "Room not found" });

    const formattedRoom = {
      id: room._id,
      roomNumber: room.roomNumber,
      monthlyRent: room.monthlyRent,
      isAvailable: room.isAvailable,
      status: room.isAvailable ? "Available" : "Occupied",
      tenant: room.tenant?.name || null,
      photos: room.photos?.map((p) => p.url) || [],
    };

    res.json(formattedRoom);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};
