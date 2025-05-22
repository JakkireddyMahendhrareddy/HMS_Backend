// paymentRoutes.js
import express from "express";
import {
  createPayment,
  getPayments,
  getPaymentsByTenantId,
  updatePayment,
  deletePayment,
  hardDeletePayment,
} from "../controllers/paymentController.js";

const router = express.Router();

// Create new payment
router.post("/create/", createPayment);

// Get all payments with filters
router.get("/", getPayments);

// Get payment by ID
router.get("/tenant/:tenantId", getPaymentsByTenantId);

// Update payment
router.put("/edit/:id", updatePayment);

// Soft delete payment (set isActive to false)
router.delete("/delete/:id", deletePayment);

// Hard delete payment (admin only)
router.delete("/:id/hard", hardDeletePayment);

export default router;
