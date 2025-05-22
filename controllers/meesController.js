// import Mess from "../models/meesModel.js";

// // @desc    Get all mess details
// // @route   GET /api/mess
// export const getAllMess = async (req, res) => {
//   try {
//     const mess = await Mess.find();
//     res.status(200).json(mess);
//   } catch (error) {
//     res.status(500).json({ message: "Failed to fetch mess data", error });
//   }
// };

// // @desc    Get mess details by day
// // @route   GET /api/mess/:day
// export const getMessByDay = async (req, res) => {
//   const { day } = req.params;
//   try {
//     const mess = await Mess.findOne({ day });
//     if (!mess) {
//       return res.status(404).json({ message: "Mess data not found for this day" });
//     }
//     res.status(200).json(mess);
//   } catch (error) {
//     res.status(500).json({ message: "Error retrieving mess data", error });
//   }
// };

// // @desc    Create new mess entry
// // @route   POST /api/mess
// export const createMess = async (req, res) => {
//   const { day, meals } = req.body;
//   try {
//     const existing = await Mess.findOne({ day });
//     if (existing) {
//       return res.status(400).json({ message: "Mess menu already exists for this day" });
//     }

//     const mess = new Mess({ day, meals });
//     await mess.save();
//     res.status(201).json({ message: "Mess entry created successfully", mess });
//   } catch (error) {
//     res.status(500).json({ message: "Failed to create mess entry", error });
//   }
// };

// // @desc    Update mess entry by day
// // @route   PUT /api/mess/:day
// export const updateMess = async (req, res) => {
//   const { day } = req.params;
//   const { meals } = req.body;
//   try {
//     const updatedMess = await Mess.findOneAndUpdate(
//       { day },
//       { meals },
//       { new: true }
//     );
//     if (!updatedMess) {
//       return res.status(404).json({ message: "Mess data not found for this day" });
//     }
//     res.status(200).json({ message: "Mess menu updated", updatedMess });
//   } catch (error) {
//     res.status(500).json({ message: "Failed to update mess entry", error });
//   }
// };

// // @desc    Delete mess entry by day
// // @route   DELETE /api/mess/:day
// // export const deleteMess = async (req, res) => {
// //   const { day } = req.params;
// //   try {
// //     const deleted = await Mess.findOneAndDelete({ day });
// //     if (!deleted) {
// //       return res.status(404).json({ message: "Mess entry not found" });
// //     }
// //     res.status(200).json({ message: "Mess entry deleted", deleted });
// //   } catch (error) {
// //     res.status(500).json({ message: "Failed to delete mess entry", error });
// //   }
// // };

// // Backend controller function update
// export const deleteMess = async (req, res) => {
//   const { id } = req.params;  // Changed from 'day' to 'id'
  
//   try {
//     // Use findByIdAndDelete instead of findOneAndDelete
//     const deleted = await Mess.findByIdAndDelete(id);
    
//     if (!deleted) {
//       return res.status(404).json({ message: "Mess entry not found" });
//     }
    
//     res.status(200).json({ message: "Mess entry deleted", deleted });
//   } catch (error) {
//     console.error("Delete error:", error);
    
//     // Check if error is due to invalid ID format
//     if (error.name === 'CastError' && error.kind === 'ObjectId') {
//       return res.status(400).json({ message: "Invalid ID format" });
//     }
    
//     res.status(500).json({ message: "Failed to delete mess entry", error: error.message });
//   }
// };


import Mess from "../models/meesModel.js";

// @desc    Get all mess details
// @route   GET /api/mess
export const getAllMess = async (req, res) => {
  try {
    const mess = await Mess.find();
    res.status(200).json(mess);
  } catch (error) {
    console.error("Error fetching mess data:", error);
    res.status(500).json({ message: "Failed to fetch mess data", error: error.message });
  }
};

