import Review from "../models/reviewModel.js";

// GET all reviews
export const getReviews = async (req, res) => {
  try {
    const reviews = await Review.find().sort({ createdAt: -1 });
    res.json(reviews);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// POST new review
export const addReview = async (req, res) => {
  try {
    const { name, stars, text } = req.body;

    if (!name || !stars || !text) {
      return res.status(400).json({ message: "All fields required" });
    }

    const review = await Review.create({ name, stars, text });
    res.status(201).json(review);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};
