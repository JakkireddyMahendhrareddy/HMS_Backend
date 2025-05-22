import mongoose from "mongoose";
import validator from "validator";
const userSchema = mongoose.Schema(
  {
    avatarUrl: {
      type: String,
      default:
        "https://www.shutterstock.com/image-vector/vector-design-avatar-dummy-sign-600nw-1290556063.jpg",
    },
    name: { type: String, required: true, trim: true },
    email: {
      type: String,
      trim: true,
      lowercase: true,
      unique: true,
      required: true,
      validate(value) {
        if (!validator.isEmail(value)) {
          throw new Error("Invalid Email");
        }
      },
    },
    mobileNumber: {
      type: String,
      required: true,
      maxLength: 10,
      trim: true,
      validate(value) {
        if (!validator.isMobilePhone(value, "en-IN")) {
          throw new Error("Invalid Mobile Number");
        }
      },
    },
    password: {
      type: String,
      required: true,
      trim: true,
    },
  },
  { timestamps: true }
);

export const User = mongoose.models.User || mongoose.model("User", userSchema);
