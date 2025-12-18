import userModel from "../models/userModel.js";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";

// Generate JWT
const generateToken = (user) => {
  return jwt.sign(
    { id: user._id, role: user.role },
    process.env.JWT_SECRET,
    { expiresIn: "7d" }
  );
};
export const registerUser = async (req, res) => {
  try {
   
    if (!req.body || Object.keys(req.body).length === 0) {
      return res.json({
        success: false,
        message: "Empty request body. Send name, email, password."
      });
    }

    const { name, email, password } = req.body;

    if (!name || !email || !password) {
      return res.json({
        success: false,
        message: "name, email, password are required."
      });
    }

    const exist = await userModel.findOne({ email });
    if (exist) return res.json({ success: false, message: "Email already exists" });

    const hashed = await bcrypt.hash(password, 10);

    const newUser = await userModel.create({ name, email, password: hashed });

    res.json({ success: true, token: generateToken(newUser) });

  } catch (err) {
    res.json({ success: false, message: err.message });
  }
};


export const loginUser = async (req, res) => {
  try {
    const { email, password } = req.body;

    const user = await userModel.findOne({ email });
    if (!user) return res.json({ success: false, message: "User not found" });

    const match = await bcrypt.compare(password, user.password);
    if (!match) return res.json({ success: false, message: "Incorrect password" });

    res.json({ success: true, token: generateToken(user) });
  } catch (err) {
    res.json({ success: false, message: err.message });
  }
};

export const adminLogin = async (req, res) => {
  try {
    const { email, password } = req.body;

    const admin = await userModel.findOne({ email, role: "admin" });
    if (!admin) return res.json({ success: false, message: "Admin not found" });

    const match = await bcrypt.compare(password, admin.password);
    if (!match) return res.json({ success: false, message: "Incorrect password" });

    res.json({ success: true, token: generateToken(admin) });
  } catch (err) {
    res.json({ success: false, message: err.message });
  }
};

