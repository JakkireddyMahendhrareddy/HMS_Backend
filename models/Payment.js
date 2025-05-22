// Payment.js (Model file)
import mongoose from "mongoose";

const paymentSchema = new mongoose.Schema(
  {
    tenantId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Tenant",
      required: true,
    },
    // ownerId: {
    //   type: mongoose.Schema.Types.ObjectId,
    //   ref: "User",
    //   required: true,
    // },
    roomNumber: {
      type: String,
      required: true,
    },
    // Payment details
    paymentDate: {
      type: Date,
      default: Date.now,
    },
    dueDate: {
      type: Date,
      required: true,
    },
    rentAmount: {
      type: Number,
      required: true,
    },
    paymentAmount: {
      type: Number,
      required: true,
    },
    dueAmount: {
      type: Number,
      default: 0,
    },
    paymentMode: {
      type: String,
      enum: ["Cash", "UPI", "Bank Transfer", "Check", "Other"],
      required: true,
    },
    transactionId: {
      type: String,
      default: "",
    },
    remarks: {
      type: String,
      default: "",
    },
    rentStatus: {
      type: String,
      enum: ["Paid", "Due"],
      default: "Due",
    },
    // Status fields
    isActive: {
      type: Boolean,
      default: true,
    },
  },
  { timestamps: true }
);

// Create indexes for faster queries
paymentSchema.index({ tenantId: 1, dueDate: -1 });
// paymentSchema.index({ ownerId: 1, dueDate: -1 });

const Payment = mongoose.model("Payment", paymentSchema);
export default Payment;
