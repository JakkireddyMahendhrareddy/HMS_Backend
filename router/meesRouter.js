import express from 'express';
import { 
  getAllMess, 
  getMessById,
  getMessByDay, 
  createMess, 
  updateMess, 
  deleteMess 
} from '../controllers/meesController.js';

import { auth } from "../middlewares/auth.js";

const router = express.Router();

// Get all mess menus
router.get('/mess', getAllMess);

// Get mess menu by ID
router.get('/mess/:id', getMessById);

// Additional route to get by day (keeping backward compatibility)
router.get('/mess/day/:day', getMessByDay);

// Create new mess menu
router.post('/mess', auth, createMess);

// Update mess menu by ID
router.put('/mess/edit/:id', auth, updateMess);

// Delete mess menu by ID
router.delete('/mess/delete/:id', auth, deleteMess);

export default router;