import express from "express";
import { auth } from "../middlewares/auth.js";
import {
  addTenantInfo,
  getAllTenantsInfo,
  getTenantsByRoom,
  updateTenantInfo,
  deleteTenantInfo,
  getTenantInfoById,
  searchTenants,
  generateTenantReports
} from "../controllers/tenantController.js";

const router = express.Router();

// All routes are protected with auth middleware
router.post("/add", auth, addTenantInfo);
router.get("/all", auth, getAllTenantsInfo);
router.get("/room/:roomNumber", auth, getTenantsByRoom);
router.get("/search", auth, searchTenants);
router.get("/reports", auth, generateTenantReports);
router.get("/:tenantId", auth, getTenantInfoById);
router.put("/update/:tenantId", auth, updateTenantInfo);
router.delete("/delete/:tenantId", auth, deleteTenantInfo);

export default router;