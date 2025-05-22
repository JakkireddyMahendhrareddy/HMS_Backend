import express from "express";
import {
  addRoomInfo,
  deleteRoomInfo,
  getRoomsInfo,
  updateRoomInfo,
} from "../controllers/roomController.js";
import { auth } from "../middlewares/auth.js";
const roomRouter = express.Router();

roomRouter.get("/get", auth, getRoomsInfo);

roomRouter.post("/add", auth, addRoomInfo);

roomRouter.patch("/edit/:roomId", auth, updateRoomInfo);

roomRouter.delete("/remove/:roomId", auth, deleteRoomInfo);

export default roomRouter;
