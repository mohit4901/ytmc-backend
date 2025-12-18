import express from "express";
import upload from "../middleware/multer.js";
import adminAuth from "../middleware/adminAuth.js";
import { addProduct, listProducts, removeProduct, singleProduct } from "../controllers/productController.js";

const router = express.Router();

router.post("/add", adminAuth, upload.array("image"), addProduct);
router.get("/list", listProducts);
router.post("/remove", adminAuth, removeProduct);
router.get("/single/:id", singleProduct);

export default router;
