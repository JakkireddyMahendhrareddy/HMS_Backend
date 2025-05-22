import multer from "multer";
import path from "path";
import crypto from "crypto";

const storage = multer.diskStorage({
  destination: "./uploads",

  filename: function (req, file, cb) {
    const fileName =
      crypto.randomBytes(12).toString("hex") + path.extname(file.originalname);
     
    cb(null, fileName);
  },
});

// Multer instance
export const upload = multer({ storage });
