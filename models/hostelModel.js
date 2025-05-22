import mongoose from "mongoose";
import { roomSchema } from "./roomModel.js";

const hostelSchema = new mongoose.Schema(
  {
    name: { type: String, required: true, trim: true },
    category: {
      type: String,
      required: true,
      enum: ["Men", "Women"],
      default: "Men",
    },
    maxCapacity: { type: Number, required: true },
    totalRooms: { type: Number, required: true },
    rooms: { type: [roomSchema], required: true },
    ownerId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
      unique: true,
    },
  },
  { timestamps: true }
);

export const Hostel =
  mongoose.models.Hostel || mongoose.model("Hostel", hostelSchema);
