import { Router } from "express";
import { createProduct, getProducts } from "../controllers/Product";
import { auth } from "../middleware/auth";

const router = Router();

//  Get Produxt Routes
router.get("/", getProducts)

// createProducts Routes
router.post("/", auth, createProduct)

export default router;