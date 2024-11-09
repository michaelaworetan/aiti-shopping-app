import { Router } from "express";
import { addProductToCart, createUser, getUsers, signIn } from "../controllers/User";

const router = Router();

//  Get Users Routes
router.get("/", getUsers)

// Create Users Routes
router.post("/", createUser)

// Sign-in users ROutes
router.post("/signin", signIn)

// add products to cart Routes
router.post("/addToCart/:id", addProductToCart)

export default router;