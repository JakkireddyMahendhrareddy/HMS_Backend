import express from 'express';
import {
  getAllMaintenance,
  getMaintenanceById,
  getMaintenanceByRoom,
  getMaintenanceByStatus,
  createMaintenance,
  updateMaintenance,
  deleteMaintenance,
  updateMaintenanceStatus,
  assignMaintenance
} from '../controllers/maintenanceController.js';

import { auth } from "../middlewares/auth.js";

const router = express.Router();

// Get all maintenance requests
router.get('/maintenance', getAllMaintenance);

// Get maintenance request by ID
router.get('/maintenance/:id', getMaintenanceById);

// Get maintenance requests by room number
router.get('/maintenance/room/:roomNo', getMaintenanceByRoom);

// Get maintenance requests by status
router.get('/maintenance/status/:status', getMaintenanceByStatus);

// Create new maintenance request
router.post('/maintenance', auth, createMaintenance);

// Update maintenance request by ID
router.put('/maintenance/edit/:id', auth, updateMaintenance);

// Delete maintenance request by ID
router.delete('/maintenance/delete/:id', auth, deleteMaintenance);

// Update status of maintenance request
router.put('/maintenance/status/:id', auth, updateMaintenanceStatus);

// Assign maintenance request to staff
router.put('/maintenance/assign/:id', auth, assignMaintenance);

export default router;