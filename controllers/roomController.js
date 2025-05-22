import {
  validateRoomInfo,
  validateHostelWithOwnerId,
} from "../utils/validation.js";
export const getRoomsInfo = async (req, res) => {
  try {
    const { id } = req?.user;
    const hostelInfo = await validateHostelWithOwnerId(id);
    res.status(200).json(hostelInfo.rooms);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
};

export const addRoomInfo = async (req, res) => {
  try {
    const { id } = req.user;
    const { roomNumber, sharingType, rent, totalBeds, availableBeds } =
      req.body;
    if (
      roomNumber === undefined ||
      roomNumber === null ||
      sharingType === undefined ||
      sharingType === null ||
      rent === undefined ||
      rent === null ||
      totalBeds === undefined ||
      totalBeds === null ||
      availableBeds === undefined ||
      availableBeds === null
    ) {
      throw new Error("All Fields are Required");
    }
    if (availableBeds < 0) {
      throw new Error("Available Beds cannot be negative");
    }
    // console.log(req.body);
    const hostelInfo = await validateHostelWithOwnerId(id);

    // Rooms can't be added if max rooms exceeded

    if (hostelInfo.rooms.length >= hostelInfo.totalRooms) {
      throw new Error("Maximum Room Limit Exceeded");
    }

    // Check the room Number status if present no need to add the room
    const existingRoom = hostelInfo.rooms.find(
      (roomInfo) => roomInfo.roomNumber == roomNumber
    );

    if (existingRoom) {
      return res.status(403).json({
        message: `Room Number with ${existingRoom.roomNumber} Already Exists`,
      });
    } else {
      // Check the beds properly
      if (availableBeds > totalBeds) {
        return res.status(400).json({
          message: "Available Beds cannot be greater than Total Beds",
        });
      }

      hostelInfo?.rooms.push({
        roomNumber,
        sharingType,
        rent,
        totalBeds,
        availableBeds,
      });
      await hostelInfo.save();
      res.status(200).json({
        message: "Room Added Successfully",
        roomInfo: { roomNumber, sharingType, rent, totalBeds, availableBeds },
      });
    }
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
};

export const updateRoomInfo = async (req, res) => {
  try {
    const { sharingType, rent, totalBeds, availableBeds } = req.body;
    if (!validateRoomInfo(req)) {
      throw new Error(
        "Only sharingType, rent, totalBeds and availableBeds can be updated"
      );
    }
    const { id } = req.user;
    const hostelInfo = await validateHostelWithOwnerId(id);
    const { roomId } = req.params;
    const room = hostelInfo.rooms.find(
      (roomInfo) => roomInfo.roomNumber == roomId
    );

    if (!room) {
      throw new Error(`No Room Found with Room Number - ${roomId}`);
    }
    room.sharingType = sharingType;
    room.rent = rent;
    room.totalBeds = totalBeds;
    room.availableBeds = availableBeds;
    await hostelInfo.save();
    res.status(200).json({ message: "Room Updated Successfully" });
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
};

export const deleteRoomInfo = async (req, res) => {
  try {
    const { id } = req.user;
    const hostelInfo = await validateHostelWithOwnerId(id);
    const { roomId } = req.params;
    const room = hostelInfo.rooms.find(
      (roomInfo) => roomInfo.roomNumber == roomId
    );
    if (!room) {
      throw new Error(`No Room Found with Room Number - ${roomId}`);
    }
    hostelInfo.rooms = hostelInfo.rooms.filter(
      (roomInfo) => roomInfo.roomNumber != roomId
    );
    await hostelInfo.save();
    res.status(200).json({
      message: `Room ${roomId} Deleted Successfully`,
    });
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
};
