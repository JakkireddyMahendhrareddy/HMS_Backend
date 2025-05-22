import express from "express";
import {
  addHostelInfo,
  deleteHostelInfo,
  getHostelInfo,
  updateHostelSpecificInfo,
} from "../controllers/hostelController.js";
import { auth } from "../middlewares/auth.js";
const router = express.Router();

// Hostel
router.post("/add", auth, addHostelInfo);

router.get("/view", auth, getHostelInfo);

router.patch("/edit", auth, updateHostelSpecificInfo);

router.delete("/remove", auth, deleteHostelInfo);

export default router;
