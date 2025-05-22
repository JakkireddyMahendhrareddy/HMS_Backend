import mongoose from "mongoose";

const tenantSchema = new mongoose.Schema(
  {
    tenantName: { type: String, required: true }, // Full Name
    dateOfBirth: { type: Date, required: true },
    contact: {
      type: String,
      required: true,
      match: [/^[0-9]{10}$/, "Please enter a valid 10-digit phone number"],
    },
    email: { type: String, default: "" },
    aadhaarNumber: {
      type: String,
      required: true,
      match: [/^[0-9]{12}$/, "Please enter a valid 12-digit Aadhaar number"],
    },
    passportPhoto: { type: String, required: true }, // URL or file path
    aadhaarFront: { type: String, required: true },
    aadhaarBack: { type: String, required: true },
    digitalSignature: { type: String, required: true },

    // Permanent Address
    permanentAddress: {
      street: { type: String, required: true },
      city: { type: String, required: true },
      state: { type: String, required: true },
      pincode: { type: String, required: true },
    },

    // Current Address (optional if same as permanent)
    isCurrentAddressSame: { type: Boolean, default: true },
    currentAddress: {
      street: { type: String },
      city: { type: String },
      state: { type: String },
      pincode: { type: String },
    },

    // Emergency Contact
    emergencyContact: {
      name: { type: String, required: true },
      relationship: { type: String, required: true },
      mobile: {
        type: String,
        required: true,
        match: [/^[0-9]{10}$/, "Please enter a valid 10-digit phone number"],
      },
    },

    // Accommodation Details
    roomNumber: { type: String, required: true }, // updated from Number to String
    moveInDate: { type: Date, required: true },
    agreementStartDate: { type: Date, required: true },
    rentAmount: { type: Number, required: true },

    // Legal
    policeVerificationConsent: { type: Boolean, default: true },
    termsAgreement: { type: Boolean, default: true },

    // Reference to owner
    ownerId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
  },
  { timestamps: true }
);

const Tenant = mongoose.model("Tenant", tenantSchema);
export default Tenant;
