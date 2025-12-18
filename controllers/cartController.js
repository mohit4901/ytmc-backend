import userModel from "../models/userModel.js";

// Add to cart
export const addToCart = async (req, res) => {
  try {
    const { itemId } = req.body;
    const userId = req.userId;

    const user = await userModel.findById(userId);
    if (!user.cart) user.cart = [];

    user.cart.push({ itemId });

    await user.save();
    res.json({ success: true });
  } catch (err) {
    res.json({ success: false, message: err.message });
  }
};

// Remove from cart
export const removeFromCart = async (req, res) => {
  try {
    const { itemId } = req.body;
    const userId = req.userId;

    await userModel.findByIdAndUpdate(userId, {
      $pull: { cart: { itemId } }
    });

    res.json({ success: true });
  } catch (err) {
    res.json({ success: false, message: err.message });
  }
};

// Get user cart
export const getCart = async (req, res) => {
  try {
    const user = await userModel.findById(req.userId).populate("cart.itemId");
    res.json({ success: true, data: user.cart });
  } catch (err) {
    res.json({ success: false, message: err.message });
  }
};
