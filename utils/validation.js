import { Hostel } from "../models/hostelModel.js";
import validator from "validator";
export const validateUserSignUpData = (req) => {
  const { name, email, password, mobileNumber } = req.body;

  if (!name || !email || !password || !mobileNumber) {
    throw new Error("All fields are required");
  } else if (!validator.isEmail(email)) {
    throw new Error("Invalid Email");
  } else if (!validator.isStrongPassword(password)) {
    throw new Error("Password is not strong enough");
  } else if (!validator.isMobilePhone(mobileNumber, "en-IN")) {
    throw new Error("Invalid Mobile Number");
  } else if (!validator.isLength(mobileNumber, { min: 10, max: 10 })) {
    throw new Error("Invalid Mobile Number");
  }
};

export const validateHostelData = (req) => {
  const { name, category, maxCapacity, totalRooms } = req.body;
  if (!name || !category || !maxCapacity || !totalRooms) {
    throw new Error("All fields are required");
  }
};

export const validateUserProfileInputData = (req) => {
  const { name, avatarUrl, mobileNumber } = req.body;
  const ALLOWED_FIELDS = ["name", "avatarUrl", "mobileNumber"];
  const isUserAllowed = Object.keys(req.body).every((key) =>
    ALLOWED_FIELDS.includes(key)
  );
  return isUserAllowed;
};

export const validateRoomInfo = (req) => {
  const { sharingType, rent, totalBeds, availableBeds } = req.body;
  const ALLOWED_FIELDS = ["sharingType", "rent", "totalBeds", "availableBeds"];
  const isEditAllowed = Object.keys(req.body).every((key) =>
    ALLOWED_FIELDS.includes(key)
  );
  if (
    sharingType === undefined ||
    sharingType === null ||
    rent === undefined ||
    rent === null ||
    totalBeds === undefined ||
    totalBeds === null ||
    availableBeds === undefined ||
    availableBeds === null
  ) {
    throw new Error("All Fields are Required");
  }
  return isEditAllowed;
};

export const validateHostelWithOwnerId = async (ownerId) => {
  const hostelInfo = await Hostel.findOne({ ownerId });
  if (!hostelInfo) {
    throw new Error("No Hostel Found");
  }

  return hostelInfo;
};

export const validateTenantData = (req) => {
  const {
    tenantName,
    roomNumber,
    moveInDate, // Primary field for move-in date
    joinDate, // Support legacy field
    rentAmount,
    contact,
    dateOfBirth,
    email,
    aadhaarNumber,
    passportPhoto,
    aadhaarFront,
    aadhaarBack,
    digitalSignature,
    permanentAddress,
    isCurrentAddressSame,
    currentAddress,
    emergencyContact,
    agreementStartDate,
    policeVerificationConsent,
    termsAgreement,
  } = req.body;

  // Essential fields validation - these must always be present
  if (!tenantName) throw new Error("Tenant name is required.");
  if (!roomNumber) throw new Error("Room number is required.");
  if (!moveInDate && !joinDate) throw new Error("Move-in date is required."); // Support both field names
  if (!rentAmount) throw new Error("Rent amount is required.");
  if (!contact) throw new Error("Contact number is required.");

  // Format validations for essential fields
  if (contact && !/^[0-9]{10}$/.test(contact)) {
    throw new Error("Contact must be a 10-digit number.");
  }

  // Validate additional fields only if they're provided
  // This makes these fields optional but validates them if present

  // Aadhaar validation - optional but validate format if provided
  if (aadhaarNumber && !/^[0-9]{12}$/.test(aadhaarNumber)) {
    throw new Error("Aadhaar number must be a 12-digit number.");
  }

  // Date validations - check if they're valid dates when provided
  try {
    if (moveInDate) new Date(moveInDate);
    if (joinDate) new Date(joinDate);
    if (dateOfBirth) new Date(dateOfBirth);
    if (agreementStartDate) new Date(agreementStartDate);
  } catch (e) {
    throw new Error("One or more date fields have invalid format.");
  }

  // Email validation if provided
  if (email && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
    throw new Error("Invalid email format.");
  }

  // Permanent address validation - only if provided
  if (permanentAddress) {
    if (!permanentAddress.street)
      throw new Error("Street address is required in permanent address.");
    if (!permanentAddress.city)
      throw new Error("City is required in permanent address.");
    if (!permanentAddress.state)
      throw new Error("State is required in permanent address.");
    if (!permanentAddress.pincode)
      throw new Error("Pincode is required in permanent address.");
  }

  // Current address validation - only if provided and not same as permanent
  if (!isCurrentAddressSame && currentAddress) {
    if (!currentAddress.street)
      throw new Error("Street address is required in current address.");
    if (!currentAddress.city)
      throw new Error("City is required in current address.");
    if (!currentAddress.state)
      throw new Error("State is required in current address.");
    if (!currentAddress.pincode)
      throw new Error("Pincode is required in current address.");
  }

  // Emergency contact validation - only if provided
  if (emergencyContact) {
    if (!emergencyContact.name)
      throw new Error("Emergency contact name is required.");
    if (!emergencyContact.relationship)
      throw new Error("Emergency contact relationship is required.");
    if (!emergencyContact.mobile)
      throw new Error("Emergency contact mobile number is required.");

    if (
      emergencyContact.mobile &&
      !/^[0-9]{10}$/.test(emergencyContact.mobile)
    ) {
      throw new Error("Emergency contact mobile must be a 10-digit number.");
    }
  }
};

