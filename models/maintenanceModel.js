import mongoose from "mongoose";

// Define the Maintenance Schema
const maintenanceSchema = new mongoose.Schema(
  {
    roomNo: {
      type: String,
      required: [true, "Room number is required"],
      trim: true,
    },
    issue: {
      type: String,
      required: [true, "Issue description is required"],
      trim: true,
    },
    
    remarks: {
      type: String,
      default: "",
    },
    
    priority: {
    type: String,
    enum: ['Low', 'Medium', 'High', 'Urgent'], // Make sure 'Urgent' is listed here
    required: true,
  },
  status: {
    type: String,
    enum: ['Pending', 'In Progress', 'Completed','Rejected'], // Make sure 'Completed' is listed
    default: 'Pending',
  },
    requestedBy: {
      type: String,
      required: [true, "Requester name is required"],
    },
    assignedTo: {
      type: String,
      default: "",
    },
    createdDate: {
      type: Date,
      default: Date.now,
    },
  },
  {
    timestamps: true, // Adds createdAt and updatedAt fields
  }
);

const Maintenance = mongoose.model("Maintenance", maintenanceSchema);

export default Maintenance;
