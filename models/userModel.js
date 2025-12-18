import mongoose from "mongoose";

const userSchema = new mongoose.Schema({
  name: { type: String, trim: true, required: true },
  email: { type: String, trim: true, required: true, unique: true },
  password: { type: String, required: true },
  role: { type: String, enum: ["user", "admin"], default: "user" },
  phone: { type: String, default: "" },
  address: { type: String, default: "" }
}, { timestamps: true });

const userModel = mongoose.models.User || mongoose.model("User", userSchema);
export default userModel;
