import mongoose from "mongoose";

export const roomSchema = new mongoose.Schema({
  roomNumber: { type: String, required: true },
  sharingType: { type: String, required: true },
  rent: { type: Number, required: true },
  totalBeds: { type: Number, required: true },
  availableBeds: {
    type: Number,
    required: true,
    validate: function (value) {
      return value <= this.totalBeds;
    },
    message: "Available Beds cannot be greater than Total Beds",
  },
});
