import Maintenance from "../models/maintenanceModel.js";

// @desc    Get all maintenance requests
// @route   GET /api/maintenance
export const getAllMaintenance = async (req, res) => {
  try {
    // Support filtering by status if provided in query
    const filter = {};
    if (req.query.status) {
      filter.status = req.query.status;
    }
    if (req.query.roomNo) {
      filter.roomNo = req.query.roomNo;
    }
    
    const maintenance = await Maintenance.find(filter).sort({ createdAt: -1 });
    res.status(200).json(maintenance);
  } catch (error) {
    console.error("Error fetching maintenance data:", error);
    res.status(500).json({ message: "Failed to fetch maintenance data", error: error.message });
  }
};

// @desc    Get maintenance request by ID
// @route   GET /api/maintenance/:id
export const getMaintenanceById = async (req, res) => {
  const { id } = req.params;

  if (!mongoose.Types.ObjectId.isValid(id)) {
    return res.status(400).json({ message: "Invalid ID format" });
  }

  try {
    const maintenance = await Maintenance.findById(id);

    if (!maintenance) {
      return res.status(404).json({ message: "Maintenance request not found" });
    }

    res.status(200).json(maintenance);
  } catch (error) {
    console.error("Error retrieving maintenance request:", error);
    res.status(500).json({ message: "Error retrieving maintenance request", error: error.message });
  }
};

// @desc    Get maintenance requests by room number
// @route   GET /api/maintenance/room/:roomNo
export const getMaintenanceByRoom = async (req, res) => {
  const { roomNo } = req.params;
  
  try {
    const maintenance = await Maintenance.find({ roomNo }).sort({ createdAt: -1 });
    
    if (maintenance.length === 0) {
      return res.status(404).json({ message: "No maintenance requests found for this room" });
    }
    
    res.status(200).json(maintenance);
  } catch (error) {
    console.error("Error retrieving maintenance requests by room:", error);
    res.status(500).json({ message: "Error retrieving maintenance requests", error: error.message });
  }
};

// @desc    Get maintenance requests by status
// @route   GET /api/maintenance/status/:status
export const getMaintenanceByStatus = async (req, res) => {
  const { status } = req.params;
  
  try {
    const maintenance = await Maintenance.find({ status }).sort({ createdAt: -1 });
    
    if (maintenance.length === 0) {
      return res.status(404).json({ message: `No maintenance requests with status '${status}' found` });
    }
    
    res.status(200).json(maintenance);
  } catch (error) {
    console.error("Error retrieving maintenance requests by status:", error);
    res.status(500).json({ message: "Error retrieving maintenance requests", error: error.message });
  }
};

// @desc    Create new maintenance request
// @route   POST /api/maintenance
export const createMaintenance = async (req, res) => {
  const { roomNo, issue, requestedBy, priority, remarks, assignedTo } = req.body;
  
  try {
    const maintenanceRequest = new Maintenance({
      roomNo,
      issue,
      requestedBy,
      priority: priority || 'Medium',
      remarks: remarks || '',
      assignedTo: assignedTo || ''
    });
    
    await maintenanceRequest.save();
    
    res.status(201).json({ 
      message: "Maintenance request created successfully", 
      maintenanceRequest 
    });
  } catch (error) {
    console.error("Error creating maintenance request:", error);
    res.status(500).json({ message: "Failed to create maintenance request", error: error.message });
  }
};

// @desc    Update maintenance request by ID
// @route   PUT /api/maintenance/:id
export const updateMaintenance = async (req, res) => {
  const { id } = req.params;
  const updateData = { ...req.body };
  
  // If status is being set to 'Resolved', add completion date
  if (updateData.status === 'Resolved' && !updateData.createdDate) {
    updateData.createdDate = new Date();
  }
  
  try {
    const updatedMaintenance = await Maintenance.findByIdAndUpdate(
      id,
      updateData,
      { new: true, runValidators: true }
    );
    
    if (!updatedMaintenance) {
      return res.status(404).json({ message: "Maintenance request not found" });
    }
    
    res.status(200).json({ 
      message: "Maintenance request updated", 
      updatedMaintenance 
    });
  } catch (error) {
    console.error("Error updating maintenance request:", error);
    
    if (error.name === 'CastError' && error.kind === 'ObjectId') {
      return res.status(400).json({ message: "Invalid ID format" });
    }
    
    res.status(500).json({ message: "Failed to update maintenance request", error: error.message });
  }
};

// @desc    Delete maintenance request by ID
// @route   DELETE /api/maintenance/:id
export const deleteMaintenance = async (req, res) => {
  const { id } = req.params;
  
  try {
    const deleted = await Maintenance.findByIdAndDelete(id);
    
    if (!deleted) {
      return res.status(404).json({ message: "Maintenance request not found" });
    }
    
    res.status(200).json({ 
      message: "Maintenance request deleted", 
      deleted 
    });
  } catch (error) {
    console.error("Delete error:", error);
    
    if (error.name === 'CastError' && error.kind === 'ObjectId') {
      return res.status(400).json({ message: "Invalid ID format" });
    }
    
    res.status(500).json({ message: "Failed to delete maintenance request", error: error.message });
  }
};

// @desc    Change status of maintenance request
// @route   PATCH /api/maintenance/:id/status
export const updateMaintenanceStatus = async (req, res) => {
  const { id } = req.params;
  const { status } = req.body;
  
  if (!status) {
    return res.status(400).json({ message: "Status is required" });
  }
  
  try {
    const updateData = { status };
    
    // If status is being set to 'Resolved', add completion date
    if (status === 'Resolved') {
      updateData.createdDate = new Date();
    }
    
    const updatedMaintenance = await Maintenance.findByIdAndUpdate(
      id,
      updateData,
      { new: true, runValidators: true }
    );
    
    if (!updatedMaintenance) {
      return res.status(404).json({ message: "Maintenance request not found" });
    }
    
    res.status(200).json({ 
      message: `Maintenance request status updated to ${status}`, 
      updatedMaintenance 
    });
  } catch (error) {
    console.error("Error updating maintenance status:", error);
    
    if (error.name === 'CastError' && error.kind === 'ObjectId') {
      return res.status(400).json({ message: "Invalid ID format" });
    }
    
    res.status(500).json({ message: "Failed to update maintenance status", error: error.message });
  }
};

// @desc    Assign maintenance request to staff
// @route   PATCH /api/maintenance/:id/assign
export const assignMaintenance = async (req, res) => {
  const { id } = req.params;
  const { assignedTo } = req.body;
  
  if (!assignedTo) {
    return res.status(400).json({ message: "Assigned to field is required" });
  }
  
  try {
    const updateData = { 
      assignedTo,
      status: 'In Progress' // Automatically update status to In Progress when assigned
    };
    
    const updatedMaintenance = await Maintenance.findByIdAndUpdate(
      id,
      updateData,
      { new: true, runValidators: true }
    );
    
    if (!updatedMaintenance) {
      return res.status(404).json({ message: "Maintenance request not found" });
    }
    
    res.status(200).json({ 
      message: `Maintenance request assigned to ${assignedTo}`, 
      updatedMaintenance 
    });
  } catch (error) {
    console.error("Error assigning maintenance request:", error);
    
    if (error.name === 'CastError' && error.kind === 'ObjectId') {
      return res.status(400).json({ message: "Invalid ID format" });
    }
    
    res.status(500).json({ message: "Failed to assign maintenance request", error: error.message });
  }
};