import { createError } from "../utils/error.js";

// Validate payment data
export const validatePaymentData = (req) => {
  const { tenantId, paymentAmount, paymentMode, transactionId, remarks } =
    req.body;

  // Essential fields validation
  if (!tenantId) throw new Error("Tenant ID is required.");
  if (!paymentAmount) throw new Error("Payment amount is required.");
  if (!paymentMode) throw new Error("Payment mode is required.");

  // Validate payment amount is a positive number
  if (
    paymentAmount &&
    (!Number.isFinite(Number(paymentAmount)) || Number(paymentAmount) <= 0)
  ) {
    throw new Error("Payment amount must be a positive number.");
  }

  // Validate payment mode
  const validPaymentModes = ["Cash", "UPI", "Bank Transfer", "Check", "Other"];
  if (paymentMode && !validPaymentModes.includes(paymentMode)) {
    throw new Error(
      `Payment mode must be one of: ${validPaymentModes.join(", ")}.`
    );
  }

  // Validate transaction ID format if provided for electronic payments
  if (paymentMode !== "Cash" && paymentMode !== "Other" && !transactionId) {
    throw new Error("Transaction ID is required for electronic payments.");
  }

  // Optional field validation
  if (remarks && remarks.length > 500) {
    throw new Error("Remarks must be less than 500 characters.");
  }
};

// Validate update payment data
export const validateUpdatePaymentData = (req) => {
  const { paymentAmount, paymentMode, transactionId, remarks } = req.body;

  const ALLOWED_FIELDS = [
    "paymentAmount",
    "paymentMode",
    "transactionId",
    "remarks",
  ];

  // Check if all fields in request are allowed
  const isUpdateAllowed = Object.keys(req.body).every((key) =>
    ALLOWED_FIELDS.includes(key)
  );

  if (!isUpdateAllowed) {
    throw new Error("One or more fields are not allowed for update.");
  }

  // If fields are present, validate them
  if (paymentAmount !== undefined) {
    if (!Number.isFinite(Number(paymentAmount)) || Number(paymentAmount) <= 0) {
      throw new Error("Payment amount must be a positive number.");
    }
  }

  if (paymentMode !== undefined) {
    const validPaymentModes = [
      "Cash",
      "UPI",
      "Bank Transfer",
      "Check",
      "Other",
    ];
    if (!validPaymentModes.includes(paymentMode)) {
      throw new Error(
        `Payment mode must be one of: ${validPaymentModes.join(", ")}.`
      );
    }
  }

  if (remarks !== undefined && remarks.length > 500) {
    throw new Error("Remarks must be less than 500 characters.");
  }

  return isUpdateAllowed;
};

// Validate date range for payment queries
export const validateDateRange = (req) => {
  const { startDate, endDate } = req.query;

  if (!startDate || !endDate) {
    throw new Error("Both start date and end date are required.");
  }

  // Check if dates are valid
  try {
    new Date(startDate);
    new Date(endDate);
  } catch (e) {
    throw new Error("Invalid date format. Use YYYY-MM-DD format.");
  }

  // Check if start date is before end date
  if (new Date(startDate) > new Date(endDate)) {
    throw new Error("Start date must be before end date.");
  }

  // Check if date range is not more than 1 year
  const oneYearInMs = 365 * 24 * 60 * 60 * 1000;
  if (new Date(endDate) - new Date(startDate) > oneYearInMs) {
    throw new Error("Date range cannot be more than 1 year.");
  }
};
