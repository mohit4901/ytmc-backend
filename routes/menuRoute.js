import express from "express";
import upload from "../middleware/multer.js";
import adminAuth from "../middleware/adminAuth.js";
import { addMenuItem, listMenuItems, updateMenuItem, getAllMenu , deleteMenuItem } from "../controllers/menuController.js";

const router = express.Router();

router.get("/all", getAllMenu);


// Public menu list
router.get("/list", listMenuItems);

// Admin CRUD
router.post("/add", adminAuth, upload.single("image"), addMenuItem);
router.patch("/update/:id", adminAuth, upload.single("image"), updateMenuItem);
router.delete("/delete/:id", adminAuth, deleteMenuItem);

export default router;
