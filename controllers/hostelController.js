//API for adding hostel Info

import { Hostel } from "../models/hostelModel.js";
import { User } from "../models/userModel.js";
import { validateHostelData } from "../utils/validation.js";

// API for Adding a Hostel
export const addHostelInfo = async (req, res) => {
  const { name, category, maxCapacity, totalRooms, rooms } = req.body;
  const { user } = req;

  try {
    // Validate data
    validateHostelData(req);
    const ownerId = user._id;
    if (!ownerId) {
      return res.status(404).json({ message: "You Need to Login First" });
    }
    const owner = await User.findById(ownerId);
    if (!owner) {
      return res.status(404).json({ message: "You don't have an Account" });
    }

    // Check if hostel already exists
    const existingHostel = await Hostel.findOne({ ownerId });
    if (existingHostel) {
      return res.status(400).json({
        message: `You had already added a Hostel named '${existingHostel.name}'`,
      });
    }

    // Save new hostel
    const newHostel = new Hostel({
      name,
      category,
      maxCapacity,
      totalRooms,
      rooms,
      ownerId,
    });
    await newHostel.save();

    res.status(200).json({ message: "Your Hostel Info Added Successfully" });
  } catch (err) {
    console.error("JWT Error:", err.message);
    res.status(400).json({ message: err.message });
  }
};

// API for Getting Hostel Info
export const getHostelInfo = async (req, res) => {
  try {
    const { id } = req.user;
    const hostel = await Hostel.findOne({ ownerId: id });
    if (!hostel) {
      throw new Error("No Hostel Found");
    }
    res.status(200).json({
      name: hostel.name,
      category: hostel.category,
      maxCapacity: hostel.maxCapacity,
      totalRooms: hostel.totalRooms,
    });
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
};

export const updateHostelSpecificInfo = async (req, res) => {
  try {
    const { id } = req.user;
    const { name, category, maxCapacity, totalRooms } = req.body;
    // if (!name || !category || !maxCapacity || !totalRooms) {
    //   throw new Error("All fields are required");
    // }
    const updatedHostel = await Hostel.findOneAndUpdate(
      { ownerId: id },
      { name, category, maxCapacity, totalRooms }
    );
    if (!updatedHostel) {
      throw new Error("No Hostel Found to Update");
    }
    res.status(200).json({ message: "Hostel Updated Successfully" });
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
};

export const deleteHostelInfo = async (req, res) => {
  try {
    const { id } = req.user;
    const hostel = await Hostel.findOneAndDelete({ ownerId: id });
    if (!hostel) {
      throw new Error("No Hostel Found to Remove");
    }
    res.status(200).json({ message: "Hostel Deleted Successfully" });
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
};


// import { Hostel } from "../models/hostelModel.js";
// import { User } from "../models/userModel.js";
// import { validateHostelData } from "../utils/validation.js";

// // ✅ Add Hostel Info
// export const addHostelInfo = async (req, res) => {
//   const { name, category, maxCapacity, totalRooms, rooms } = req.body;
//   const ownerId = req.user._id;

//   try {
//     // Validation
//     validateHostelData(req);

//     if (!ownerId) {
//       return res.status(401).json({ success: false, message: "You need to login first." });
//     }

//     const owner = await User.findById(ownerId);
//     if (!owner) {
//       return res.status(404).json({ success: false, message: "User account not found." });
//     }

//     const existingHostel = await Hostel.findOne({ ownerId });
//     if (existingHostel) {
//       return res.status(400).json({
//         success: false,
//         message: `You have already added a hostel named '${existingHostel.name}'.`,
//       });
//     }

//     const newHostel = new Hostel({
//       name,
//       category,
//       maxCapacity,
//       totalRooms,
//       rooms,
//       ownerId,
//     });

//     await newHostel.save();

//     res.status(201).json({ success: true, message: "Hostel info added successfully." });
//   } catch (err) {
//     console.error("Add Hostel Error:", err.message);
//     res.status(400).json({ success: false, message: err.message });
//   }
// };

// // ✅ Get Hostel Info
// export const getHostelInfo = async (req, res) => {
//   const ownerId = req.user._id;

//   try {
//     const hostel = await Hostel.findOne({ ownerId });
//     if (!hostel) {
//       return res.status(404).json({ success: false, message: "No hostel found." });
//     }

//     res.status(200).json({
//       success: true,
//       message: "Hostel found.",
//       data: hostel,
//     });
//   } catch (err) {
//     console.error("Get Hostel Error:", err.message);
//     res.status(400).json({ success: false, message: err.message });
//   }
// };

// // ✅ Update Hostel Info
// export const updateHostelSpecificInfo = async (req, res) => {
//   const ownerId = req.user._id;
//   const { name, category, maxCapacity, totalRooms } = req.body;

//   try {
//     const updatedHostel = await Hostel.findOneAndUpdate(
//       { ownerId },
//       { name, category, maxCapacity, totalRooms },
//       { new: true }
//     );

//     if (!updatedHostel) {
//       return res.status(404).json({ success: false, message: "No hostel found to update." });
//     }

//     res.status(200).json({
//       success: true,
//       message: "Hostel updated successfully.",
//       data: updatedHostel,
//     });
//   } catch (err) {
//     console.error("Update Hostel Error:", err.message);
//     res.status(400).json({ success: false, message: err.message });
//   }
// };

// // ✅ Delete Hostel Info
// export const deleteHostelInfo = async (req, res) => {
//   const ownerId = req.user._id;

//   try {
//     const deletedHostel = await Hostel.findOneAndDelete({ ownerId });

//     if (!deletedHostel) {
//       return res.status(404).json({ success: false, message: "No hostel found to delete." });
//     }

//     res.status(200).json({ success: true, message: "Hostel deleted successfully." });
//   } catch (err) {
//     console.error("Delete Hostel Error:", err.message);
//     res.status(400).json({ success: false, message: err.message });
//   }
// };

