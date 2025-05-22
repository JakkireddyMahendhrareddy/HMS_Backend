// paymentController.js
import Payment from "../models/Payment.js";
import mongoose from "mongoose";

/**
 * Create a new payment record
 * @route POST /api/payments
 */
export const createPayment = async (req, res) => {
  try {
    const {
      tenantId,
      // ownerId,
      roomNumber,
      paymentDate,
      dueDate,
      rentAmount,
      paymentAmount,
      dueAmount,
      paymentMode,
      transactionId,
      remarks,
      rentStatus,
    } = req.body;

    // Validate required fields
    if (!tenantId || !roomNumber || !rentAmount) {
      //|| !ownerId
      return res.status(400).json({
        success: false,
        message: "Missing required fields",
      });
    }

    // Calculate due amount if not provided
    const calculatedDueAmount = dueAmount || rentAmount - paymentAmount || 0;

    // Set rent status based on due amount if not provided
    const calculatedRentStatus =
      rentStatus || (calculatedDueAmount > 0 ? "Due" : "Paid");

    const newPayment = new Payment({
      tenantId,
      // ownerId,
      roomNumber,
      paymentDate: paymentDate || new Date(),
      dueDate: dueDate || null,
      rentAmount,
      paymentAmount: paymentAmount || 0,
      dueAmount: calculatedDueAmount,
      paymentMode: paymentMode || "Cash",
      transactionId: transactionId || "",
      remarks: remarks || "",
      rentStatus: calculatedRentStatus,
    });

    const savedPayment = await newPayment.save();

    res.status(201).json({
      success: true,
      data: savedPayment,
    });
  } catch (error) {
    console.error("Error creating payment:", error);
    res.status(500).json({
      success: false,
      message: "Failed to create payment",
      error: error.message,
    });
  }
};

/**
 * Get all payments or filter by query parameters
 * @route GET /api/payments
 */
export const getPayments = async (req, res) => {
  try {
    const { tenantId, roomNumber, rentStatus, startDate, endDate } = req.query; // ownerId,

    // Build filter object based on query parameters
    const filter = {};

    if (tenantId) filter.tenantId = tenantId;
    // if (ownerId) filter.ownerId = ownerId;
    if (roomNumber) filter.roomNumber = roomNumber;
    if (rentStatus) filter.rentStatus = rentStatus;

    // Date range filter
    if (startDate || endDate) {
      filter.paymentDate = {};
      if (startDate) filter.paymentDate.$gte = new Date(startDate);
      if (endDate) filter.paymentDate.$lte = new Date(endDate);
    }

    // Only return active payments by default
    if (filter.isActive === undefined) {
      filter.isActive = true;
    }

    const payments = await Payment.find(filter)
      .sort({ paymentDate: -1 })
      .populate("tenantId", "name contact") // Assuming tenant model has these fields
      .exec();

    res.status(200).json({
      success: true,
      count: payments.length,
      data: payments,
    });
  } catch (error) {
    console.error("Error fetching payments:", error);
    res.status(500).json({
      success: false,
      message: "Failed to fetch payments",
      error: error.message,
    });
  }
};

/**
 * Get a single payment by ID
 * @route GET /api/payments/:id
 */
// Get transaction count by tenant ID
export const getPaymentsByTenantId = async (req, res) => {
  try {
    const { tenantId } = req.params;

    if (!mongoose.Types.ObjectId.isValid(tenantId)) {
      return res.status(400).json({
        success: false,
        message: "Invalid tenant ID format",
      });
    }

    // Find all payments for this tenant
    const payments = await Payment.find({ tenantId })
      .sort({ createdAt: -1 })
      .exec();

    return res.status(200).json({
      success: true,
      count: payments.length,
      data: payments,
    });
  } catch (error) {
    console.error("Error fetching tenant payments:", error);
    return res.status(500).json({
      success: false,
      message: "Failed to fetch tenant payments",
      error: error.message,
    });
  }
};

