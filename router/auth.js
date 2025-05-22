import express from "express";
import { userLogin, userRegistration } from "../controllers/authController.js";
const authRouter = express.Router();

authRouter.post("/register", userRegistration);

authRouter.post("/register", userRegistration);

authRouter.post("/login", userLogin);

// authRouter.post('/logout',auth,userLogout);

export default authRouter;