// @desc    Get mess details by ID
// @route   GET /api/mess/:id
export const getMessById = async (req, res) => {
  const { id } = req.params;
  
  try {
    const mess = await Mess.findById(id);
    
    if (!mess) {
      return res.status(404).json({ message: "Mess data not found" });
    }
    
    res.status(200).json(mess);
  } catch (error) {
    console.error("Error retrieving mess data:", error);
    
    if (error.name === 'CastError' && error.kind === 'ObjectId') {
      return res.status(400).json({ message: "Invalid ID format" });
    }
    
    res.status(500).json({ message: "Error retrieving mess data", error: error.message });
  }
};

// @desc    Get mess details by day (secondary lookup method)
// @route   GET /api/mess/day/:day
export const getMessByDay = async (req, res) => {
  const { day } = req.params;
  try {
    const mess = await Mess.findOne({ day });
    
    if (!mess) {
      return res.status(404).json({ message: "Mess data not found for this day" });
    }
    
    res.status(200).json(mess);
  } catch (error) {
    console.error("Error retrieving mess data by day:", error);
    res.status(500).json({ message: "Error retrieving mess data", error: error.message });
  }
};

// @desc    Create new mess entry
// @route   POST /api/mess
export const createMess = async (req, res) => {
  const { day, meals } = req.body;
  
  try {
    // We'll still check if a menu for this day already exists to prevent duplicates
    const existing = await Mess.findOne({ day });
    
    if (existing) {
      return res.status(400).json({ 
        message: "Mess menu already exists for this day",
        existingId: existing._id // Return the ID of the existing record
      });
    }
    
    const mess = new Mess({ day, meals });
    await mess.save();
    
    res.status(201).json({ 
      message: "Mess entry created successfully", 
      mess 
    });
  } catch (error) {
    console.error("Error creating mess entry:", error);
    res.status(500).json({ message: "Failed to create mess entry", error: error.message });
  }
};

// @desc    Update mess entry by ID
// @route   PUT /api/mess/:id
export const updateMess = async (req, res) => {
  const { id } = req.params;
  const { day, meals } = req.body;
  
  try {
    // If day is being changed, check it doesn't conflict with another entry
    if (day) {
      const existing = await Mess.findOne({ 
        day, 
        _id: { $ne: id } // Not equal to current ID
      });
      
      if (existing) {
        return res.status(400).json({ 
          message: "Another mess menu already exists for this day",
          existingId: existing._id
        });
      }
    }
    
    // Create update object with only provided fields
    const updateData = {};
    if (day) updateData.day = day;
    if (meals) updateData.meals = meals;
    
    const updatedMess = await Mess.findByIdAndUpdate(
      id,
      updateData,
      { new: true, runValidators: true }
    );
    
    if (!updatedMess) {
      return res.status(404).json({ message: "Mess data not found" });
    }
    
    res.status(200).json({ 
      message: "Mess menu updated", 
      updatedMess 
    });
  } catch (error) {
    console.error("Error updating mess entry:", error);
    
    if (error.name === 'CastError' && error.kind === 'ObjectId') {
      return res.status(400).json({ message: "Invalid ID format" });
    }
    
    res.status(500).json({ message: "Failed to update mess entry", error: error.message });
  }
};

// @desc    Delete mess entry by ID
// @route   DELETE /api/mess/:id
export const deleteMess = async (req, res) => {
  const { id } = req.params;
  
  try {
    const deleted = await Mess.findByIdAndDelete(id);
    
    if (!deleted) {
      return res.status(404).json({ message: "Mess entry not found" });
    }
    
    res.status(200).json({ 
      message: "Mess entry deleted", 
      deleted 
    });
  } catch (error) {
    console.error("Delete error:", error);
    
    if (error.name === 'CastError' && error.kind === 'ObjectId') {
      return res.status(400).json({ message: "Invalid ID format" });
    }
    
    res.status(500).json({ message: "Failed to delete mess entry", error: error.message });
  }
};