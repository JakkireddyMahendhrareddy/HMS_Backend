import { UserReview } from "../models/userFeedback.js";

export const createCustomerReview = async (req, res) => {
  try {
    const { name, rating, review } = req.body;
    if(!name || !rating || !review) {
        return res.status(400).json({ message: "All fields are required" });
    }
    if (review.length > 140) {
      return res
        .status(400)
        .json({ message: "Review should be less than 140 characters" });
    }
    
    const newCustomerReview = new UserReview({
      name,
      rating,
      review,
    });
    await newCustomerReview.save();
    res.status(200).json({ message: "Thank You for your Review" });
  } catch (error) {
    res.status(500).json({ message: "Something Went Wrong" });
  }
};

export const getCustomerReviews = async (req, res) => {
  try {
    const customerReviews = await UserReview.find({});
    res.status(200).json(customerReviews);
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: "Internal Server Error" });
  }
};