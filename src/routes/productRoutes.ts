import { Router } from "express";
import { createProduct, getProducts } from "../controllers/Product";

const router = Router();

//  Get Produxt Routes
router.get("/", getProducts)

// createProducts Routes
router.post("/", createProduct)

export default router;