import express from "express";
import {
  deleteUserProfile,
  getUserProfile,
  updateUserProfile,
} from "../controllers/userController.js";
import { auth } from "../middlewares/auth.js";
import { upload } from "../middlewares/multer.js";

const router = express.Router();

router.get("/view-profile", auth, getUserProfile);

router.patch("/edit-profile",auth, upload.single("avatar"), updateUserProfile);

router.delete("/delete-profile", auth, deleteUserProfile);

export default router;