/**
 * Update payment by ID
 * @route PUT /api/payments/:id
 */
export const updatePayment = async (req, res) => {
  try {
    const { id } = req.params;
    const updateData = req.body;

    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({
        success: false,
        message: "Invalid payment ID format",
      });
    }

    // Calculate due amount if payment amount was updated
    if (
      updateData.paymentAmount !== undefined &&
      updateData.rentAmount !== undefined
    ) {
      updateData.dueAmount = updateData.rentAmount - updateData.paymentAmount;

      // Update rent status based on due amount
      updateData.rentStatus = updateData.dueAmount > 0 ? "Due" : "Paid";
    } else if (updateData.paymentAmount !== undefined) {
      // Get the current payment to access the rent amount
      const currentPayment = await Payment.findById(id);
      if (currentPayment) {
        updateData.dueAmount =
          currentPayment.rentAmount - updateData.paymentAmount;
        updateData.rentStatus = updateData.dueAmount > 0 ? "Due" : "Paid";
      }
    }

    const updatedPayment = await Payment.findByIdAndUpdate(id, updateData, {
      new: true,
      runValidators: true,
    });

    if (!updatedPayment) {
      return res.status(404).json({
        success: false,
        message: "Payment not found",
      });
    }

    res.status(200).json({
      success: true,
      data: updatedPayment,
    });
  } catch (error) {
    console.error("Error updating payment:", error);
    res.status(500).json({
      success: false,
      message: "Failed to update payment",
      error: error.message,
    });
  }
};

/**
 * Delete payment by ID (soft delete)
 * @route DELETE /api/payments/:id
 */
export const deletePayment = async (req, res) => {
  try {
    const { id } = req.params;

    // Validate transaction ID format
    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({
        success: false,
        message: "Invalid transaction ID format",
      });
    }

    // Find the payment first to get tenant info before deletion
    const payment = await Payment.findById(id);

    if (!payment) {
      return res.status(404).json({
        success: false,
        message: "Transaction not found",
      });
    }

    // Store tenant ID for potential updates
    const tenantId = payment.tenantId;

    // Delete the payment
    const deletedPayment = await Payment.findByIdAndDelete(id);

    if (!deletedPayment) {
      return res.status(404).json({
        success: false,
        message: "Transaction could not be deleted",
      });
    }

    // If you're tracking payment totals in the Tenant model,
    // you might need to update the tenant's payment status here
    // For example:
    /*
    if (tenantId) {
      // Recalculate tenant payment status
      const allPayments = await Payment.find({ tenantId });
      const totalPaid = allPayments.reduce((sum, payment) => sum + payment.paymentAmount, 0);
      
      // Update tenant's payment status if needed
      await Tenant.findByIdAndUpdate(tenantId, { 
        totalPaid,
        // Update other payment-related fields as needed
      });
    }
    */

    return res.status(200).json({
      success: true,
      message: "Transaction deleted successfully",
      data: deletedPayment,
    });
  } catch (error) {
    console.error("Error deleting transaction:", error);
    return res.status(500).json({
      success: false,
      message: "Failed to delete transaction",
      error: error.message,
    });
  }
};

/**
 * Hard delete payment by ID (for admin purposes)
 * @route DELETE /api/payments/:id/hard
 */
export const hardDeletePayment = async (req, res) => {
  try {
    const { id } = req.params;

    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({
        success: false,
        message: "Invalid payment ID format",
      });
    }

    const deletedPayment = await Payment.findByIdAndDelete(id);

    if (!deletedPayment) {
      return res.status(404).json({
        success: false,
        message: "Payment not found",
      });
    }

    res.status(200).json({
      success: true,
      message: "Payment permanently deleted",
    });
  } catch (error) {
    console.error("Error deleting payment:", error);
    res.status(500).json({
      success: false,
      message: "Failed to delete payment",
      error: error.message,
    });
  }
};
