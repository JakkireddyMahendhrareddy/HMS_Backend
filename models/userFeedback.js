import mongoose from "mongoose";

const userReviewSchema = mongoose.Schema(
  {
    name: { type: String, required: true },
    review: { type: String, required: true },
    rating: { type: Number, required: true },
  },
  { timestamps: true }
);

export const UserReview =
  mongoose.models.userReview || mongoose.model("userReview", userReviewSchema);
